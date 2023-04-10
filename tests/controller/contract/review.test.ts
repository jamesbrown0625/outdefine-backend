import { getAllReviewsForACompany, getAllReviewsForAFreelancer } from '@controller/contract/review'

jest.mock('@middy/http-cors')

describe('Test Review Controller Test Cases', () => {
  test('fetching reviews throws an error if request is invalid', async () => {
    const invalidParam = {}

    let response = await getAllReviewsForACompany({ pathParameters: invalidParam }, null, null)

    let result = JSON.parse(response.body)

    expect(result.status).toBe(500)
    expect(result.message.includes('Company id is missing in the request')).toBeTruthy()

    response = await getAllReviewsForAFreelancer({ pathParameters: invalidParam }, null, null)

    result = JSON.parse(response.body)

    expect(result.status).toBe(500)
    expect(result.message.includes('Freelancer id is missing in the request')).toBeTruthy()
  })
})
