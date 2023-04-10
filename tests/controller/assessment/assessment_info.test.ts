import { describe, test, expect } from "jest-without-globals";
import { candidateAssessmentInfoService, userService } from "@service";
import { MockTable } from "../../model.mocks";
import {
  getCandidateAssessmentInfo,
  updateCandidateManuallyPassed,
  confirmCandidateRole,
} from "@controller/assessment/assessment_info";

import cors from "@middy/http-cors";
import { assessment, assessmentInfo, user } from "../../mocks";

jest.mock("@middy/http-cors");

describe("Controller -> Candidate Assessment Info", () => {
  let spy;

  beforeEach(() => {
    (cors as jest.Mock).mockReturnValue("");
    spy = jest.spyOn(candidateAssessmentInfoService, "getTable");
    spy.mockReturnValue(MockTable);
  });

  test(`getCandidateAssessmentInfo should throw error when email_id is not provided`, async () => {
    const param = {
      queryStringParameters: {
        ...assessment,
        email_id: undefined,
      },
    };
    const response = await getCandidateAssessmentInfo(param, null, null);
    const result = JSON.parse(response.body);

    expect(result.status).toBe(500);
    expect(result.message.includes("email_id")).toBeTruthy();
  });

  test(`getCandidateAssessmentInfo should return result when email_id is provided`, async () => {
    const param = {
      queryStringParameters: assessment,
    };
    const response = await getCandidateAssessmentInfo(param, null, null);
    expect(response.statusCode).toBe(200);

    const assessmentInfo = JSON.parse(response.body).data[0];

    expect(assessmentInfo.email).toBe("bob@gmail.com");
  });

  test(`updateCandidateManuallyPassed should throw error when email_id is not provided`, async () => {
    const param = {
      manually_passed: true,
      email_id: undefined,
    };
    const response = await updateCandidateManuallyPassed(
      { body: JSON.stringify(param) },
      null,
      null,
    );

    const result = JSON.parse(response.body);
    expect(result.status).toBe(500);
    expect(result.message.includes("email_id")).toBeTruthy();
  });

  test(`updateCandidateManuallyPassed should throw error when manually_passed is not provided`, async () => {
    const param = {
      manually_passed: undefined,
      email_id: assessment.email_id,
    };
    const response = await updateCandidateManuallyPassed(
      { body: JSON.stringify(param) },
      null,
      null,
    );

    const result = JSON.parse(response.body);
    expect(result.status).toBe(500);
    expect(result.message.includes("manually_passed")).toBeTruthy();
  });

  test(`confirmCandidateRole should throw error when freelancer_id is not provided`, async () => {
    const param = {
      freelancer_id: undefined,
      id: 5,
      type: "HACKEREARTH",
    };
    const response = await confirmCandidateRole({ body: JSON.stringify(param) }, null, null);

    const result = JSON.parse(response.body);
    expect(result.status).toBe(500);
    expect(result.message.includes("freelancer_id")).toBeTruthy();
  });

  test(`confirmCandidateRole should throw error when id is not provided`, async () => {
    const param = {
      id: undefined,
      freelancer_id: 5,
      type: "HACKEREARTH",
    };
    const response = await confirmCandidateRole({ body: JSON.stringify(param) }, null, null);

    const result = JSON.parse(response.body);
    expect(result.status).toBe(500);
    expect(result.message.includes("id")).toBeTruthy();
  });

  test(`confirmCandidateRole should throw error when type is not provided`, async () => {
    const param = {
      id: 9,
      freelancer_id: 5,
      type: undefined,
    };
    const response = await confirmCandidateRole({ body: JSON.stringify(param) }, null, null);

    const result = JSON.parse(response.body);
    expect(result.status).toBe(500);
    expect(result.message.includes("type")).toBeTruthy();
  });

  test(`confirmCandidateRole should throw error if user already confirmed for the role`, async () => {
    const spyUser = jest.spyOn(userService, "getOneByUserId");
    spyUser.mockReturnValue(Promise.resolve(user));

    const spyAssessmentInfo = jest.spyOn(
      candidateAssessmentInfoService,
      "getOrCreateNonEngineeringRow",
    );
    spyAssessmentInfo.mockReturnValue(Promise.resolve(assessmentInfo));

    const param = {
      id: 9,
      freelancer_id: 5,
      type: "HACKEREARTH",
    };

    const response = await confirmCandidateRole({ body: JSON.stringify(param) }, null, null);

    const result = JSON.parse(response.body);
    expect(result.status).toBe(500);
    expect(result.message.includes("confirmed")).toBeTruthy();
  });
});
