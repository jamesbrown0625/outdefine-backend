import { freelancerSkillService } from '@service'
import { MockTable, database } from '../../model.mocks'
import { updateFreelancerSkills } from '@controller/freelancer/skill'

import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')

describe('Update Talent skill', () => {
  let spy
  beforeEach(() => {
    ;(cors as jest.Mock).mockReturnValue('')
    spy = jest.spyOn(freelancerSkillService, 'getTable')
    spy.mockReturnValue(MockTable)
  })

  test(`Update talent skill should throw error when freelancer id isn't specified`, async () => {
    const param = {
      noId: '123',
      skills: [1, 2],
    }
    const response = await updateFreelancerSkills({ body: JSON.stringify(param) }, null, null)
    const result = JSON.parse(response.body)
    expect(result.status).toBe(500)
    expect(result.message.includes('Freelancer_id')).toBeTruthy()
  })

  test(`Update talent skill should throw error when skills are not specified`, async () => {
    const param = {
      freelancer_id: '123',
      skills: undefined,
    }
    const response = await updateFreelancerSkills({ body: JSON.stringify(param) }, null, null)
    const result = JSON.parse(response.body)
    expect(result.status).toBe(500)
    expect(result.message.includes('Skill')).toBeTruthy()
  })

  // test(`Update talent skill be successful`, async () => {
  //   const param = {
  //     freelancer_id: '123',
  //     skills: [1, 2],
  //   }
  //   const response = await updateFreelancerSkills({ body: JSON.stringify(param) }, null, null)
  //   const result = JSON.parse(response.body)
  //   expect(result).not.toBe(undefined)
  //   expect(result.success).toBe(true)
  // })
})
