import { ENUM_ASSESSMENT_TYPE, ENUM_HACKEREARTH_TEST, getFrontendWebsiteUrl } from "@config";
import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import {
  assessmentTestBankService,
  candidateAssessmentInfoService,
  freelancerProfileService,
  freelancerRewardService,
  hackerearthReportService,
  roleService,
  sendEmail,
  talentReferralHistoryService,
  userService,
  walletService,
} from "@service";
import {
  getAssessmentBehavioralInviteEmail,
  getAssessmentFailedEmail,
  getAssessmentPassedEmail,
  getAssessmentReminderEmail,
  getAssessmentRoleConfirmEmail,
  getReferalPassedAssessmentEmail,
} from "@utils/email";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 * Get the assessment result of the candidate
 * @params test_id: number
 * @params email_id : string
 */
const getCandidateAssessmentInfo = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "getCandidateAssessmentInfo";
      const emailId = event.queryStringParameters.email_id;

      if (emailId === undefined) {
        throw new Error(`${functionName}: email_id is not provided`);
      }

      const result = (await candidateAssessmentInfoService.getOneByEmail(emailId)) as any;
      if (result == null) {
        throw new Error(`There is no report available for this email`);
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
 * Get the assessment result of the candidate
 * @params email_id : string
 */
const getCandidateAssessmentInfoByEmail = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "getCandidateAssessmentInfoByEmail";
      const emailId = event.pathParameters.email_id;

      if (emailId === undefined) {
        throw new Error(`${functionName}: email_id is not provided`);
      }

      const assessment = (
        await candidateAssessmentInfoService.getOrCreateNonEngineeringRow(emailId)
      )?.dataValues;
      if (!assessment) {
        throw new Error(`There is no report available for this email`);
      }

      if (assessment.confirmed_type === ENUM_ASSESSMENT_TYPE[0]) {
        // Engineers need to take other test as well
        const codingTest = await assessmentTestBankService.getGeneralCodingTest();
        if (!codingTest) {
          throw new Error(`${functionName}: Coding Test is still not configured`);
        }

        const mcqTest = await assessmentTestBankService.getOneByTestId(assessment.confirmed_id);
        return formatJSONResponse({
          data: {
            ...assessment,
            assessmentTitle: mcqTest.title,
            mcqTestResult: await hackerearthReportService.getOneByEmailAndType(
              emailId,
              ENUM_HACKEREARTH_TEST[0],
            ),
            codingTestResult: await hackerearthReportService.getOneByEmailAndType(
              emailId,
              ENUM_HACKEREARTH_TEST[1],
            ),
          },
        });
      }

      if (assessment.confirmed_type === ENUM_ASSESSMENT_TYPE[1]) {
        // Non Engineering Roles
        const role = await roleService.getOneById(assessment.confirmed_id);
        if (!role) {
          throw new Error(`${functionName}: role does not exist`);
        }

        return formatJSONResponse({
          data: {
            ...assessment,
            assessmentTitle: role.name,
          },
        });
      }

      return formatJSONResponse({
        data: {
          ...assessment,
        },
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Marked the candidated as passed manually
 * @params email_id : string
 * @params manually_passed: boolean
 */
const updateCandidateManuallyPassed = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "updateCandidateManuallyPassed";
      const input = JSON.parse(event.body);

      const emailId = input.email_id;
      const manuallyPassed = input.manually_passed;

      if (emailId === undefined) {
        throw new Error(`${functionName}: email_id is not provided`);
      }

      if (manuallyPassed === undefined) {
        throw new Error(`${functionName}: flag for manually_passed is not provided`);
      }

      const assessment = await candidateAssessmentInfoService.getOneByEmail(emailId);

      const result = await candidateAssessmentInfoService.markAsManuallyPassed(assessment);

      return formatJSONResponse({
        success: result,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Marked the candidated as interview scheduled
 * @params email_id : string
 */
const updateCandidateInterviewScheduled = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "updateCandidateInterviewScheduled";
      const input = JSON.parse(event.body);

      const emailId = input.email_id;

      if (emailId === undefined) {
        throw new Error(`${functionName}: email_id is not provided`);
      }

      const assessment = await candidateAssessmentInfoService.getOneByEmail(emailId);
      await candidateAssessmentInfoService.markAsInterviewScheduled(assessment[0].dataValues);

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * @dev Confirm candidate role, and test
 * @dev confirmEngineeringRole and confirmNonEngineeringRole
 * @params freelancer_id: number
 * @params id - test_id or role_id
 * @params type - HACKERERTH or RECORD
 */
const confirmCandidateRole = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "confirmCandidateRole";
      const input = JSON.parse(event.body);
      const { id, freelancer_id, type } = input;

      if (freelancer_id === undefined) {
        throw new Error(`${functionName}: freelancer_id is not provided`);
      }
      if (id === undefined) {
        throw new Error(`${functionName}: id is not provided`);
      }
      if (type === undefined) {
        throw new Error(`${functionName}: type is not provided`);
      }

      const user = await userService.getOneByUserId(freelancer_id);
      const assessment = await candidateAssessmentInfoService.getOrCreateNonEngineeringRow(
        user.email_id,
      );

      if (assessment.confirmed) {
        throw new Error(`${functionName}: user is already confirmed the role`);
      }

      let roleName = "";
      if (type === ENUM_ASSESSMENT_TYPE[0]) {
        // Engineers need to take other test as well
        const codingTest = await assessmentTestBankService.getGeneralCodingTest();
        if (!codingTest) {
          throw new Error(`${functionName}: Coding Test is still not configured`);
        }

        const mcqTest = await assessmentTestBankService.getOneByTestId(id);
        roleName = mcqTest.title;
        await candidateAssessmentInfoService.update({
          ...assessment.dataValues,
          confirmed: true,
          confirmed_id: id,
          confirmed_type: type,
          type,
          coding_test_id: codingTest.test_id,
        });
      } else {
        // Non Engineering Roles
        const role = await roleService.getOneById(id);
        if (!role) {
          throw new Error(`${functionName}: role does not exist`);
        }

        roleName = role.name;
        await candidateAssessmentInfoService.update({
          ...assessment.dataValues,
          confirmed: true,
          confirmed_id: id,
          confirmed_type: type,
        });
      }

      // send email
      const emailContent = getAssessmentRoleConfirmEmail(
        `${user.first_name} ${user.last_name}`,
        roleName,
        getFrontendWebsiteUrl(),
      );
      await sendEmail(emailContent, [user.email_id]);

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * @dev Unconfirm candidate role, and test
 * @params freelancer_id: number
 */
const cancelCandidateRoleConfirmation = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "cancelCandidateRoleConfirmation";

      const input = JSON.parse(event.body);
      const freelancerId = input.freelancer_id;

      if (freelancerId === undefined) {
        throw new Error(`${functionName}: freelancerId is not provided`);
      }
      const user = await userService.getOneByUserId(freelancerId);
      const assessment = await candidateAssessmentInfoService.getOrCreateNonEngineeringRow(
        user.email_id,
      );

      await candidateAssessmentInfoService.update({
        ...assessment.dataValues,
        confirmed: false,
      });

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const updateIntroductionStatus = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "updateIntroductionStatus";

      const input = JSON.parse(event.body);
      const emailId = input.email_id;
      const status = input.status;

      if (emailId === undefined) {
        throw new Error(`${functionName}: emailId is not provided`);
      }
      if (status === undefined) {
        throw new Error(`${functionName}: Introduction status is not provided`);
      }

      const assessment = await candidateAssessmentInfoService.getOneByEmail(emailId);
      await candidateAssessmentInfoService.updateOneByEmail({
        ...assessment[0].dataValues,
        introduction_status: status,
      });

      const updated_assessment_info = await candidateAssessmentInfoService.getOneByEmail(emailId);

      return formatJSONResponse({
        data: updated_assessment_info,
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const saveIntroducePanel = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "saveIntroducePanel";
      const { emailId, englishProficiencyRating, englishProficiencyNotes } = JSON.parse(event.body);

      if (!emailId) {
        throw new Error(`${functionName}: emailId is not provided`);
      }
      if (!englishProficiencyRating) {
        throw new Error(`${functionName}: englishProficiencyRating is not provided`);
      }
      if (!englishProficiencyNotes) {
        throw new Error(`${functionName}: englishProficiencyNotes is not provided`);
      }

      // update assessment
      const assessment = await candidateAssessmentInfoService.getOneByEmailId(emailId);
      if (!assessment) {
        throw new Error(`${functionName}: email id is not valid`);
      }

      const notes = {
        ...JSON.parse(assessment.dataValues.notes_taken ?? "{}"),
        englishProficiencyNotes,
      };

      const rating = {
        ...JSON.parse(assessment.dataValues.rating ?? "{}"),
        englishProficiencyRating,
      };

      await candidateAssessmentInfoService.update({
        ...assessment.dataValues,
        notes_taken: JSON.stringify(notes),
        rating: JSON.stringify(rating),
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

const saveCodingAssessmentPanel = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "saveCodingAssessmentPanel";

      const { emailId, codingSkills, codingSkillsRating, codingSkillsNotes } = JSON.parse(
        event.body,
      );

      if (!emailId) {
        throw new Error(`${functionName}: emailId is not provided`);
      }
      if (!codingSkills) {
        throw new Error(`${functionName}: codingSkills is not provided`);
      }
      if (!codingSkillsRating) {
        throw new Error(`${functionName}: codingSkillsRating is not provided`);
      }
      if (!codingSkillsNotes) {
        throw new Error(`${functionName}: codingSkillsNotes is not provided`);
      }

      // update assessment
      const assessment = await candidateAssessmentInfoService.getOneByEmailId(emailId);
      if (!assessment) {
        throw new Error(`${functionName}: email id is not valid`);
      }

      const notes = {
        ...JSON.parse(assessment.dataValues.notes_taken ?? "{}"),
        codingSkillsNotes,
      };

      const rating = {
        ...JSON.parse(assessment.dataValues.rating ?? "{}"),
        codingSkillsRating,
      };

      await candidateAssessmentInfoService.update({
        ...assessment.dataValues,
        notes_taken: JSON.stringify(notes),
        rating: JSON.stringify(rating),
        coding_skills: codingSkills,
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

const saveMcqAssessmentPanel = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "saveMcqAssessmentPanel";

      const { emailId, technicalSkills, technicalSkillsRating, technicalSkillsNotes } = JSON.parse(
        event.body,
      );

      if (!emailId) {
        throw new Error(`${functionName}: emailId is not provided`);
      }
      if (!technicalSkills) {
        throw new Error(`${functionName}: technicalSkills is not provided`);
      }
      if (!technicalSkillsRating) {
        throw new Error(`${functionName}: technicalSkillsRating is not provided`);
      }
      if (!technicalSkillsNotes) {
        throw new Error(`${functionName}: technicalSkillsNotes is not provided`);
      }

      // update assessment
      const assessment = await candidateAssessmentInfoService.getOneByEmailId(emailId);
      if (!assessment) {
        throw new Error(`${functionName}: email id is not valid`);
      }

      const notes = {
        ...JSON.parse(assessment.dataValues.notes_taken ?? "{}"),
        technicalSkillsNotes,
      };

      const rating = {
        ...JSON.parse(assessment.dataValues.rating ?? "{}"),
        technicalSkillsRating,
      };

      await candidateAssessmentInfoService.update({
        ...assessment.dataValues,
        notes_taken: JSON.stringify(notes),
        rating: JSON.stringify(rating),
        technical_skills: technicalSkills,
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

const saveBehavioralInterviewResult = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "saveBehavioralInterviewResult";
      const { emailId, behavioralInterviewRating, behavioralInterviewNotes } = JSON.parse(
        event.body,
      );

      if (!emailId) {
        throw new Error(`${functionName}: emailId is not provided`);
      }
      if (!behavioralInterviewRating) {
        throw new Error(`${functionName}: behavioralInterviewRating is not provided`);
      }
      if (!behavioralInterviewNotes) {
        throw new Error(`${functionName}: behavioralInterviewNotes is not provided`);
      }

      // update assessment
      const assessment = await candidateAssessmentInfoService.getOneByEmailId(emailId);
      if (!assessment) {
        throw new Error(`${functionName}: email id is not valid`);
      }

      const notes = {
        ...JSON.parse(assessment.dataValues.notes_taken ?? "{}"),
        behavioralInterviewNotes,
      };

      const rating = {
        ...JSON.parse(assessment.dataValues.rating ?? "{}"),
        behavioralInterviewRating,
      };

      await candidateAssessmentInfoService.update({
        ...assessment.dataValues,
        notes_taken: JSON.stringify(notes),
        rating: JSON.stringify(rating),
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

const saveTechnicalSkillResult = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "saveTechnicalSkillResult";

      const {
        emailId,
        interviewTechnicalSkills,
        interviewTechnicalSkillsRating,
        interviewTechnicalSkillsNotes,
      } = JSON.parse(event.body);

      if (!emailId) {
        throw new Error(`${functionName}: emailId is not provided`);
      }
      if (!interviewTechnicalSkills) {
        throw new Error(`${functionName}: interviewTechnicalSkills is not provided`);
      }
      if (!interviewTechnicalSkillsRating) {
        throw new Error(`${functionName}: interviewTechnicalSkillsRating is not provided`);
      }
      if (!interviewTechnicalSkillsNotes) {
        throw new Error(`${functionName}: interviewTechnicalSkillsNotes is not provided`);
      }

      // update assessment
      const assessment = await candidateAssessmentInfoService.getOneByEmailId(emailId);
      if (!assessment) {
        throw new Error(`${functionName}: email id is not valid`);
      }

      const notes = {
        ...JSON.parse(assessment.dataValues.notes_taken ?? "{}"),
        interviewTechnicalSkillsNotes,
      };

      const rating = {
        ...JSON.parse(assessment.dataValues.rating ?? "{}"),
        interviewTechnicalSkillsRating,
      };

      await candidateAssessmentInfoService.update({
        ...assessment.dataValues,
        notes_taken: JSON.stringify(notes),
        rating: JSON.stringify(rating),
        interview_technical_skills: interviewTechnicalSkills,
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

const moveToVet = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "moveToVet";

      const input = JSON.parse(event.body);
      const emailId = input.emailId;

      if (emailId === undefined) {
        throw new Error(`${functionName}: freelancerId is not provided`);
      }

      const assessment = await candidateAssessmentInfoService.getOneByEmailId(emailId);
      if (!assessment) {
        throw new Error(`${functionName}: email id is not valid`);
      }

      await candidateAssessmentInfoService.update({
        ...assessment.dataValues,
        introduction_status: "PASSED",
        mcq_passed: true,
        coding_passed: true,
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

const makeTrustedMember = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "makeTrustedMember";

      const input = JSON.parse(event.body);
      const emailId = input.emailId;
      const name = input.name;
      const userId = input.userId;

      if (emailId === undefined) {
        throw new Error(`${functionName}: freelancerId is not provided`);
      }
      if (userId === undefined) {
        throw new Error(`${functionName}: userId is not provided`);
      }
      if (name === undefined) {
        throw new Error(`${functionName}: Name is not provided`);
      }

      // const freelancerProfile = await freelancerProfileService.getOneById(userId);

      // update assessment
      const assessment = await candidateAssessmentInfoService.getOneByEmail(emailId);
      await candidateAssessmentInfoService.update({
        ...assessment[0].dataValues,
        introduction_status: "PASSED",
        mcq_passed: true,
        coding_passed: true,
        interview_status: "PASSED",
      });
      await freelancerProfileService.updateTrustedStatus(emailId, "TRUSTED");

      // const role = await roleService
      //   .getOneById(freelancerProfile.role)
      //   .then((response) => response.name)
      //   .catch(() => {
      //     throw new Error(`Something wrong with role confirmation with the candidate`);
      //   });

      // send email
      const emailContent = getAssessmentPassedEmail(name, getFrontendWebsiteUrl());
      await sendEmail(emailContent, [emailId]);

      // reward the user with 500 tokens
      await freelancerRewardService.create({
        user_id: userId,
        amount: 500,
        status: "COMPLETED",
        received_from: "ASSESSMENTS",
      });
      await walletService.deposit({
        user_id: userId,
        amount: 500,
      });

      // reward the referrer if exists
      const referrerEmails = await talentReferralHistoryService.getReferrerEmails(emailId);
      if (referrerEmails) {
        const referrerId = referrerEmails.talent_referral.user_id;
        await freelancerRewardService.create({
          user_id: referrerId,
          amount: 250,
          received_from: "REFERRAL",
          status: "COMPLETED",
        });
        await walletService.deposit({
          user_id: referrerId,
          amount: 250,
        });

        // send email to referrer as well
        const user = await userService.getOneByUserId(userId);
        const referrer = await userService.getOneByUserId(referrerId);

        if (user === null) throw new Error(`User with id ${userId} does not exist`);
        if (referrer === null) throw new Error(`Referred user with id ${referrer} does not exist`);

        const emailContent = getReferalPassedAssessmentEmail(
          `${referrer.first_name}, ${referrer.last_name}`,
          `${user.first_name}, ${user.last_name}`,
          getFrontendWebsiteUrl(),
        );
        await sendEmail(emailContent, [referrer.email_id]);
      }

      // return updated assessment info
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

const declineTalent = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "declineTalent";

      const input = JSON.parse(event.body);
      const emailId = input.emailId;
      const stage = input.stage;
      const name = input.name;

      if (emailId === undefined) {
        throw new Error(`${functionName}: emailId is not provided`);
      }
      if (stage !== "assessment" && stage !== "interview") {
        throw new Error(`${functionName}: stage is not provided`);
      }
      if (name === undefined) {
        throw new Error(`${functionName}: name is not provided`);
      }

      // update assessment
      const assessment = await candidateAssessmentInfoService.getOneByEmail(emailId);
      await candidateAssessmentInfoService.update({
        ...assessment[0].dataValues,
        [stage === "assessment" ? "introduction_status" : "interview_status"]: "FAILED",
      });
      await freelancerProfileService.updateTrustedStatus(emailId, "FAILED");
      // send email
      const emailContent = getAssessmentFailedEmail(getFrontendWebsiteUrl());
      await sendEmail(emailContent, [emailId]);

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

const sendInterviewEmailReminder = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "sendInterviewEmailReminder";

      const input = JSON.parse(event.body);
      const emailId = input.emailId;
      const name = input.name;
      if (emailId === undefined) {
        throw new Error(`${functionName}: emailId is not provided`);
      }
      if (name === undefined) {
        throw new Error(`${functionName}: name is not provided`);
      }

      const emailContent = getAssessmentBehavioralInviteEmail(getFrontendWebsiteUrl());
      await sendEmail(emailContent, [emailId]);
      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const sendAssessmentEmailReminder = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "sendAssessmentEmailReminder";

      const input = JSON.parse(event.body);
      const emailId = input.emailId;
      const name = input.name;
      if (emailId === undefined) {
        throw new Error(`${functionName}: emailId is not provided`);
      }
      if (name === undefined) {
        throw new Error(`${functionName}: name is not provided`);
      }

      const emailContent = getAssessmentReminderEmail(name, getFrontendWebsiteUrl());
      await sendEmail(emailContent, [emailId]);
      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export {
  getCandidateAssessmentInfo,
  getCandidateAssessmentInfoByEmail,
  updateCandidateManuallyPassed,
  updateCandidateInterviewScheduled,
  confirmCandidateRole,
  cancelCandidateRoleConfirmation,
  updateIntroductionStatus,
  // admin
  saveIntroducePanel,
  saveCodingAssessmentPanel,
  saveMcqAssessmentPanel,
  saveBehavioralInterviewResult,
  saveTechnicalSkillResult,
  moveToVet,
  makeTrustedMember,
  declineTalent,
  sendInterviewEmailReminder,
  sendAssessmentEmailReminder,
};
