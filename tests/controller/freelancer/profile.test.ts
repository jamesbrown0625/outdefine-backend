import { freelancerProfileService } from '@service'
import { MockTable } from '../../model.mocks'
import { getFreelancerProfile } from '@controller/freelancer/profile'

import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')

describe('Services - Skill table helper', () => {
  let spy

  beforeEach(() => {
    ;(cors as jest.Mock).mockReturnValue('')
    spy = jest.spyOn(freelancerProfileService, 'getTable')
    spy.mockReturnValue(MockTable)
  })

  test(`getFreelancerProfile should throw error when id isn't specified`, async () => {
    const param = {
      noId: '123',
    }
    const response = await getFreelancerProfile({ pathParameters: param }, null, null)
    const result = JSON.parse(response.body)

    expect(result.status).toBe(500)
  })

  test('getFreelancerProfile should update user with valid parameters', async () => {
    const param = {
      id: '123',
    }
    const response = await getFreelancerProfile({ pathParameters: param }, null, null)
    const result = JSON.parse(response.body)

    expect(result.status).toBe(undefined)
  })
})
