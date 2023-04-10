import { describe, test, expect } from 'jest-without-globals'
import { talentReferralService } from '@service'
import { MockTable } from '../../model.mocks'
import { sendInviteEmail } from '@controller/token/talent_referral'

import cors from '@middy/http-cors'
import { inviteEmail } from '../../mocks'

jest.mock('@middy/http-cors')

describe('Controller -> Send Invite', () => {
  let spy

  beforeEach(() => {
    ;(cors as jest.Mock).mockReturnValue('')
    spy = jest.spyOn(talentReferralService, 'getTable')
    spy.mockReturnValue(MockTable)
  })

  test(`sendInviteEmail should throw error when user_id is not provided`, async () => {
    const param = {
      ...inviteEmail,
      user_id: undefined,
    }
    const response = await sendInviteEmail({ body: JSON.stringify(param) }, null, null)
    const result = JSON.parse(response.body)    
    expect(result.status).toBe(500)
    expect(result.message.includes('user_id')).toBeTruthy()
  })

  test(`sendInviteEmail should throw error when emailList is not provided`, async () => {
    const param = {
      ...inviteEmail,
      emailList : undefined,
    }
    const response = await sendInviteEmail({ body: JSON.stringify(param) }, null, null)
    const result = JSON.parse(response.body)
    expect(result.status).toBe(500)
    expect(result.message.includes('emailList')).toBeTruthy()
  })

  /*test(`sendInviteEmail should should be successful`, async () => {
    const param = {
      ...inviteEmail
    }
    
    const response = await sendInviteEmail({ body: JSON.stringify(param) }, null, null)
    const result = JSON.parse(response.body)
    expect(result.success).toBeTruthy()
  })*/

})