import axios from "axios";
import { describe, test, expect } from "jest-without-globals";
import { startMcqAssessment } from "@controller/assessment/hackerearth";
import { candidateAssessmentInfoService, hackerearthReportService } from "@service";
import { MockTable } from "../../model.mocks";
import { assessment, assessmentInfo } from "../../mocks";
import cors from "@middy/http-cors";

jest.mock("@middy/http-cors");
jest.mock("axios");

describe("Controller -> Hackerearth start assessment", () => {
  let mAxiosPost;
  beforeEach(() => {
    (cors as jest.Mock).mockReturnValue("");
    const spyGetTable = jest.spyOn(candidateAssessmentInfoService, "getTable");
    spyGetTable.mockReturnValue(MockTable);
    mAxiosPost = axios.post as jest.MockedFunction<typeof axios.post>;
  });

  test(`startMcqAssessment should throw error when email_id is not provided`, async () => {
    const param = {
      ...assessment,
      email_id: undefined,
    };
    const response = await startMcqAssessment({ body: JSON.stringify(param) }, null, null);
    const result = JSON.parse(response.body);

    expect(result.status).toBe(500);
    expect(result.message.includes("email_id")).toBeTruthy();
  });

  test(`startMcqAssessment should throw error if user didn't confirmed for the role yet`, async () => {
    const spyAssessmentInfo = jest.spyOn(candidateAssessmentInfoService, "createOrGetOneByEmail");
    spyAssessmentInfo.mockReturnValue(Promise.resolve({ ...assessmentInfo, confirmed: false }));

    const param = {
      ...assessment,
    };
    const response = await startMcqAssessment({ body: JSON.stringify(param) }, null, null);
    const result = JSON.parse(response.body);

    expect(result.status).toBe(500);
    expect(result.message.includes("confirmed")).toBeTruthy();
  });

  test(`startMcqAssessment should throw error if user didn't confirmed for the role yet`, async () => {
    const spyAssessmentInfo = jest.spyOn(candidateAssessmentInfoService, "createOrGetOneByEmail");
    spyAssessmentInfo.mockReturnValue(Promise.resolve({ ...assessmentInfo, mcq_passed: true }));

    const param = {
      ...assessment,
    };
    const response = await startMcqAssessment({ body: JSON.stringify(param) }, null, null);
    const result = JSON.parse(response.body);

    expect(result.status).toBe(500);
    expect(result.message.includes("passed")).toBeTruthy();
  });

  test(`startMcqAssessment should throw error if user didn't confirmed for the role yet`, async () => {
    const spyAssessmentInfo = jest.spyOn(candidateAssessmentInfoService, "createOrGetOneByEmail");
    spyAssessmentInfo.mockReturnValue(
      Promise.resolve({ ...assessmentInfo, confirmed_id: undefined }),
    );

    const param = {
      ...assessment,
    };
    const response = await startMcqAssessment({ body: JSON.stringify(param) }, null, null);
    const result = JSON.parse(response.body);

    expect(result.status).toBe(500);
    expect(result.message.includes("test id")).toBeTruthy();
  });

  test(`startMcqAssessment should throw error when the candidate took assessment more than 3 times and report is empty`, async () => {
    const spyGetTable = jest.spyOn(candidateAssessmentInfoService, "createOrGetOneByEmail");
    spyGetTable.mockReturnValue(Promise.resolve({ ...assessmentInfo, mcq_taken_count: 3 }));

    const report = null;
    const spyGetOneEmail = jest.spyOn(hackerearthReportService, "getOneByEmailAndType");
    spyGetOneEmail.mockReturnValue(Promise.resolve(report));

    const response = await startMcqAssessment({ body: JSON.stringify(assessment) }, null, null);
    const result = JSON.parse(response.body);

    expect(result.status).toBe(500);
  });

  test(`startMcqAssessment should throw error when the candidate took assessment more than 3 times and it's less than 3 months since last time`, async () => {
    const spyGetTable = jest.spyOn(candidateAssessmentInfoService, "createOrGetOneByEmail");
    spyGetTable.mockReturnValue(Promise.resolve({ ...assessmentInfo, mcq_taken_count: 3 }));

    const threeMonthsago = new Date();
    threeMonthsago.setMonth(threeMonthsago.getMonth() - 2);
    const report = { finish_datetime: threeMonthsago.toISOString() };
    const spyGetOneEmail = jest.spyOn(hackerearthReportService, "getOneByEmailAndType");
    spyGetOneEmail.mockReturnValue(Promise.resolve(report));

    const response = await startMcqAssessment({ body: JSON.stringify(assessment) }, null, null);
    const result = JSON.parse(response.body);

    expect(result.status).toBe(500);
    console.log(result.message);
    expect(result.message.includes("3 times")).toBeTruthy();
  });

  test(`startMcqAssessment should throw error if Hacker Earth Invite Candidate Api Call Failed`, async () => {
    const spyGetTable = jest.spyOn(candidateAssessmentInfoService, "createOrGetOneByEmail");
    spyGetTable.mockReturnValue(Promise.resolve({ ...assessmentInfo, mcq_taken_count: 0 }));

    const axiosResponse = {
      data: { mcode: "failed" },
    };

    mAxiosPost.mockResolvedValue(axiosResponse);

    const response = await startMcqAssessment({ body: JSON.stringify(assessment) }, null, null);
    const result = JSON.parse(response.body);

    expect(result.status).toBe(500);
    expect(result.message.includes("Hacker Earth")).toBeTruthy();
  });

  test(`startMcqAssessment should work normally in other cases`, async () => {
    const spyGetTable = jest.spyOn(candidateAssessmentInfoService, "createOrGetOneByEmail");
    spyGetTable.mockReturnValue(Promise.resolve({ ...assessmentInfo, mcq_taken_count: 0 }));

    const axiosResponse = {
      data: { mcode: "success" },
    };

    mAxiosPost.mockResolvedValue(axiosResponse);

    const response = await startMcqAssessment({ body: JSON.stringify(assessment) }, null, null);
    expect(response.statusCode).toBe(200);
  });
});
