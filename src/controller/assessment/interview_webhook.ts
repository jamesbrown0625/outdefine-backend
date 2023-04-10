import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { candidateAssessmentInfoService } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const handleWebHook = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const hookBody = JSON.parse(JSON.stringify(event.body));
      console.log("log started");
      const { triggerEvent, payload } = hookBody;
      const { attendees, uid, rescheduleUid, rejectionReason, cancellationReason } = payload;

      let isRejected = false;
      if (rejectionReason) isRejected = true;
      else if (cancellationReason) isRejected = false;

      console.log({ triggerEvent });
      console.log("attendees: ", attendees);
      console.log({ uid });
      console.log({ rescheduleUid });

      if (attendees?.length < 1) {
        throw new Error(`No attendees`);
      }
      console.log("email: ", attendees[0].email);

      const assessment = await candidateAssessmentInfoService.getOneByEmail(attendees[0].email);
      if (assessment?.length < 1) {
        throw new Error(`No assessment info found with given email address`);
      }

      console.log("data: ", assessment[0].dataValues);

      switch (triggerEvent) {
        case "BOOKING_CREATED":
          await candidateAssessmentInfoService.update({
            ...assessment[0].dataValues,
            booking_uid: uid,
          });
          break;
        case "BOOKING_RESCHEDULED":
          await candidateAssessmentInfoService.update({
            ...assessment[0].dataValues,
            booking_uid: uid,
          });
          break;
        case "BOOKING_CANCELLED":
          await candidateAssessmentInfoService.update({
            ...assessment[0].dataValues,
            booking_uid: `[Cancelled]${isRejected ? rejectionReason : cancellationReason}`,
          });
          break;
        case "MEETING_ENDED":
          await candidateAssessmentInfoService.update({
            ...assessment[0].dataValues,
            booking_uid: "[Ended]",
          });
          break;
        default:
      }

      const result = await candidateAssessmentInfoService.getOneByEmail(attendees[0].email);

      return formatJSONResponse({
        data: result[0].dataValues,
        success: true,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { handleWebHook };
