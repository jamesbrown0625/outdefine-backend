import { APIGatewayProxyResult } from "aws-lambda";

import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { getSyncedDB, getClearedDB } from "@model";

const syncTables = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  try {
    await getSyncedDB();

    return formatJSONResponse({
      success: "Table is successfully synced",
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

const refreshTables = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  try {
    await getClearedDB();

    return formatJSONResponse({
      success: "Table is successfully cleared",
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

export { syncTables, refreshTables };
