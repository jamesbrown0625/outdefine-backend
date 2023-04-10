
import { roleService } from '@service';
import { role } from '../mocks/role'
import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')


describe("Test Role Service Test Cases", () => {  
    let spyGetOneById
    let spyCreate
    beforeEach(() => {
        (cors as jest.Mock).mockReturnValue('')
        spyGetOneById = jest.spyOn(roleService,'getOneById')
        spyGetOneById.mockReturnValue(role);

        spyCreate = jest.spyOn(roleService,'create')
        spyCreate.mockReturnValue(role);

      })
    it("Assert getOneById fields for role service", async () => {
      const roleObj = await roleService.getOneById(1);
     
      expect(roleObj.name).toEqual("Brand Designer");
      expect(roleObj.role_id).toEqual(14);
    })

     it("Assert create fields for role service", async () => {
      const roleObj = await roleService.create(role);

      expect(roleService.create).toHaveBeenCalledWith(role);
    })
  })