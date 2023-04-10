import { freelancerProfileSocialLinkService } from '@service'
import { MockTable } from '../../model.mocks'
import { updateFreelancerProfileSocialLink } from '@controller/freelancer/social_links'

import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')

describe('Services - Skill table helper', () => {
  let spy
  beforeEach(() => {
    (cors as jest.Mock).mockReturnValue('')
    spy = jest.spyOn(freelancerProfileSocialLinkService, 'getTable')
    spy.mockReturnValue(MockTable)
  })

  test(`updateFreelancerProfileSocialLink should throw error when id isn't specified`, async () => {
    const param = {
      noFreelancerId: '123',
    }
    const response = await updateFreelancerProfileSocialLink({ body: JSON.stringify(param) }, null, null)
    const result = JSON.parse(response.body)

    expect(result.status).toBe(500)
  })

  test('updateFreelancerProfileSocialLink should update user with valid parameters', async () => {
    const param = {
      freelancer_id: '123',
    }
    const response = await updateFreelancerProfileSocialLink({ body: JSON.stringify(param) }, null, null)
    const result = JSON.parse(response.body)

    expect(result.success).toBe(true)
    expect(result.status).toBe(undefined)
  })
})
