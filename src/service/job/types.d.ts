/*
 ***       TODO
 *** missing fields like rate_quoted, start_date
 */
interface ApplyPropsType {
  freelancer_id: number
  job_id: number
  cover_letter: string
  is_invited: boolean
  boosted: boolean
}

interface IDirectInvite {
  freelancer_id: number
  company_id: number
  job_id: number
  calendar_link: string
  invite_description: string
}
