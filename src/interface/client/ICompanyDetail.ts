export interface ICompanyDetail {
  company_id?: number
  recruitcrm_slug?: string
  name?: string
  summary?: string
  website?: string
  industry?: string
  number_of_employees?: string
  stage?: string
  number_of_open_roles?: string
  city?: string
  country?: string
  dial_code?: string
  phone_number?: string
  remote_first?: boolean

  logo?: string
  logo_number?: number
  logo_type?: boolean

  banner?: string
  banner_number?: number
  banner_type?: boolean

  updatedAt?: string
}
