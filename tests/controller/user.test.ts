import { userService } from '@service'
import { MockTable } from '../model.mocks'
import { updateUser, getUser } from '@controller/user'

import cors from '@middy/http-cors'
import { user } from '../mocks'

jest.mock('@middy/http-cors')

describe('Services - Skill table helper', () => {
  let spy
  beforeEach(() => {
    ;(cors as jest.Mock).mockReturnValue('')
    spy = jest.spyOn(userService, 'getTable')
    spy.mockReturnValue(MockTable)
  })

  test(`updateUser should throw error when email_id isn't specified`, async () => {
    const param = {
      ...user,
      email_id: undefined,
    }
    const response = await updateUser({ body: JSON.stringify(param) }, null, null)
    const result = JSON.parse(response.body)

    expect(result.status).toBe(500)
  })

  test('updateUser should update user with valid parameters', async () => {
    const response = await updateUser({ body: JSON.stringify(user) }, null, null)
    const result = JSON.parse(response.body)

    expect(result.status).toBe(undefined)
  })

  test(`getUser should throw error when email_id isn't specified`, async () => {
    const response = await getUser({ pathParameters: { email_id: undefined } }, null, null)
    const result = JSON.parse(response.body)

    expect(result.status).toBe(500)
  })

  test(`getUser should return data when email_id is given`, async () => {
    const response = await getUser({ pathParameters: { email_id: user.email_id } }, null, null)
    const result = JSON.parse(response.body)

    expect(result.status).toBe(undefined)
    expect(result.data.email_id).toBe('test@gmail.com')
  })
})
