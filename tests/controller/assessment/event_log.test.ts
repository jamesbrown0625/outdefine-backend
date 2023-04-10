
import { assessmentWebhookEventLogService } from '@service'
import { event_log } from '../../mocks/assesments'
import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')


describe("Test Hackerearth Event Webhook Service Test Cases", () => {  
    let spyCreate
    let spyCreateOrUpdate
    beforeEach(() => {
        (cors as jest.Mock).mockReturnValue('')
        spyCreate = jest.spyOn(assessmentWebhookEventLogService,'create')
        spyCreate.mockReturnValue(event_log);

        spyCreateOrUpdate = jest.spyOn(assessmentWebhookEventLogService,'createOrUpdate')
        spyCreateOrUpdate.mockReturnValue(event_log);

      })
    it("Assert create fields for report service", async () => {
      const eventLog = await assessmentWebhookEventLogService.create(event_log);
     
      expect(assessmentWebhookEventLogService.create).toHaveBeenCalledWith(event_log);
      expect(eventLog.webhook_event_id).toEqual("2b6c1ed23df84cfebb421357ae7a6216");
    })

    

     it("Assert createOrUpdate fields for report service", async () => {
      const eventLog = await assessmentWebhookEventLogService.createOrUpdate(event_log);

      expect(assessmentWebhookEventLogService.createOrUpdate).toHaveBeenCalledWith(event_log);
      expect(eventLog.webhook_event_type).toEqual("CANDIDATE_TEST_STARTED");
    })
  })