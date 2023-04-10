import { APIGatewayProxyResult } from "aws-lambda";

import { formatJSONResponse, middyfyForFreelancer } from "@libs";
import { skillService } from "@service";

const getAll = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  const all = await skillService.getAll();
  return formatJSONResponse({
    all,
  });
});

export {
  getAll,
};
