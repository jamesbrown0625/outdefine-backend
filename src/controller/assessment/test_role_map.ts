import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { testRoleMapService } from "src/service/assessment/test_role_map";

const getAllTestRoleMaps = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  try {
    const roleMaps = await testRoleMapService.getAll();

    return formatJSONResponse({
      data: roleMaps,
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

/**
 * @params role_id : number
 * @params test_id : number
 */
const addTestRoleMap = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const roleId = input.role_id;
      const testId = input.test_id;

      if (roleId === undefined) {
        throw new Error("Role Id is not provided");
      }

      if (testId === undefined) {
        throw new Error("Test Id is not provided");
      }

      await testRoleMapService.addTestId(roleId, testId);

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

/**
 * @params role_id : number
 * @params test_id : number
 */
const removeTestId = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      const roleId = input.role_id;
      const testId = input.test_id;

      if (roleId === undefined) {
        throw new Error("Role Id is not provided");
      }

      if (testId === undefined) {
        throw new Error("Test Id is not provided");
      }

      await testRoleMapService.removeTestId(roleId, testId);

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { getAllTestRoleMaps, addTestRoleMap, removeTestId };
