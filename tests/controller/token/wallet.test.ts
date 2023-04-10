import { describe, test, expect } from 'jest-without-globals'
import { walletService } from '@service'
import { MockTable } from '../../model.mocks'
import { getBalanceByUserId, withdrawBalanceByUserId } from '@controller/token/wallet'
import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')

describe('Controller -> Get and withdraw balance', () => {
  let spy

  beforeEach(() => {
    ;(cors as jest.Mock).mockReturnValue('')
    spy = jest.spyOn(walletService, 'getTable')
    spy.mockReturnValue(MockTable)
  })

  test(`getBalanceByUserId should throw error when user_id is not provided`, async () => {
    const param = {
    queryStringParameters: {
            user_id: undefined,
        }
   }
    const response = await getBalanceByUserId(param, null, null)
    const result = JSON.parse(response.body)    
    expect(result.status).toBe(500)
    expect(result.message.includes('user_id')).toBeTruthy()
  })

  test(`getBalanceByUserId should return balance `, async () => {
    const param = {
    queryStringParameters: {
            user_id: '123',
        }
   }
    const response = await getBalanceByUserId(param, null, null)
    const result = JSON.parse(response.body)    
    expect(result.status).toBe(200)
  })

  test(`withdraw balance should throw error when user_id is not provided `, async () => {
    const param = {
      user_id : undefined,
      amount : '100'
    }
    
    const response = await withdrawBalanceByUserId({ body: JSON.stringify(param) }, null, null)
    const result = JSON.parse(response.body)
    expect(result.status).toBe(500)
    expect(result.message.includes('user_id')).toBeTruthy()
  })

   test(`withdraw balance should be successful`, async () => {
    const param = {
      user_id : '123',
      amount : '100'
    }
    
    const response = await withdrawBalanceByUserId({ body: JSON.stringify(param) }, null, null)
    expect(response.statusCode).toBe(200)
  })

})