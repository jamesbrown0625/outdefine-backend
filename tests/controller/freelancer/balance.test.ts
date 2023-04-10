import { freelanceBalanceService} from '@service'
import { MockTable } from '../../model.mocks'
import { getFreelanceBalance , saveFreelanceBalance} from '@controller/freelancer/balance'

import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')

describe('Get and update freelancer balance', () => {
  let spy
  beforeEach(() => {
    (cors as jest.Mock).mockReturnValue('')
    spy = jest.spyOn(freelanceBalanceService, 'getTable')
    spy.mockReturnValue(MockTable)
  })

  test(`Get talent balance should throw error when freelancer id isn't specified`, async () => {
    const param = {
      noId: '123'
    }
    const response = await getFreelanceBalance({ pathParameters: param }, null, null)
    const result = JSON.parse(response.body)
    expect(result.status).toBe(500)
    expect(result.message.includes('freelancer_id')).toBeTruthy()
  })

  test(`Get talent balance should be successful`, async () => {
    const param = {
      id: '123'
    }
    const response = await getFreelanceBalance({ pathParameters: param }, null, null)
    const result = JSON.parse(response.body)
    expect(result.status).toBe(200)
  })

  test(`Save talent balance should throw error when freelancer id isn't specified`, async () => {
    const param = {
      noId: '123',
      balance : 100
    }
    const response = await saveFreelanceBalance({ body : JSON.stringify(param) }, null, null)
    const result = JSON.parse(response.body)
    expect(result.status).toBe(500)
    expect(result.message.includes('freelancer_id')).toBeTruthy()
  })

  test(`Save talent balance should be successful`, async () => {
    const param = {
      freelancer_id: '123',
      balance : 100
    }
    const response = await saveFreelanceBalance({ body: JSON.stringify(param) }, null, null)
    const result = JSON.parse(response.body)
    expect(result.success).toBeTruthy()
  })


})
