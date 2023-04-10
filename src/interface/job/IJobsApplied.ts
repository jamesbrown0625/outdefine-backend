export interface IJobsApplied {
  id?: number
  freelancer_id?: number
  company_id?: number
  job_id?: number
  applied_date?: Date
  cover_letter?: string
  application_status?: string
  rate_quoted?: number
  boosted?: boolean
  token_amount?: number
  start_date?: Date
  is_invited?: boolean
}
