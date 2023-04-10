import cors from '@middy/http-cors'

import { jobInvitationService } from '@service'
import { MockTable } from '../../model.mocks'
import {
  getInvitationsByDynamicId,
  inviteTalent,
  acceptInvitation,
  declineInvitation,
} from '@controller/job/job_invitation'

import { mock_invitation } from '../../mocks/job'

jest.mock('@middy/http-cors')

describe('Job Invitations', () => {
  let spy
  let spyCreate
  const mock_inviatation = 
  beforeEach(() => {
    ;(cors as jest.Mock).mockReturnValue('')
    spy = jest.spyOn(jobInvitationService, 'getTable')
    spy.mockReturnValue(MockTable)
    
    spyCreate = jest.spyOn(jobInvitationService, 'create')
    spyCreate.mockReturnValue(mock_invitation)
    
  })

  test(`getInvitationsByDynamicId throws an error when requestformat is invalid`, async () => {
    const invalidFromParam = {
      from: 'not client or freelancer',
      id: '123',
    }

    let response = await getInvitationsByDynamicId({ pathParameters: invalidFromParam }, null, null)

    let result = JSON.parse(response.body)

    expect(result.status).toBe(500)
    expect(result.message.includes('From type is invalid')).toBeTruthy()

    const noParam = {}

    response = await getInvitationsByDynamicId({ pathParameters: noParam }, null, null)

    result = JSON.parse(response.body)

    expect(result.status).toBe(500)
    expect(result.message.includes('Request format is invalid')).toBeTruthy()
  })

  test(`getInvitationsByDynamicId returns array of invitation data`, async () => {
    const validParam = {
      from: 'company',
      id: '37',
    }

    let response = await getInvitationsByDynamicId({ pathParameters: validParam }, null, null)

    let result = JSON.parse(response.body)

    expect(result.success).toBe(true)
  })

  test(`Invite talents throws an error when request body is invalid`, async () => {
    const body = {
      link: 'here is the link',
      company_id: undefined,
      freelancer_id: undefined,
      introduction: undefined,
      job_id: undefined,
    }

    let response = await inviteTalent({ body: JSON.stringify(body) }, null, null)

    let result = JSON.parse(response.body)

    expect(result.status).toBe(500)
    expect(result.message.includes('Undefined value in request that should not be in'))
  })

  test(`To Invite talents creates an invitation`, async () => {
    const body = {
      link: 'here is the link',
      company_id: 5,
      freelancer_id: 10,
      introduction: 'Here is the introduction',
      job_id: 11,
    }

    let response = await inviteTalent({ body: JSON.stringify(body) }, null, null)

    let result = JSON.parse(response.body)

    expect(result.success).toBe(true)
  })

  test('To accept invitation throws an error if request is invalid', async () => {
    const body = {
      noFreelancerID: 'No freelancer id',
      noCompanyID: 'No company id',
      noJobID: 'No job id',
    }

    let response = await acceptInvitation({ body: JSON.stringify(body) }, null, null)

    let result = await JSON.parse(response.body)

    expect(result.status).toBe(500)
    expect(result.message.includes('Freelancer id is needed')).toBeTruthy()

    const body1 = {
      freelancer_id: '23',
      noCompanyID: 'No company id',
      noJobID: 'No job id',
    }

    response = await acceptInvitation({ body: JSON.stringify(body1) }, null, null)

    result = await JSON.parse(response.body)

    expect(result.status).toBe(500)
    expect(result.message.includes('Company id is needed')).toBeTruthy()
  })

  test('To decline invitation throws an error if request is invalid', async () => {
    const body = {
      noFreelancerID: 'No freelancer id',
      noCompanyID: 'No company id',
      noJobID: 'No job id',
    }

    let response = await declineInvitation({ body: JSON.stringify(body) }, null, null)

    let result = await JSON.parse(response.body)

    expect(result.status).toBe(500)
    expect(result.message.includes('Freelancer id is needed')).toBeTruthy()

    const body1 = {
      freelancer_id: '23',
      noCompanyID: 'No company id',
      noJobID: 'No job id',
    }

    response = await declineInvitation({ body: JSON.stringify(body1) }, null, null)

    result = await JSON.parse(response.body)

    expect(result.status).toBe(500)
    expect(result.message.includes('Company id is needed')).toBeTruthy()
  })
})
