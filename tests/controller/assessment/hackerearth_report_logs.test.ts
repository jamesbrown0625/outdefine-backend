
import { hackerearthReportLogService } from '@service'
import { report_log } from '../../mocks/assesments'
import cors from '@middy/http-cors'

jest.mock('@middy/http-cors')


describe("Test Hackerearth Report Log Service Test Cases", () => {  
    let spyCreate
    beforeEach(() => {
        (cors as jest.Mock).mockReturnValue('')
        spyCreate = jest.spyOn(hackerearthReportLogService,'create')
        spyCreate.mockReturnValue(report_log);
      })
    it("Assert create fields for report service", async () => {
      const eventLog = await hackerearthReportLogService.create(report_log);
     
      expect(hackerearthReportLogService.create).toHaveBeenCalledWith(report_log);
      expect(eventLog.questions_attempted).toEqual(11);
      expect(eventLog.percentage).toEqual(46);
    })
  })