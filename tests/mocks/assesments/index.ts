const assessmentInfo = {
  email_id: "bob@gmail.com",
  confirmed: true,
  mcq_passed: false,
  confirmed_id: 19,
};

const hacker_report = {
  id: 1,
  assessment_id: 4,
  test_id: 2011145,
  email: "dev@outdefine.com",
  name: "Foo",
  start_datetime: "2022-12-07T02:57:54+00:00",
  finish_datetime: "2022-12-07T02:57:54+00:00",
  time_taken: "0:00:14",
  score: 0,
  percentage: 0,
  status: "active",
  questions_attempted: 4,
  problem_type_scores: '{"Multiple Choice Questions":0,"Programming":0,"Front end":0}',
  section_scores:
    '{"Programming":{"Basic Programming":0},"Front end":{"Frontend Programming":0},"Multiple Choice Questions":{"Multiple Choice Questions":0}}"Programming"":0}',
  full_report_url:
    "https://www.hackerearth.com/en-us/recruiter/outdefine-frontend-engineer-test/candidates-report/b5db5443ff1441adbbb385533b7c3152/8bc78542a7f004efbaf6d9de0458d37a/",
  candidate_assessment_report_url:
    "https://www.hackerearth.com/en-us/recruiter/outdefine-frontend-engineer-test/candidate-performance-report/b5db5443ff1441adbbb385533b7c3152/8bc78542a7f004efbaf6d9de0458d37a/",
  anon_report_url:
    "https://www.hackerearth.com/en-us/recruiter/outdefine-frontend-engineer-test/candidates-report/b5db5443ff1441adbbb385533b7c3152/dc0ea1114ae33f58c3c6d30b2ea22a9d/",
  phone_number: null,
  institute: null,
  graduation_year: "2014",
  candidate_id: "candidate_123",
  custom_details: "{}",
};

const event_log = {
  id: 98,
  webhook_event_id: "2b6c1ed23df84cfebb421357ae7a6216",
  webhook_event_type: "CANDIDATE_TEST_STARTED",
  webhook_attempt_number: 1,
  webhook_payload:
    '{"test_id":2011662,"email":"dev@outdefine.com","start_datetime":"2022-12-09T11:25:29+00:00"}',
};

const report_log = {
  id: 4,
  assessment_id: 2,
  start_datetime: "2022-12-09T11:25:29+00:00",
  finish_datetime: "2022-12-09T11:25:29+00:00",
  time_taken: "1:19:49",
  score: 53,
  percentage: 46,
  status: "online",
  questions_attempted: 11,
  problem_type_scores: '{"Multiple Choice Questions":4,"Programming":0,"Front end":0}',
  section_scores:
    '{"Multiple Choice Questions":{"Multiple Choice Questions":4},"Programming":{"Basic Programming":0},"Front end":{"Full Stack Programming":0}}',
  full_report_url:
    "https://www.hackerearth.com/en-us/recruiter/outdefine-fullstack-engineer-assessment/candidates-report/f3410b669f584c32a6262b094d5327dc/292a1f1de5e3d8ec63466fdc2b947880/",
  candidate_assessment_report_url:
    "https://www.hackerearth.com/en-us/recruiter/outdefine-fullstack-engineer-assessment/candidate-performance-report/f3410b669f584c32a6262b094d5327dc/292a1f1de5e3d8ec63466fdc2b947880/",
  anon_report_url:
    "https://www.hackerearth.com/en-us/recruiter/outdefine-fullstack-engineer-assessment/candidates-report/f3410b669f584c32a6262b094d5327dc/b26b6c5ba2afa5da750343636ba123c4/",
};

export { hacker_report, event_log, report_log, assessmentInfo };
