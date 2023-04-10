
import { jobSaveService } from '@service'
import { saved_jobs } from '../../mocks/job'
import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')


describe("Test Job Save Service Test Cases", () => {  
    let spygetAll
    beforeEach(() => {
        (cors as jest.Mock).mockReturnValue('')
        spygetAll = jest.spyOn(jobSaveService,'getAll')
        spygetAll.mockReturnValue(saved_jobs)
      })
    it("Assert getAll fields for job save service", async () => {
      const jobPosts = await jobSaveService.getAll(109);
     
      expect(jobSaveService.getAll).toBeCalledWith(109);
      expect(jobPosts[0].freelancer_id).toEqual(109);
      expect(jobPosts[0].job_id).toEqual(22);
    })
  })