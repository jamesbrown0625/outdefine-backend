import { formatJSONResponse } from '@libs'
import {} from '@jest/globals'

jest.useFakeTimers()

describe('api Gateway tests', () => {
  test('formatJSONResponse returns expected response', () => {
    const sampleResponse = {
      body: '{"message":"test response message"}',
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': false,
        'Access-Control-Allow-Origin': '*',
      },
    }

    expect(formatJSONResponse({ message: 'test response message' })).toEqual(sampleResponse)
  })
})
