import { freelancerProfileExperienceService } from '@service'
import { MockTable } from '../../model.mocks'
import { updateFreelancerExperience } from '@controller/freelancer/experience'

import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')

describe('Services - Skill table helper', () => {
  let spy
  beforeEach(() => {
    (cors as jest.Mock).mockReturnValue('')
    spy = jest.spyOn(freelancerProfileExperienceService, 'getTable')
    spy.mockReturnValue(MockTable)
  })

  test(`updateFreelancerExperience should throw error when id isn't specified`, async () => {
    const param = {
      noId: '123',
    }
    const response = await updateFreelancerExperience({ body: JSON.stringify(param) }, null, null)
    const result = JSON.parse(response.body)

    expect(result.status).toBe(500)
  })

  test('updateFreelancerExperience should update user with valid parameters', async () => {
    const param = {
      id: '123',
    }
    const response = await updateFreelancerExperience({ body: JSON.stringify(param) }, null, null)
    const result = JSON.parse(response.body)

    expect(result.success).toBe(true)
    expect(result.status).toBe(undefined)
  })
})
