import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { jobSaveService } from "@service";

const getAll = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const freelancer_id = event.queryStringParameters.freelancer_id;

      if (!freelancer_id) {
        throw new Error("Freelancer id is needed");
      }

      const saved_jobs = await jobSaveService.getAll(parseInt(freelancer_id));

      return formatJSONResponse({
        jobs: saved_jobs,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const saveAJob = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const arg = JSON.parse(event.body);

      const { freelancer_id, job_id } = arg;

      if (!freelancer_id) {
        throw new Error("Freelancer id is needed");
      }

      if (!job_id) {
        throw new Error("Job id is needed");
      }

      await jobSaveService.saveAJob(parseInt(freelancer_id), parseInt(job_id));

      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { getAll, saveAJob };
