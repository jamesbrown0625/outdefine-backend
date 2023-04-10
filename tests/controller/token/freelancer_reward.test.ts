import { describe, test, expect } from 'jest-without-globals'
import { freelancerRewardService } from '@service'
import { MockTable } from '../../model.mocks'
import { getRewardHistoryByUserId, getAggregatedRewards, addFreelancerReward } from '@controller/token/freelancer_reward'
import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')

describe('Controller -> Get and add rewards', () => {
  let spy

  beforeEach(() => {
    ;(cors as jest.Mock).mockReturnValue('')
    spy = jest.spyOn(freelancerRewardService, 'getTable')
    spy.mockReturnValue(MockTable)
  })

  test(`getRewardHistoryByUserId should throw error when user_id is not provided`, async () => {
    const param = {
    queryStringParameters: {
            user_id: undefined,
        }
   }
    const response = await getRewardHistoryByUserId(param, null, null)
    const result = JSON.parse(response.body)    
    expect(result.status).toBe(500)
    expect(result.message.includes('user_id')).toBeTruthy()
  })

  test(`getRewardHistoryByUserId should be successful`, async () => {
    const param = {
    queryStringParameters: {
            user_id: '123',
        }
   }
    const response = await getRewardHistoryByUserId(param, null, null)
    const result = JSON.parse(response.body)    
    expect(result.status).toBe(200)
  })

  test(`getAggregatedRewards should throw error when user_id is not provided`, async () => {
    const param = {
    queryStringParameters: {
            user_id: undefined,
        }
   }
    const response = await getAggregatedRewards(param, null, null)
    const result = JSON.parse(response.body)    
    expect(result.status).toBe(500)
    expect(result.message.includes('user_id')).toBeTruthy()
  })

  test(`getAggregatedRewards should be successful`, async () => {
    const param = {
    queryStringParameters: {
            user_id: '123',
        }
   }
    const response = await getAggregatedRewards(param, null, null)
    const result = JSON.parse(response.body)    
    expect(result.status).toBe(200)
  })
 test(`addFreelancerReward should throw error when user_id is not provided`, async () => {
    const param = {
      user_id: undefined,
      amount : '100',
      status : 'COMPLETED'
    }
    const response = await addFreelancerReward({ body: JSON.stringify(param) }, null, null)
    const result = JSON.parse(response.body)    
    expect(result.status).toBe(500)
    expect(result.message.includes('user_id')).toBeTruthy()
  })

  test(`addFreelancerReward should be successful`, async () => {
    const param = {
      user_id: '2',
      amount : '100',
      status : 'COMPLETED'
    }
    const response = await addFreelancerReward({ body: JSON.stringify(param) }, null, null)
    const result = JSON.parse(response.body)    
   // expect(result.status).toBe(200)
  })

})