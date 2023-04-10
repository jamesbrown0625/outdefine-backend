import { jobApplicationService } from '@service'
import { MockTable } from '../../model.mocks'
import { getAll, applyForAJob, interviewApplication } from '@controller/job/job_application'

import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')

describe('Get jobs', () => {
  let spy
  beforeEach(() => {
    ;(cors as jest.Mock).mockReturnValue('')
    spy = jest.spyOn(jobApplicationService, 'getTable')
    spy.mockReturnValue(MockTable)
  })

  test(`Get jobs throw error when freelancer id isn't specified`, async () => {
    const param = {
      noId: '123',
    }
    const response = await getAll({ queryStringParameters: param }, null, null)
    const result = JSON.parse(response.body)
    expect(result.status).toBe(500)
    expect(result.message.includes('Freelancer id')).toBeTruthy()
  })

  test(`Get all jobs should be successful`, async () => {
    const param = {
      freelancer_id: '123',
    }
    const response = await getAll({ queryStringParameters: param }, null, null)
    const result = JSON.parse(response.body)
    expect(result.jobs.length).toBe(1)
  })

  test(`It throws an error when they try to apply for a job with invalid request`, async () => {
    // case 1
    const body1 = {
      noFreelancerID: 'freelancer id is undefined',
      noCompanyID: 'company id is undefined',
      jobID: 'job id is undefined',
      coverLetter: 'coverletter is undefined',
    }

    let response = await applyForAJob({ body: JSON.stringify(body1) }, null, null)
    let result = JSON.parse(response.body)

    expect(result.status).toBe(500)
    expect(result.message.includes('Freelancer id is needed')).toBeTruthy()

    // case 2
    const body2 = {
      freelancer_id: '23',
      noCompanyID: 'company id is undefined',
      jobID: 'job id is undefined',
      coverLetter: 'coverletter is undefined',
    }

    response = await applyForAJob({ body: JSON.stringify(body2) }, null, null)

    result = JSON.parse(response.body)

    expect(result.status).toBe(500)
    expect(result.message.includes('Company id is needed')).toBeTruthy()

    // case 2
    const body3 = {
      freelancer_id: '23',
      company_id: '21',
      job_id: '22',
      coverLetter: 'coverletter is undefined',
    }

    response = await applyForAJob({ body: JSON.stringify(body3) }, null, null)

    result = JSON.parse(response.body)

    expect(result.status).toBe(500)
    expect(result.message.includes('Cover letter is needed')).toBeTruthy()
  })

  test(`It throws an error when to move to interviewing stage with invalid request`, async () => {
    // case 1
    const body1 = {
      noApplicationID: 'freelancer id is undefined',
      noCompanyID: 'company id is undefined',
      jobID: 'job id is undefined',
    }

    let response = await interviewApplication({ body: JSON.stringify(body1) }, null, null)
    let result = JSON.parse(response.body)

    expect(result.status).toBe(500)
    expect(result.message.includes('Application id is needed')).toBeTruthy()
  })
})
