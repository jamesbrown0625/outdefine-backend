
import { jobPostService } from '@service'
import { job_post , recommendedJobs} from '../../mocks/job'
import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')


describe("Test Job Post Test Cases", () => {  
    let spygetRecommendedJobs
    let spygetOneById
    beforeEach(() => {
        (cors as jest.Mock).mockReturnValue('')
        spygetRecommendedJobs = jest.spyOn(jobPostService, 'getRecommendedJobs')
        spygetRecommendedJobs.mockReturnValue(recommendedJobs)
        spygetOneById = jest.spyOn(jobPostService,'getOneById')
        spygetOneById.mockReturnValue(job_post)
      })
    it("Assert getOneById fields for job post service", async () => {
      const jobPost = await jobPostService.getOneById(16);
      expect(jobPostService.getOneById).toBeCalledWith(16);
      expect(jobPost.status).toEqual('ACTIVE');
    })

    it("Assert getRecommendedJobs fields for job post service", async () => {
        const filters : any = {
            query:'Frontend Engineer',
            skip:null,
            limit:null,
            terms:null,
            location:null,
            is_hourly:null,
            hourly_min_rate:null,
            hourly_max_rate:null,
            annual_min_rate:null,
            annual_max_rate:null,
            job_type:null,
            primary_skills:null,
            timezone:null,
            experience_level:null,
            visa_sponsor:null,
        }

        const mockProfile = {
          freelancer_id: 18,
          level_of_experience: 'Mid-level',
          roles_open_to: ['REMOTE', 'HYBRID'],
          skills: ['Vue', 'CSS'],
          years_of_experience: '1-3',
          hourly_rate: 95,
          role_name: 'Product Designer',
        }

        const job_posts = await jobPostService.getRecommendedJobs(filters, mockProfile);

        expect(jobPostService.getRecommendedJobs).toBeCalledWith(filters, mockProfile);
        expect(job_posts.length).toEqual(3);
      })
  })