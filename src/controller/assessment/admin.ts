import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { candidateAssessmentInfoService } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const markIntroductionAsPassed = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "markIntroductionAsPassed";
      const { emailId } = JSON.parse(event.body);

      if (emailId === undefined) {
        throw new Error(`${functionName}: freelancerId is not provided`);
      }

      const assessment = await candidateAssessmentInfoService.getOneByEmailId(emailId);
      if (!assessment) {
        throw new Error(`${functionName}: email id is not valid`);
      }

      // update assessment as passed
      await candidateAssessmentInfoService.update({
        ...assessment.dataValues,
        introduction_status: "PASSED",
      });

      const updated_assessment = await candidateAssessmentInfoService.getOneByEmail(emailId);
      return formatJSONResponse({
        data: updated_assessment,
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const markHackerearthAsPassed = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "markHackerearthAsPassed";
      const { emailId } = JSON.parse(event.body);

      if (emailId === undefined) {
        throw new Error(`${functionName}: freelancerId is not provided`);
      }

      const assessment = await candidateAssessmentInfoService.getOneByEmailId(emailId);
      if (!assessment) {
        throw new Error(`${functionName}: email id is not valid`);
      }

      // update assessment as passed
      await candidateAssessmentInfoService.update({
        ...assessment.dataValues,
        hackerearth_status: "PASSED",
      });

      const updated_assessment = await candidateAssessmentInfoService.getOneByEmail(emailId);
      return formatJSONResponse({
        data: updated_assessment,
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const markInterviewAsPassed = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "markInterviewAsPassed";
      const { emailId } = JSON.parse(event.body);

      if (emailId === undefined) {
        throw new Error(`${functionName}: freelancerId is not provided`);
      }

      const assessment = await candidateAssessmentInfoService.getOneByEmailId(emailId);
      if (!assessment) {
        throw new Error(`${functionName}: email id is not valid`);
      }

      // update assessment as passed
      await candidateAssessmentInfoService.update({
        ...assessment.dataValues,
        interview_status: "PASSED",
      });

      const updated_assessment = await candidateAssessmentInfoService.getOneByEmail(emailId);
      return formatJSONResponse({
        data: updated_assessment,
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { markIntroductionAsPassed, markHackerearthAsPassed, markInterviewAsPassed };
