export interface IFreelancerProfileExperience {
  id?: number
  freelancer_id?: number
  company_name?: string
  position?: string
  term?: string
  start_date?: Date
  end_date?: Date
  summary?: string

  // ? will check again and remove fields
  role?: number
  skills?: string
  experience_type?: string
  currently_working?: boolean
}
