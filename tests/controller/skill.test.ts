import { skillService } from "@service";
import { skill } from "../mocks/skills";
import cors from "@middy/http-cors";

jest.mock("@middy/http-cors");

describe("Test Skill Service Test Cases", () => {
  let spyGetOneByName;
  let spyCreate;
  beforeEach(() => {
    (cors as jest.Mock).mockReturnValue("");
    spyGetOneByName = jest.spyOn(skillService, "getOneByName");
    spyGetOneByName.mockReturnValue(skill);

    spyCreate = jest.spyOn(skillService, "create");
    spyCreate.mockReturnValue(skill);
  });
  it("Assert getOneByEmail fields for report service", async () => {
    const skillObj = await skillService.getOneByName("dev@outdefine.com");

    expect(skillObj.name).toEqual("Fullstack Engineer");
    expect(skillObj.role_id).toEqual("114");
  });

  it("Assert createOrUpdate fields for report service", async () => {
    const skillObj = await skillService.create(skill);

    expect(skillService.create).toHaveBeenCalledWith(skill);
  });
});
