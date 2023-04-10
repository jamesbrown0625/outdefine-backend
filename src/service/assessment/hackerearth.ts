import { getHackerearthCredential } from "@config";
import axios from "axios";

class HackerEarthService {
  async postHackerEarthApi(url: string, params: any) {
    const apiEndpoint = "https://api.hackerearth.com/partner/hackerearth";

    const payload = {
      ...getHackerearthCredential(),
      ...params,
    };

    const result = await axios
      .post(`${apiEndpoint}/${url}`, payload)
      .then((result) => result)
      .catch((error) => {
        // Throwing the error from hacker earth
        throw new Error(error.response.data.emessage);
      });

    return result;
  }

  async getTestLists() {
    const result = await this.postHackerEarthApi("events-list/", {});
    return result;
  }

  async inviteCandidate(testId: number, email: string) {
    const payload = {
      test_id: testId,
      emails: [email],
      send_email: true,
      auto_expiry_days: 7,
      extra_parameters: {
        redirect_urls: {
          // `${email}`: redirectUrl,
        },
      },
    };

    const result = await this.postHackerEarthApi("invite/", payload);
    return result;
  }

  async deleteTest(testId: number) {
    const result = await this.postHackerEarthApi("events/delete/", {
      test_id: testId,
    });
    return result;
  }

  async publishTest(testId: number) {
    const result = await this.postHackerEarthApi("events/publish/", {
      test_id: testId,
    });
    return result;
  }

  async resetTest(testId: number, email: string) {
    const result = await this.postHackerEarthApi("events/reset/", {
      test_id: testId,
      emails: [email],
      reset_for_all: false,
      send_email: true,
    });
    return result;
  }

  async extendTime(testId: number, email: string, extensionTime: number) {
    const result = await this.postHackerEarthApi("events/extend-time/", {
      test_id: testId,
      emails: [email],
      extend_for_all: false,
      send_email: true,
      extension_time: extensionTime,
    });
    return result;
  }

  async cancelInvite(testId: number, email: string) {
    const result = await this.postHackerEarthApi("cancel-invite/", {
      test_id: testId,
      emails: [email],
    });
    return result;
  }
}

export const hackerEarthService = new HackerEarthService();
