const assessment = {
  test_id: 214213412,
  email_id: "bob@gmail.com",
};

const updateCandidateAssessmentInfoRecordParam = {
  email_id: "bob@gmail.com",
  mcq_passed: false,
};

const clientSocialLink = {
  company_id: "123",
  linkedin_link: "linkedin",
  twitter_link: "twiter",
  instagram_link: "instagram",
};

const updateCompanyLogoParam = {
  company_id: "12",
  logo: "link",
};

const updateOnboardingStatusParam = {
  client_id: "123",
  onboarding_status: "yes",
};

const inviteEmail = {
  user_id: "123",
  emailList: ["test@outdefine.com", "test2@outdefine.com"],
};

export {
  assessment,
  updateCandidateAssessmentInfoRecordParam,
  clientSocialLink,
  updateCompanyLogoParam,
  updateOnboardingStatusParam,
  inviteEmail,
};

export * from "./user";
export * from "./assesments";
