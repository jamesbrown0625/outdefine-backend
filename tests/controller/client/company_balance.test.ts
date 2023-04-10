
import { companyBalanceService } from '@service'
import { company_balance } from '../../mocks/client'
import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')


describe("Test Company Balance Service Test Cases", () => {  
    let spyGetCompanyBalance
    let spyCreateBalance
    beforeEach(() => {
        (cors as jest.Mock).mockReturnValue('')
        spyGetCompanyBalance = jest.spyOn(companyBalanceService,'getBalance')
        spyGetCompanyBalance.mockReturnValue(company_balance.balance);

        spyCreateBalance = jest.spyOn(companyBalanceService,'createOrUpdate')
        spyCreateBalance.mockReturnValue(company_balance);

      })
    it("Assert getByFreelancerId fields for portfolio service", async () => {
      const companyBalance = await companyBalanceService.getBalance(4);
     
      expect(companyBalanceService.getBalance).toHaveBeenCalledWith(4)
      expect(companyBalance).toEqual(100);
    })

    

     it("Assert update fields for portfolio service", async () => {
      const companyBalance = await companyBalanceService.createOrUpdate(company_balance);

      expect(companyBalanceService.createOrUpdate).toHaveBeenCalledWith(company_balance);
      expect(companyBalance).toEqual(company_balance);
    })
  })