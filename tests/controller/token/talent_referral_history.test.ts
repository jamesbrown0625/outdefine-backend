import { describe, test, expect } from 'jest-without-globals'
import { talentReferralHistoryService } from '@service'
import { MockTable } from '../../model.mocks'
import { getReferralHistoryByReferrer } from '@controller/token/talent_referral_history'
import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')

describe('Controller -> Get Referral', () => {
  let spy

  beforeEach(() => {
    ;(cors as jest.Mock).mockReturnValue('')
    spy = jest.spyOn(talentReferralHistoryService, 'getTable')
    spy.mockReturnValue(MockTable)
  })

  test(`getReferralHistoryByReferrer should throw error when user_id is not provided`, async () => {
    const param = {
    queryStringParameters: {
            user_id: undefined,
        }
   }
    const response = await getReferralHistoryByReferrer(param, null, null)
    const result = JSON.parse(response.body)    
    expect(result.status).toBe(500)
    expect(result.message.includes('user_id')).toBeTruthy()
  })

  /*test(`getReferralHistoryByReferrer should return no referrals `, async () => {
    const param = {
    queryStringParameters: {
            user_id: '123',
        }
   }
    const response = await getReferralHistoryByReferrer(param, null, null)
    const result = JSON.parse(response.body)    
    expect(result.status).toBe(500)
   expect(result.message.includes('No referrals')).toBeTruthy()

  })*/

})