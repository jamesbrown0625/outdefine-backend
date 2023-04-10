export interface IUser {
  user_id?: number
  cognito_id?: string
  first_name?: string
  last_name?: string
  email_id?: string
  contact_number?: string
  user_type?: string
  referral_link?: string
  referred_id?: number
  is_deleted?: boolean
  dial_code?: string
  phone_number?: string

  avatar?: string
  avatar_number?: number
  avatar_type?: boolean

  banner?: string
  banner_number?: number
  banner_type?: boolean

  background_number?: number

  pronoun?: number
}
