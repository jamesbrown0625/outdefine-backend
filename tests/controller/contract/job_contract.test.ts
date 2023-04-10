
import { jobContractService } from '@service'
import { job_contracts } from '../../mocks/contract'
import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')


describe("Test Contract Service Test Cases", () => {  
    let spygetAllContracts
    let spygetCompaniesFromTalentID
    beforeEach(() => {
        (cors as jest.Mock).mockReturnValue('')
        spygetAllContracts = jest.spyOn(jobContractService,'getAll')
        spygetAllContracts.mockReturnValue(job_contracts);

        spygetCompaniesFromTalentID = jest.spyOn(jobContractService,'getCompaniesFromTalentID')
        spygetCompaniesFromTalentID.mockReturnValue(job_contracts);

      })
    it("Assert getAll fields for contract service", async () => {
      const activeContracts = await jobContractService.getAll();
     
      expect(activeContracts["active"][0]["term"]).toEqual("PART TIME");
      expect(activeContracts["active"][0]["pay_frequency"]).toEqual('WEEKLY');
    })

    

     it("Assert getCompaniesFromTalentID fields for contract service", async () => {
      const activeContracts = await jobContractService.getCompaniesFromTalentID(20);

      expect(jobContractService.getCompaniesFromTalentID).toHaveBeenCalledWith(20);
      expect(activeContracts["active"][0]["freelancer_id"]).toEqual(20);
      expect(activeContracts["active"][0]["company_id"]).toEqual(4);
    })
  })