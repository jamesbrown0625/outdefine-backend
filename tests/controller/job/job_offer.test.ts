
import { jobOfferService } from '@service'
import { job_offers } from '../../mocks/job'
import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')


describe("Test Job Offer Service Test Cases", () => {  
    let spygetOffersById
    beforeEach(() => {
        (cors as jest.Mock).mockReturnValue('')
        spygetOffersById = jest.spyOn(jobOfferService,'getOffersById')
        spygetOffersById.mockReturnValue(job_offers);
      })
    it("Assert getOffersById fields for job offer service", async () => {
      const jobOffers = await jobOfferService.getOffersById('freelancer',20);
     
      expect(jobOfferService.getOffersById).toBeCalledWith('freelancer',20);
      expect(jobOffers[0].position).toEqual("AWS (Amazon Web services) Developer");
      expect(jobOffers[0].experience_level).toEqual('Director-level');
    })
  })