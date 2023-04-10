interface IJobsContract {
  id?: number;
  offer_id?: number;
  company_id?: number;
  freelancer_id?: number;
  experience_level?: string;
  position?: string;
  hourly_rate?: number;
  term_of_hours?: number;
  term_of_hours_duration?: string;
  location?: string;
  pay_frequency?: string;
  term?: string;
  timezone?: string;
  contract_start?: Date;
  contract_end?: Date;
  is_ongoing?: boolean;
  duties?: string;
  primary_skills?: Array<number>;
  secondary_skills?: Array<number>;
  contract_status?: string;
  inactivated_date?: Date;
}
