import { getFrontendWebsiteUrl } from "@config";
import { IAssessmentTestBank } from "@interface";
import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import {
  assessmentTestBankService,
  assessmentWebhookEventLogService,
  candidateAssessmentInfoService,
  hackerearthReportLogService,
  hackerearthReportService,
  sendEmail,
} from "@service";
import { getAssessmentOneMoreAttemptEmail } from "@utils/email";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const candidateTestStarted = async (payload: any) => {
  const assessmentInfo = await candidateAssessmentInfoService.createOrGetOneByEmail(payload.email);

  await hackerearthReportService.createOrUpdateWithEmailAndType({
    assessment_id: assessmentInfo.id,
    test_id: payload.test_id,
    email: payload.email,
    start_datetime: payload.start_datetime,
    type: candidateAssessmentInfoService.getHackerearthReportType(assessmentInfo, payload.test_id),
  });
};

const candidateEndTest = async (payload: any) => {
  const assessmentInfo = await candidateAssessmentInfoService.createOrGetOneByEmail(payload.email);
  const type = candidateAssessmentInfoService.getHackerearthReportType(
    assessmentInfo,
    payload.test_id,
  );

  const hackerearthReport = await hackerearthReportService.createOrUpdateWithEmailAndType({
    assessment_id: assessmentInfo.id,
    test_id: payload.test_id,
    email: payload.email,
    finish_datetime: payload.finish_datetime,
    type,
  });

  // Save candidate assessment result to hackerearth logs table
  await hackerearthReportLogService.create({
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
    candidate_assessment_report_url: hackerearthReport.dataValues.candidate_assessment_report_url,
    anon_report_url: hackerearthReport.dataValues.anon_report_url,
  });

  // If second assessment is failed again, send email
  if (
    type === "MCQ" &&
    assessmentInfo.mcq_passed === false &&
    assessmentInfo.assessment_taken_count === 1
  ) {
    const emailContent = getAssessmentOneMoreAttemptEmail(getFrontendWebsiteUrl());
    await sendEmail(emailContent, [payload.email]);
  }

  if (
    type === "CODING" &&
    assessmentInfo.coding_passed === false &&
    assessmentInfo.assessment_taken_count === 1
  ) {
    const emailContent = getAssessmentOneMoreAttemptEmail(getFrontendWebsiteUrl());
    await sendEmail(emailContent, [payload.email]);
  }

  // Increrase assessment taken count by 1
  await candidateAssessmentInfoService.addAssessmentTakenCount(
    assessmentInfo.dataValues,
    hackerearthReport.type,
  );
};

const candidateReportUpdated = async (payload: any) => {
  const assessmentInfo = await candidateAssessmentInfoService.createOrGetOneByEmail(payload.email);

  const hackerearthReport = await hackerearthReportService.createOrUpdateWithEmailAndType({
    assessment_id: assessmentInfo.id,
    test_id: payload.test_id,
    email: payload.email,
    name: payload.name,
    start_datetime: payload.start_datetime,
    finish_datetime: payload.finish_datetime,
    time_taken: payload.time_taken,
    score: payload.score,
    percentage: payload.percentage,
    status: payload.status,
    questions_attempted: payload.questions_attempted,
    problem_type_scores: JSON.stringify(payload.problem_type_scores),
    section_scores: JSON.stringify(payload.section_scores),
    full_report_url: payload.full_report_url,
    candidate_assessment_report_url: payload.candidate_assessment_report_url,
    anon_report_url: payload.anon_report_url,
    phone_number: payload.phone_number,
    institute: payload.institute,
    graduation_year: payload.graduation_year,
    candidate_id: payload.candidate_id,
    custom_details: JSON.stringify(payload.custom_details),
    type: candidateAssessmentInfoService.getHackerearthReportType(assessmentInfo, payload.test_id),
  });

  // If score is more than 80%, then mark as passed
  const testBankItem = await assessmentTestBankService.getOneByTestId(payload.test_id);
  if (testBankItem === null) return;

  const cutoff_score = testBankItem.cutoff_score;
  if (cutoff_score != null && payload.score >= cutoff_score) {
    await candidateAssessmentInfoService.markAsPassed(
      assessmentInfo.dataValues,
      hackerearthReport.type,
    );
  }
};

const assessmentConfigUpdated = async (payload: IAssessmentTestBank) => {
  await assessmentTestBankService.createOrUpdate({
    test_id: payload.test_id,
    title: payload.title,
    slug: payload.slug,
    duration: payload.duration,
    creation_datetime: payload.creation_datetime,
    start_datetime: payload.start_datetime,
    end_datetime: payload.end_datetime,
    cutoff_score: payload.cutoff_score,
  });
};

/*
const hackerEarthAuthenticate = (heSignature: any, eventBody: any) => {
  let timestamp = heSignature.split(",")[0];
  timestamp = timestamp.split("=")[1];

  let signature = heSignature.split(",")[1];
  signature = signature.split("=")[1];

  console.log("Header data is, ", heSignature);
  console.log("EventBody is ,", eventBody);
  console.log("timestamp: ", timestamp);

  const hash = crypto
    .createHmac("sha256", getHackerearthApiSecretKey())
    .update(timestamp + "." + eventBody)
    .digest("hex");

  if (signature !== hash) {
    return false;
  }
  if (Date.now() - timestamp > 60 * 10) return false;
  return true;
}; */

const handleWebHook = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const hookBody = JSON.parse(JSON.stringify(event.body));
      // const authenticated = hackerEarthAuthenticate(
      //   event.headers['HE-Signature'],
      //   JSON.stringify(event.body),
      // )

      // if (!authenticated) {
      //   throw new Error('Hackerearth webhook api authentication failed')
      // }

      switch (hookBody.webhook_event_type) {
        case "CANDIDATE_TEST_STARTED": {
          // 1) Candidate starts the test
          await candidateTestStarted(hookBody.webhook_payload);
          break;
        }
        case "CANDIDATE_TEST_FINISHED": {
          // 2) Candidate ends the test
          await candidateEndTest(hookBody.webhook_payload);
          break;
        }
        case "CANDIDATE_REPORT_UPDATED": {
          // 3) Candidate report updated
          await candidateReportUpdated(hookBody.webhook_payload);
          break;
        }
        case "TEST_CONFIG_UPDATED": {
          // 4) Assessment Config updated
          await assessmentConfigUpdated(hookBody.webhook_payload);
          break;
        }
      }
      const eventLog = await assessmentWebhookEventLogService.create({
        webhook_event_id: hookBody.webhook_event_id,
        webhook_event_type: hookBody.webhook_event_type,
        webhook_attempt_number: hookBody.webhook_attempt_number,
        webhook_payload: JSON.stringify(hookBody.webhook_payload),
      });

      return formatJSONResponse({
        data: eventLog,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { handleWebHook };
