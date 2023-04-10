import { RECRUITCRM_TOKEN } from "@config";
import axios from "axios";

class RecruitCRMService {
  RECRUITCRM_API = "https://api.recruitcrm.io/v1";

  async getRecruitCRMApi(url, params?: any) {
    const res = await axios.get(`${this.RECRUITCRM_API}/${url}`, {
      params: { ...params },
      headers: {
        Authorization: `Bearer ${RECRUITCRM_TOKEN}`,
      },
    });
    return res.data;
  }

  async postRecruitCRMApi(url, params?: any) {
    const res = await axios.post(`${this.RECRUITCRM_API}/${url}`, params, {
      headers: {
        Authorization: `Bearer ${RECRUITCRM_TOKEN}`,
      },
    });
    return res;
  }

  async postRecruitCRMFormData(url, params?: any) {
    const res = await axios.post(`${this.RECRUITCRM_API}/${url}`, params, {
      headers: {
        Authorization: `Bearer ${RECRUITCRM_TOKEN}`,
        "Content-Type": "multipart/form-data",
      },
      // transformRequest: (formData) => formData,
    });
    return res;
  }
}

export const recruitCRMService = new RecruitCRMService();
