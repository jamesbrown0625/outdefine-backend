import { describe, test, expect } from 'jest-without-globals'
import { userService } from '@service'
import { clientProfileService } from '@service'
import { companyService } from '@service'
import { MockTable } from '../../model.mocks'
import { getClientProfile, updateOnboardingStatus } from '@controller/client/profile'
import { updateOnboardingStatusParam } from '../../mocks'

import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')

describe('Controller -> Company information', () => {
  let spy

  beforeEach(() => {
    ;(cors as jest.Mock).mockReturnValue('')
    jest.spyOn(clientProfileService, 'getTable').mockReturnValue(MockTable)
    jest.spyOn(userService, 'getTable').mockReturnValue(MockTable)
    jest.spyOn(companyService, 'getTable').mockReturnValue(MockTable)
  })
  // getClientProfile tests
  test(`getClientProfile should throw error when id is not provided`, async () => {
    const param = {
      noId: '123',
    }
    const response = await getClientProfile({ pathParameters: param }, null, null)
    const result = JSON.parse(response.body)

    expect(result.status).toBe(500)
  })
  test(`getClientProfile should return result when id is provided`, async () => {
    const param = {
      id: '123',
    }
    const response = await getClientProfile({ pathParameters: param }, null, null)
    expect(response.statusCode).toBe(200)

    const result = JSON.parse(response.body)
    expect(result.success).toBe(true)
  })
  //updateOnboardingStatus test
  test(`updateOnboardingStatus should throw error when Client Id is not provided`, async () => {
    const param = {
      ...updateOnboardingStatusParam,
      client_id: undefined,
    }
    const response = await updateOnboardingStatus({ body: JSON.stringify(param) }, null, null)

    const result = JSON.parse(response.body)
    expect(result.status).toBe(500)
  })

  // test(`updateOnboardingStatus should return result when id is provided`, async () => {
  //   const param = {
  //     ...updateOnboardingStatusParam,
  //   }
  //   const response = await updateOnboardingStatus({ body: JSON.stringify(param) }, null, null)
  //   expect(response.statusCode).toBe(200)

  //   const result = JSON.parse(response.body)
  //   expect(result.success).toBe(true)
  // })
})
