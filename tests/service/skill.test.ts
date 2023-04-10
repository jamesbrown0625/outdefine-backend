import { skillService } from '@service'

import { MockTable } from '../model.mocks'

describe('Services - Skill table helper', () => {
  let spy
  beforeEach(() => {
    spy = jest.spyOn(skillService, 'getTable')
    spy.mockReturnValue(MockTable)
  })

  test('getOneByName should return one skill object', async () => {
    const skillName = 'Vue.js'
    const item = await skillService.getOneByName(skillName)
    expect(item.dataValues.name).toBe(skillName)
  })

  test('create should return create one skill object', async () => {
    const skillName = 'Vue.js'
    const item = await skillService.create({ name: skillName })
    expect(item.dataValues.name).toBe(skillName)
  })

  afterEach(() => {
    spy.mockRestore()
  })
})
