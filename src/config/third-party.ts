import { isInDevelopment } from "@config";

const CAL_API_KEYS = [
  "cal_live_eb4f22ace9f65adab746b9d266ea9162",
  "cal_live_090ca23dbfc0145b66f4c03e4b19d0fe",
];
const SENTRY_DSN =
  "https://1ce1ee7cd6034188abf71099550792e1@o4503967076450304.ingest.sentry.io/4504000186613760";

const RECRUITCRM_TOKEN =
  "-uVYQ82PQ0c-pvdlk2K7chRzKwDSvCOHXCLMsnAtjCXzdqxr3Ok1yM6wIKNnHuxOJ33X1OXAq4S-rYz89yLpPV8xNjY1NTMxODc5";

const PREFIX_RECRUITCRM = isInDevelopment() ? "TEST_" : "";

const RECRUITCRM_HIRING_STAGES = {
  Assigned: {
    status_id: 1,
    label: "Assigned",
  },
  InterviewScheduled: {
    status_id: 180084,
    label: "Interview Scheduled",
  },
  Submitted: {
    status_id: 182454,
    label: "Submitted",
  },
  Rejected: {
    status_id: 180087,
    label: "Rejected",
  },
};

export { CAL_API_KEYS, SENTRY_DSN, RECRUITCRM_TOKEN, PREFIX_RECRUITCRM, RECRUITCRM_HIRING_STAGES };
