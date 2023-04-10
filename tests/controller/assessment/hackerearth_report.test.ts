import { hackerearthReportService } from "@service";
import { hacker_report } from "../../mocks/assesments";
import cors from "@middy/http-cors";

jest.mock("@middy/http-cors");

describe("Test Hackerearth Report Service Test Cases", () => {
  let spyGetOneByEmail;
  let spyCreateOrUpdateReport;
  beforeEach(() => {
    (cors as jest.Mock).mockReturnValue("");
    spyGetOneByEmail = jest.spyOn(hackerearthReportService, "getOneByEmailAndType");
    spyGetOneByEmail.mockReturnValue(hacker_report);

    spyCreateOrUpdateReport = jest.spyOn(hackerearthReportService, "createOrUpdate");
    spyCreateOrUpdateReport.mockReturnValue(hacker_report);
  });
  it("Assert getOneByEmailAndType fields for report service", async () => {
    const hackerReportObj = await hackerearthReportService.getOneByEmailAndType(
      "dev@outdefine.com",
      "MCQ",
    );

    expect(hackerReportObj.name).toEqual("Foo");
    expect(hackerReportObj.questions_attempted).toEqual(4);
  });

  it("Assert createOrUpdate fields for report service", async () => {
    const hackerReport = await hackerearthReportService.createOrUpdate(hacker_report);

    expect(hackerearthReportService.createOrUpdate).toHaveBeenCalledWith(hacker_report);
    expect(hackerReport.email).toEqual("dev@outdefine.com");
  });
});
