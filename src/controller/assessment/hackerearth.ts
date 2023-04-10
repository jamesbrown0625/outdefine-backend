import { ENUM_HACKEREARTH_TEST } from "@config";
import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import {
  assessmentTestBankService,
  candidateAssessmentInfoService,
  hackerearthReportService,
  hackerEarthService,
} from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 * start the assessment for mcq test
 * @params email_id : string
 */
const startMcqAssessment = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "startMcqAssessment";
      const input = JSON.parse(event.body);
      const emailId = input.email_id;

      if (emailId === undefined) {
        throw new Error(`${functionName}: email_id is not provided`);
      }

      const assessmentInfo = await candidateAssessmentInfoService.createOrGetOneByEmail(emailId);
      if (assessmentInfo.confirmed !== true) {
        throw new Error(`${functionName}: talent is not yet confirmed with the role`);
      }

      if (assessmentInfo.mcq_passed === true) {
        throw new Error(`${functionName}: Candidate already passed this assessment`);
      }

      if (!assessmentInfo.confirmed_id) {
        throw new Error(`${functionName}: Candidate test id is not valid`);
      }

      // Candidate already take assessment
      if (assessmentInfo.mcq_taken_count >= 3) {
        const report = await hackerearthReportService.getOneByEmailAndType(
          emailId,
          ENUM_HACKEREARTH_TEST[0],
        );
        if (report === null) {
          throw new Error(
            `${functionName}: Hackerearth Candidate Report of pass assessment is empty`,
          );
        }

        // If candidate reset the test within 3 months, then throw exception
        let lastTimeTaken = report.finish_datetime.split("T");
        lastTimeTaken = new Date(lastTimeTaken).valueOf();
        const today = new Date().valueOf();
        const numberOfDays = Math.ceil((today - lastTimeTaken) / 8.64e7); // 31

        if (numberOfDays < 30 * 3) {
          throw new Error(
            `${functionName}: Candidate can't take the same assessment more than 3 times`,
          );
        }

        await candidateAssessmentInfoService.initAssessmentTakenCount(
          assessmentInfo.dataValues,
          ENUM_HACKEREARTH_TEST[0],
        );
      }

      // Candidate didn't take any assessment yet
      if (assessmentInfo.mcq_taken_count === 0) {
        let result = (await hackerEarthService.inviteCandidate(
          assessmentInfo.confirmed_id,
          emailId,
        )) as any;
        result = result.data;
        if (result.mcode !== "success") {
          throw new Error(`Hacker Earth Invite Candidate Api Call Failed`);
        }

        if (!result.ecode.includes("TESTTAKEN")) {
          const params = result.extra_parameters;

          return formatJSONResponse({
            data: params,
          });
        }
      }

      // Reset the test
      let result = (await hackerEarthService.resetTest(
        assessmentInfo.confirmed_id,
        emailId,
      )) as any;
      result = result.data;
      if (result.mcode !== "success") {
        throw new Error(`Hacker Earth Reset Test Api Call Failed`);
      }

      return formatJSONResponse({
        data: result,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * start the assessment for coding test
 * @params email_id : string
 */
const startCodingAssessment = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "startCodingAssessment";
      const input = JSON.parse(event.body);
      const emailId = input.email_id;

      if (emailId === undefined) {
        throw new Error(`${functionName}: email_id is not provided`);
      }

      const assessmentInfo = await candidateAssessmentInfoService.createOrGetOneByEmail(emailId);
      if (assessmentInfo.confirmed !== true) {
        throw new Error(`${functionName}: talent is not yet confirmed with the role`);
      }

      if (assessmentInfo.coding_passed === true) {
        throw new Error(`${functionName}: Candidate already passed this assessment`);
      }

      if (!assessmentInfo.coding_test_id) {
        const codingTest = await assessmentTestBankService.getGeneralCodingTest();
        if (!codingTest) {
          throw new Error(`${functionName}: Coding Test is still not configured`);
        }

        assessmentInfo.coding_test_id = codingTest.test_id;
      }

      // Candidate already take assessment
      if (assessmentInfo.coding_taken_count >= 3) {
        const report = await hackerearthReportService.getOneByEmailAndType(
          emailId,
          ENUM_HACKEREARTH_TEST[1],
        );
        if (report === null) {
          throw new Error(`${functionName}: Hackerearth Candidate Report of assessment is empty`);
        }

        // If candidate reset the test within 3 months, then throw exception
        let lastTimeTaken = report.finish_datetime.split("T");
        lastTimeTaken = new Date(lastTimeTaken).valueOf();
        const today = new Date().valueOf();
        const numberOfDays = Math.ceil((today - lastTimeTaken) / 8.64e7); // 31

        if (numberOfDays < 30 * 3) {
          throw new Error(
            `${functionName}: Candidate can't take the same assessment more than 3 times`,
          );
        }

        await candidateAssessmentInfoService.initAssessmentTakenCount(
          assessmentInfo.dataValues,
          ENUM_HACKEREARTH_TEST[1],
        );
      }

      // Candidate didn't take any assessment yet
      if (assessmentInfo.coding_taken_count === 0) {
        let result = (await hackerEarthService.inviteCandidate(
          assessmentInfo.coding_test_id,
          emailId,
        )) as any;
        result = result.data;
        if (result.mcode !== "success") {
          throw new Error(`Hacker Earth Invite Candidate Api Call Failed`);
        }

        if (!result.ecode.includes("TESTTAKEN")) {
          const params = result.extra_parameters;

          return formatJSONResponse({
            data: params,
          });
        }
      }

      // Reset the test
      let result = (await hackerEarthService.resetTest(
        assessmentInfo.coding_test_id,
        emailId,
      )) as any;
      result = result.data;
      if (result.mcode !== "success") {
        throw new Error(`Hacker Earth Reset Test Api Call Failed`);
      }

      return formatJSONResponse({
        data: result,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Retake the assessment
 * @params test_id: number
 * @params email_id : string
 */
const resetAssessment = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "resetAssessment";
      const input = JSON.parse(event.body);

      if (input.test_id === undefined) {
        throw new Error(`${functionName}: test_id is not provided`);
      }

      if (input.email_id === undefined) {
        throw new Error(`${functionName}: email_id is not provided`);
      }

      // Reset the test
      let result = (await hackerEarthService.resetTest(input.test_id, input.email_id)) as any;
      result = result.data;
      if (result.mcode !== "success") {
        throw new Error(`Hacker Earth Reset Test Api Call Failed`);
      }

      return formatJSONResponse({
        data: result,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Invite the candidate to the assessment
 * @params test_id: number
 * @params email_id : string
 */
const cancelInvite = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "cancelInvite";
      const input = JSON.parse(event.body);

      if (input.test_id === undefined) {
        throw new Error(`${functionName}: test_id is not provided`);
      }

      if (input.email_id === undefined) {
        throw new Error(`${functionName}: email_id is not provided`);
      }

      let result = (await hackerEarthService.cancelInvite(input.test_id, input.email_id)) as any;
      result = result.data;
      if (result.mcode !== "success") {
        throw new Error(`Hacker Earth Cancel Invite Api Call Failed`);
      }

      return formatJSONResponse({
        data: result,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Delete a test
 * @params test_id: number
 */
const deleteTest = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "delete_test";
      const input = JSON.parse(event.body);

      if (input.test_id === undefined) {
        throw new Error(`${functionName}: test_id is not provided`);
      }

      let result = (await hackerEarthService.deleteTest(input.test_id)) as any;
      result = result.data;
      if (result.mcode !== "success") {
        throw new Error(`Hacker Earth Delete Test Api Call Failed`);
      }

      return formatJSONResponse({
        data: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Publish a test
 * @params test_id: number
 */
const publishTest = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "publish_test";
      const input = JSON.parse(event.body);

      if (input.test_id === undefined) {
        throw new Error(`${functionName}: test_id is not provided`);
      }

      const result = (await hackerEarthService.publishTest(input.test_id)) as any;
      // result = result.data
      // if (result.mcode !== 'success') { throw new Error(`Hacker Earth Publish Test Api Call Failed`) }

      return formatJSONResponse({
        data: result,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export {
  startMcqAssessment,
  startCodingAssessment,
  cancelInvite,
  deleteTest,
  publishTest,
  resetAssessment,
};
