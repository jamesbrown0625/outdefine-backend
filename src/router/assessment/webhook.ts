import { getHandlerPath, getRoutePath } from "@config";
import { cors } from "@resource";

const hackerearthHandlerPath = getHandlerPath("assessment/hackerearth_webhook");
const hackerearthRoutePath = getRoutePath("assessment/webhook");
const interviewHandlerPath = getHandlerPath("assessment/interview_webhook");
const interviewRoutePath = getRoutePath("assessment/interview_webhook");

const handleWebHook = {
  handler: `${hackerearthHandlerPath}.handleWebHook`,
  events: [
    {
      http: {
        method: "post",
        path: `${hackerearthRoutePath}`,
        cors,
      },
    },
  ],
};

const handleInterviewWebHook = {
  handler: `${interviewHandlerPath}.handleWebHook`,
  events: [
    {
      http: {
        method: "post",
        path: `${interviewRoutePath}`,
        cors,
      },
    },
  ],
};

export {
  handleWebHook,
  handleInterviewWebHook,
};
