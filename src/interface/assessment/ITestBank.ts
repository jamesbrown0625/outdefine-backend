export interface IAssessmentTestBank {
  test_id?: number;
  start_datetime?: string;
  creation_datetime?: string;
  end_datetime?: string;
  title?: string;
  slug?: string;
  duration?: number;
  cutoff_score?: number;
  problem_types_data?: string;
  practice_test_slug?: string;
  job_type?: number;
  role?: number;
  mcq_or_coding?: string;
}
