import { companyServiceAgreementService } from '@service'
import { MockTable } from '../../model.mocks'
import { updateCompanyServiceAgreement } from '@controller/client/company_service_agreement'

import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')

describe('Services - Skill table helper', () => {
  let spy
  beforeEach(() => {
    ;(cors as jest.Mock).mockReturnValue('')
    spy = jest.spyOn(companyServiceAgreementService, 'getTable')
    spy.mockReturnValue(MockTable)
  })

  test(`updateCompanyServiceAgreement should throw error when id isn't specified`, async () => {
    const param = {
      noCompanyId: '123',
    }
    const response = await updateCompanyServiceAgreement(
      { body: JSON.stringify(param) },
      null,
      null,
    )
    const result = JSON.parse(response.body)

    expect(result.status).toBe(500)
  })

  // test('updateCompanyServiceAgreement should update user with valid parameters', async () => {
  //   const param = {
  //     company_id: '123',
  //     signed_by: '15',
  //     msa_id: '1',
  //   }
  //   const response = await updateCompanyServiceAgreement(
  //     { body: JSON.stringify(param) },
  //     null,
  //     null,
  //   )
  //   const result = JSON.parse(response.body)

  //   expect(result.success).toBe(true)
  //   expect(result.status).toBe(undefined)
  // })
})
