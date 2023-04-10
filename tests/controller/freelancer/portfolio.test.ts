
import { freelancerProfilePortfolioService } from '@service'
import { portfolio } from '../../mocks/portfolio'
import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')


describe("Test Freelancer Portfolio Service Test Cases", () => {  
    let spyGetPortfolio
    let spyupdatePortfolio
    beforeEach(() => {
        (cors as jest.Mock).mockReturnValue('')
        spyGetPortfolio = jest.spyOn(freelancerProfilePortfolioService,'getByFreelancerId')
        spyGetPortfolio.mockReturnValue(portfolio);

        spyupdatePortfolio = jest.spyOn(freelancerProfilePortfolioService,'update')
        spyupdatePortfolio.mockReturnValue(true);

      })
    it("Assert getByFreelancerId fields for portfolio service", async () => {
      const portfolioObj = await freelancerProfilePortfolioService.getByFreelancerId(18);
     
      expect(portfolioObj.freelancer_id).toEqual(18);
      expect(portfolioObj.role).toEqual('Full Stack Engineer');
    })

    

     it("Assert update fields for portfolio service", async () => {
      const portfolioResponse = await freelancerProfilePortfolioService.update(portfolio);

      expect(freelancerProfilePortfolioService.update).toHaveBeenCalledWith(portfolio);
      expect(portfolioResponse).toEqual(true);
    })
  })