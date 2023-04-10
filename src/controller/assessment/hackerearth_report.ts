import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import {
  candidateAssessmentInfoService,
  hackerearthReportLogService,
  hackerearthReportService,
} from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 * @params email_id: string
 * @params test_id: number
 */
const putToHackerEarthreportLogs = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const emailId = input.email_id;
      const testId = input.test_id;

      if (emailId === undefined) {
        throw new Error("Email is not provided");
      }

      if (testId === undefined) {
        throw new Error("Test id is not provided");
      }

      const assessmentInfo = await candidateAssessmentInfoService.createOrGetOneByEmail(emailId);

      const hackerearthReport = await hackerearthReportService.createOrUpdate({
        assessment_id: assessmentInfo.id,
        test_id: testId,
        email: emailId,
      });

      // Save candidate assessment result to hackerearth logs table
      const reportLog = await hackerearthReportLogService.create({
        assessment_id: hackerearthReport.dataValues.assessment_id,
        start_datetime: hackerearthReport.dataValues.start_datetime,
        finish_datetime: hackerearthReport.dataValues.finish_datetime,
        time_taken: hackerearthReport.dataValues.time_taken,
        score: hackerearthReport.dataValues.score,
        percentage: hackerearthReport.dataValues.percentage,
        status: hackerearthReport.dataValues.status,
        questions_attempted: hackerearthReport.dataValues.questions_attempted,
        problem_type_scores: hackerearthReport.dataValues.problem_type_scores,
        section_scores: hackerearthReport.dataValues.section_scores,
        full_report_url: hackerearthReport.dataValues.full_report_url,
        candidate_assessment_report_url:
          hackerearthReport.dataValues.candidate_assessment_report_url,
        anon_report_url: hackerearthReport.dataValues.anon_report_url,
      });

      await assessmentInfo.addHackerearthReportLog(reportLog.id);

      console.log("--------report log", reportLog);

      // Update relationship
      await assessmentInfo.setHackerearthReport(hackerearthReport.assessment_id);

      const result = await candidateAssessmentInfoService.getOneByEmail(emailId);

      return formatJSONResponse({
        data: result,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { putToHackerEarthreportLogs };
