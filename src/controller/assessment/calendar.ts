import { formatExceptionResponse, formatJSONResponse, middyfyForFreelancer } from "@libs";
import { calendarService, candidateAssessmentInfoService } from "@service";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/**
 * Get all event types of cal.com
 */
const getEventTypes = middyfyForFreelancer(async (): Promise<APIGatewayProxyResult> => {
  try {
    const allEvents = await calendarService.getEventTypes();

    return formatJSONResponse({
      eventTypes: allEvents.data.event_types,
    });
  } catch (e) {
    return formatExceptionResponse(e);
  }
});

const getBookingByUid = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "getBookingByUid";
      const booking_uid = event.queryStringParameters.booking_uid;
      const booking = await calendarService.getBookingByUid(booking_uid);

      if (booking === undefined || booking === null) {
        throw new Error(`${functionName}: Cannot find any booking matching with the provided time`);
      }

      return formatJSONResponse({
        booking,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

const putBookingUid = middyfyForFreelancer(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const functionName = "putBookingUid";
      const input = JSON.parse(event.body);

      const emailId = input.email_id;
      const bookingUid = input.booking_uid;

      if (emailId === undefined) {
        throw new Error(`${functionName}: emailId is not provided`);
      }

      if (bookingUid === undefined) {
        throw new Error(`${functionName}: bookingUid is not provided`);
      }

      const assessment = await candidateAssessmentInfoService.getOneByEmail(emailId);

      if (assessment?.length < 1) {
        throw new Error(`${functionName}: assessmentInfo not found`);
      }

      const result = await candidateAssessmentInfoService.update({
        ...assessment[0].dataValues,
        booking_uid: bookingUid,
      });

      return formatJSONResponse({
        success: result,
      });
    } catch (e) {
      return formatExceptionResponse(e);
    }
  },
);

export { getEventTypes, getBookingByUid, putBookingUid };
