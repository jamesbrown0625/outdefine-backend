import { companySocialLinkService } from '@service'
import { MockTable } from '../../model.mocks'
import { updateCompanySocialLink } from '@controller/client/social_links'

import cors from '@middy/http-cors'
import { clientSocialLink } from '../../mocks'

jest.mock('@middy/http-cors')

describe('Services - Client Social Links Helper', () => {
  let spy
  beforeEach(() => {
    ;(cors as jest.Mock).mockReturnValue('')
    spy = jest.spyOn(companySocialLinkService, 'getTable')
    spy.mockReturnValue(MockTable)
  })

  test(`updateCompanySocialLink should throw error when id isn't specified`, async () => {
    const param = {
      ...clientSocialLink,
      company_id: undefined,
    }
    const response = await updateCompanySocialLink({ body: JSON.stringify(param) }, null, null)
    const result = JSON.parse(response.body)

    expect(result.status).toBe(500)
  })

  test('updateCompanySocialLink should update user with valid parameters', async () => {
    const response = await updateCompanySocialLink(
      { body: JSON.stringify(clientSocialLink) },
      null,
      null,
    )
    const result = JSON.parse(response.body)

    expect(result.success).toBe(true)
    expect(result.status).toBe(undefined)
  })
})
