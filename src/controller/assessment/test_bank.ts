import { ENUM_ASSESSMENT_TYPE } from "@config";
import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import {
  assessmentTestBankService,
  candidateAssessmentInfoService,
  freelancerProfileService,
  hackerEarthService,
  jobTypeService,
  roleService,
  userService,
} from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const getAllTestBanks = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  try {
    const tests = await assessmentTestBankService.getAll();

    return formatJSONResponse({
      data: tests,
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

/**
 * @params role_id : number
 */
const getAssessmentByRoleId = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const roleId = input.role_id;

      if (roleId === undefined) {
        throw new Error("Role Id is not provided");
      }

      const role = await roleService.getOneById(roleId);

      if (role === null) {
        throw new Error("Role Id is invalid");
      }

      const roleName = role.name.split(" ")[0];
      const assessment = await assessmentTestBankService.getOneByName(roleName);

      if (assessment === null) {
        throw new Error("There is no assessment available for this role");
      }

      return formatJSONResponse({
        assessment,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * Get the assessment for a freelancer specified by email_id
 * @params email_id : number
 */
const getAssessmentForFreelancer = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const emailId = input.email_id;

      if (emailId === undefined) {
        throw new Error("Email is not provided");
      }

      const user = await userService.getOneByEmail(emailId);
      if (user === null) {
        throw new Error(`User doesn't exist`);
      }

      const freelancerProfile = await freelancerProfileService.createOrGetOne(user.user_id);
      if (freelancerProfile === null) {
        throw new Error("Freelancer Profile is undefined");
      }

      const roleId = freelancerProfile.role;
      const role = await roleService.getOneById(roleId);

      if (role === null) {
        throw new Error("Freelancer Primary Role is not specified yet");
      }

      if (
        !role.name.toLowerCase().includes("engineer") &&
        !role.name.toLowerCase().includes("developer")
      ) {
        // Non-Engineering Assessments
        const assessment = await candidateAssessmentInfoService.getOrCreateNonEngineeringRow(
          emailId,
        );

        return formatJSONResponse({
          assessmentType: ENUM_ASSESSMENT_TYPE[1],
          data: assessment,
        });
      }

      const roleName = role.name.split(" ")[0];
      const assessment = await assessmentTestBankService.getOneByName(roleName);

      if (assessment === null) {
        throw new Error("There is no assessment available for this role");
      }

      return formatJSONResponse({
        assessmentType: ENUM_ASSESSMENT_TYPE[0],
        assessment,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const syncTableLists = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  try {
    let result = (await hackerEarthService.getTestLists()) as any;
    result = result.data;
    if (result.mcode !== "success") {
      throw new Error(`Hacker Earth Event List Api Failed`);
    }

    const tests = result.events;

    await assessmentTestBankService.remove();
    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      if (!test.title.includes("-v1.1")) {
        continue;
      }

      await assessmentTestBankService.createOrUpdate({
        test_id: test.id,
        ...test,
        title: test.title.slice(0, test.title.length - 5),
        cutoff_score: test.cutoff_score,
        problem_types_data: JSON.stringify(test.problem_types_data),
      });
    }

    return formatJSONResponse({
      success: true,
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

/**
 * Set the test type to general coding
 * @params email_id : number
 */
const setToGeneralCodingTest = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const testId = input.test_id;

      if (testId === undefined) {
        throw new Error("Test id is not provided");
      }

      const test = await assessmentTestBankService.getOneByTestId(testId);
      if (test === null) {
        throw new Error("Test id is not valid");
      }

      await assessmentTestBankService.setToGeneralCoding(testId);

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const getAssessmentData = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  try {
    let data = await assessmentTestBankService.getMcqTests();
    data = data.map((item) => ({
      name: item.title,
      id: item.test_id,
      type: ENUM_ASSESSMENT_TYPE[0],
    }));

    let productDesignRoles = await jobTypeService.getOneByName("Product & Design");
    productDesignRoles = productDesignRoles.roles.map((item) => ({
      name: item.name,
      id: item.role_id,
      type: ENUM_ASSESSMENT_TYPE[1],
    }));

    let businessRoles = await jobTypeService.getOneByName("Business");
    businessRoles = businessRoles.roles.map((item) => ({
      name: item.name,
      id: item.role_id,
      type: ENUM_ASSESSMENT_TYPE[1],
    }));

    return formatJSONResponse({
      data: {
        Engineering: data,
        "Product & Design": productDesignRoles,
        Business: businessRoles,
      },
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

export {
  getAllTestBanks,
  syncTableLists,
  getAssessmentForFreelancer,
  getAssessmentByRoleId,
  setToGeneralCodingTest,
  getAssessmentData,
};
