import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { upload } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { msaAgreementService } from "src/service/client/msa";

const getAllMSAs = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  try {
    const data = await msaAgreementService.getAll();

    return formatJSONResponse({
      data,
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

const uploadMSA = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const version = event.pathParameters.version;

      if (version === undefined) {
        throw new Error("Version is not provided");
      }

      const msa = await msaAgreementService.getOneByVersion(version);
      if (msa !== null) {
        throw new Error(`Same version already exists`);
      }

      // Upload file to S3 and get the link
      const link = await upload(event);
      const data = await msaAgreementService.create({
        msa_version: version,
        s3_url: link,
      });

      return formatJSONResponse({
        success: true,
        data,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const selectActiveMSA = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const input = JSON.parse(event.body);
      if (input.msa_id === undefined) {
        throw new Error("MSA id is not provided");
      }

      const msa = await msaAgreementService.getOneById(input.msa_id);
      if (msa === null) {
        throw new Error(`msa_id is not valid`);
      }

      await msaAgreementService.selectOneMSA(input.msa_id);
      return formatJSONResponse({
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const getActiveMSA = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  try {
    const item = await msaAgreementService.getOneByActive();
    return formatJSONResponse({
      success: true,
      data: item,
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

export { getAllMSAs, uploadMSA, selectActiveMSA, getActiveMSA };
