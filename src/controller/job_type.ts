import { APIGatewayProxyResult } from "aws-lambda";

import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { jobTypeService, roleService, skillService } from "@service";
import { jobTypes } from "@config";
import { IRole } from "@interface";

const getAll = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  const all = await jobTypeService.getAll();
  return formatJSONResponse({
    all,
  });
});

const initTable = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  try {
    await jobTypeService.remove();
    await roleService.remove();
    await skillService.remove();

    for (let i = 0; i < jobTypes.length; i++) {
      const data: IRole = jobTypes[i];
      const jobType = await jobTypeService.create(data);
      await jobTypeService.addRoles(jobType, jobTypes[i].roles);
    }

    const all = await jobTypeService.getAll();
    return formatJSONResponse({
      success: all,
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

export { getAll, initTable };
