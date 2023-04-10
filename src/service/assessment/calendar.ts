import axios from "axios";
import { CAL_API_KEYS } from "@config";

class CalendarService {
  async getEventTypes() {
    const result = await axios.get(`https://api.cal.com/v1/event-types?apiKey=${CAL_API_KEYS[0]}`);
    return result;
  }

  async getAttendees() {
    const result = await axios.get(`https://api.cal.com/v1/attendees?apiKey=${CAL_API_KEYS[0]}`);
    return result;
  }

  async getBookings() {
    const result = await axios.get(`https://api.cal.com/v1/bookings?apiKey=${CAL_API_KEYS[0]}`);
    return result;
  }

  async getBookingByUid(uid: string) {
    try {
      for (const apiKey of CAL_API_KEYS) {
        const result = await axios.get(`https://api.cal.com/v1/bookings?apiKey=${apiKey}`);
        const { bookings } = result.data;
        for (const booking of bookings) {
          if (booking.uid === uid) {
            return booking;
          }
        }
      }
      return undefined;
    } catch (err) {
      return err;
    }
  }
}

export const calendarService = new CalendarService();
