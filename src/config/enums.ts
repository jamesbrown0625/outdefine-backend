import { DataTypes } from "sequelize";

const USER_TYPES_PERMISSION = {
  FREELANCER: "FREELANCER",
  ADMIN: "ADMIN",
  CLIENT: "CLIENT",
  RECRUITER: "RECRUITER",
};
const USER_TYPES = ["FREELANCER", "ADMIN", "CLIENT", "RECRUITER"];
const REFERRAL_LINKS = ["Discord", "Telegram", "Linkedin", "Website"];
const ENUM_ERROR_MSG = "Enum Validation Error: table field should belong to a valid array";
const ENUM_DEGREES = [
  "High School / GED",
  "Associate Degree",
  `Bachelor's Degree`,
  `Master's Degree`,
  "Doctoral Degree",
  "Bootcamp",
  "Other",
];
const ENUM_EDUCATIN_TYPE = ["Bootcamp", "College/University", "Self-taught"];
const ENUM_EXPERIENCE_TYPE = ["Part time", "Full time", "Contract"];
const ENUM_YEARS_OF_EXPERIENCE = ["1-3", "3-5", "5-8", "8+"];
const ENUM_LEVEL_OF_EXPERIENCE = ["Entry-level", "Mid-level", "Senior-level", "Director-level"];
const ENUM_PROFESSION = ["ENGINEERING", "DESIGN", "PRODUCT", "OTHER"];
const ENUM_ONBOARDING_STATUS = ["TODO", "STEP1", "STEP2", "STEP3", "STEP4", "STEP5", "COMPLETED"];
const ENUM_IS_TRUSTED_TALENT = ["NOT_VERIFIED", "FAILED", "TRUSTED"];
const ENUM_CLIENT_ONBOARDING_STATUS = ["TODO", "STEP1", "STEP2", "STEP3", "STEP4", "COMPLETED"];

const ENUM_APPLICATION_STATUS = ["APPLIED", "REJECTED", "REVIEW", "INTERVIEW", "ARCHIVED"];
const ENUM_LOCATION = ["REMOTE", "HYBRID", "ONSITE"];
const ENUM_TERM = ["Full time contract"];
const ENUM_ASSESSMENT_TYPE = ["HACKEREARTH", "RECORD"];
const ENUM_HACKEREARTH_TEST = ["MCQ", "CODING"];
const ENUM_ASSESSMENT_STATUS = ["TODO", "SUBMITTED", "PASSED", "FAILED"];
const ENUM_OFFER_STATUS = ["OFFERED", "ACCEPTED", "DECLINED", "WITHDRAWN"];
const ENUM_CONTRACT_STATUS = ["ACTIVE", "INACTIVE", "TERMINATE"];
const ENUM_TIMEZONE = ["PST", "AST", "HST", "EST", "MST", "UTC-11", "CST", "AKST", "UTC+10"];
const ENUM_JOBPOSTING_STATUS = ["ACTIVE", "NOT ACTIVE", "FILLED"];

// JOB POSTING & CONTRACT
const ENUM_NUMBER_OF_HIRES = ["1", "2", "3", "4", "5+"];
const ENUM_TERM_OF_HOURS_DURATION = ["WEEKLY", "MONTHLY"];
const ENUM_PAY_FREQUENCY = ["Semi-monthly", "Monthly"];
const ENUM_OFFER_WITHDRAW_REASON = ["OVERDUE", "FILLED FROM OUT", "ALREADY ACCEPTED"];

// REFERRAL
const ENUM_REFERRAL_TYPE = ["PENDING", "SIGNEDUP", "TRUSTED"];

// TOKEN REWARD
const ENUM_REWARD_SOURCE = ["ASSESSMENTS", "CONTRACT", "REFERRAL", "JOB APPLICATION"];
const ENUM_REWARD_TRANSACTION_STATUS = ["PENDING", "CANCELLED", "COMPLETED"];
const ENUM_REWARD_STATUS = ["LOCKUP", "VESTING"];

// Company
const ENUM_COMPANY_INDUSTRY_TYPES = ["Web3", "Fianace", "Saas", "Mobile", "Marketplace"];
const ENUM_COMPANY_NUMBER_OF_EMPLOYEES = [
  "1-10",
  "10-50",
  "51-200",
  "201-500",
  "501-1000",
  "1000+",
];
const ENUM_COMPANY_STAGE = [
  "Pre-funded",
  "Early stage",
  "Late stage startup",
  "Public corporation",
  "Other",
];
const ENUM_COMPANY_TERM_OF_OPEN_ROLE = ["Part time contract", "Full time contract", "Direct Hire"];
const ENUM_COMPANY_NUMBER_OF_OPEN_ROLE = ["1-10", "11-50", "51-100", "101-500", "500+"];
const ENUM_CLIENT_POSITION = ["ADMIN", "RECRUITER", "HIRING MANAGER", "BILLILNG"];

const ENUM_INVOICE_TYPE = ["due", "paid", "upcoming", "overdue"];

// Review Direction

const ENUM_REVIEW_DIRECTION = ["C2F", "F2C"];

const getEnumField = (array, fieldName) => {
  return {
    type: DataTypes.STRING,
    set(value: string) {
      if (value != null && value !== undefined && value !== "" && !array.includes(value)) {
        throw new Error(ENUM_ERROR_MSG);
      }

      this.setDataValue(fieldName, value);
    },
  };
};

export {
  USER_TYPES,
  REFERRAL_LINKS,
  ENUM_ERROR_MSG,
  ENUM_EDUCATIN_TYPE,
  ENUM_EXPERIENCE_TYPE,
  ENUM_YEARS_OF_EXPERIENCE,
  ENUM_DEGREES,
  ENUM_LEVEL_OF_EXPERIENCE,
  ENUM_PROFESSION,
  ENUM_ONBOARDING_STATUS,
  ENUM_IS_TRUSTED_TALENT,
  ENUM_APPLICATION_STATUS,
  ENUM_LOCATION,
  ENUM_TERM,
  ENUM_ASSESSMENT_TYPE,
  ENUM_HACKEREARTH_TEST,
  ENUM_ASSESSMENT_STATUS,
  ENUM_OFFER_STATUS,
  ENUM_CONTRACT_STATUS,
  ENUM_TIMEZONE,
  ENUM_JOBPOSTING_STATUS,
  ENUM_PAY_FREQUENCY,
  ENUM_NUMBER_OF_HIRES,
  ENUM_TERM_OF_HOURS_DURATION,
  ENUM_OFFER_WITHDRAW_REASON,
  ENUM_REVIEW_DIRECTION,
  ENUM_REFERRAL_TYPE,
  ENUM_REWARD_SOURCE,
  ENUM_REWARD_TRANSACTION_STATUS,
  ENUM_REWARD_STATUS,
  ENUM_COMPANY_INDUSTRY_TYPES,
  ENUM_COMPANY_NUMBER_OF_EMPLOYEES,
  ENUM_COMPANY_STAGE,
  ENUM_COMPANY_TERM_OF_OPEN_ROLE,
  ENUM_COMPANY_NUMBER_OF_OPEN_ROLE,
  ENUM_CLIENT_POSITION,
  ENUM_CLIENT_ONBOARDING_STATUS,
  ENUM_INVOICE_TYPE,
  USER_TYPES_PERMISSION,
  getEnumField,
};
