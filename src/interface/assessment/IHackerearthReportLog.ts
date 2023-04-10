export interface IHackerearthReportLog {
  id?: number
  assessment_id?: number
  start_datetime?: string
  finish_datetime?: string
  time_taken?: string
  score?: number
  percentage?: number
  status?: string
  questions_attempted?: number
  problem_type_scores?: string
  section_scores?: string
  full_report_url?: string
  candidate_assessment_report_url?: string
  anon_report_url?: string
}
