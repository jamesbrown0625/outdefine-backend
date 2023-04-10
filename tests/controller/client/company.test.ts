import { describe, test, expect } from 'jest-without-globals'
import { companyService } from '@service'
import { MockTable } from '../../model.mocks'
import { getCompanyInfo, updateCompanyLogo } from '@controller/client/company'
import { updateCompanyLogoParam } from '../../mocks'


import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')

describe('Controller -> Company information', () => {
  let spy

  beforeEach(() => {
    ;(cors as jest.Mock).mockReturnValue('')
    spy = jest.spyOn(companyService, 'getTable')
    spy.mockReturnValue(MockTable)
  })

/**
   * updateCompanyLogo tests
 */
  test(`updateCompanyLogo should throw error when company_id and link are not provided`, async () => {
    const param = {
      queryStringParameters: {},
    }
    const response = await updateCompanyLogo(
      { body: JSON.stringify(param) },
      null,
      null,
    )
    const result = JSON.parse(response.body)

    expect(result.status).toBe(500)
  })

  test(`updateCompanyLogo should throw error when logo link is not provided`, async () => {
    const param = {
      ...updateCompanyLogoParam,
      logo: undefined,
    }
    const response = await updateCompanyLogo(
      { body: JSON.stringify(param) },
      null,
      null,
    )
    const result = JSON.parse(response.body)

    expect(result.status).toBe(500)
  })

  test(`updateCompanyLogo should update user with valid parameters`, async () => {
    const param = {
      ...updateCompanyLogoParam
    }
    const response = await updateCompanyLogo(
      { body: JSON.stringify(param) },
      null,
      null,
    )
    const result = JSON.parse(response.body)
    expect(result.success).toBe(undefined)
  })

// getComanyInfo tests
  test(`getCompanyInfo should throw error when id is not provided`, async () => {
    const param = {
        noId: "12",
    }
    const response = await getCompanyInfo({pathParameters: param}, null, null)
    const result = JSON.parse(response.body)

    expect(result.status).toBe(500)
    expect(result.message.includes('id')).toBeTruthy()
  })
  test(`getCompanyInfo should return result when id is provided`, async () => {
    const param = {
        id: "12",
    }
    const response = await getCompanyInfo({pathParameters: param}, null, null)
    expect(response.statusCode).toBe(200)

    const result = JSON.parse(response.body)
    expect(result.success).toBe(true)
})
})
