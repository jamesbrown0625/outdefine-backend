export interface IFreelancerProfile {
  freelancer_id?: number;
  recruitcrm_slug?: string;

  industry_id?: number;
  role?: number;

  onboarding_status?: string;

  years_of_experience?: string;
  level_of_experience?: string;
  hourly_rate?: number;

  city?: string;
  country?: string;
  dial_code?: string;
  phone_number?: string;
  english_fluency?: string;

  summary?: string;

  profession?: string;
  resume?: string;
  roles_open_to?: string;
  terms_open_to?: string;
  assessment_visibility?: boolean;
  updatedAt?: string;

  is_trusted_talent?: string;
  trusted_date?: Date;
}
