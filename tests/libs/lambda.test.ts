import { middyfyWithoutCors } from '@libs'
import middy from '@middy/core'
import middyJsonBodyParser from '@middy/http-json-body-parser'

jest.mock('@middy/core')

jest.mock('@middy/http-json-body-parser')

jest.useFakeTimers()

describe('lambda middify helper', () => {
  const mockMiddy = { use: jest.fn() }
  const mockBodyParser = 'Test mock body parser'

  test('middify calls axpected middy functions', () => {
    ;(middy as jest.Mock).mockReturnValue(mockMiddy)
    ;(middyJsonBodyParser as jest.Mock).mockReturnValue(mockBodyParser)
    const mockHandler = {}
    middyfyWithoutCors(mockHandler)
    expect(middy).toHaveBeenCalledWith(mockHandler)
    expect(mockMiddy.use).toHaveBeenCalledWith(mockBodyParser)
  })
})
