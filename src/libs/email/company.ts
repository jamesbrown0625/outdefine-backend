import { createEmailFromGenerate } from "./template";

const getCompanyWelcomeEmail = (link) => {
  return {
    subject: "Welcome to Outdefine!",
    content: createEmailFromGenerate(
      "Welcome to Outdefine!",
      `
        <p class="message-content margin-2">
          Welcome to Outdefine! We are thrilled to have you join us. With your new account you will have the ability to connect with Trusted Members globally. We believe these talents will be an asset to your team and we guarantee to provide you with 3-5 potential talent matches within 1 week of successfully completing your account.
        </p>

        <p class="message-content margin-3">
          Log in to your account to share your job openings and connect with Outdefine Trusted Members.
        </p>

        <p class="message-content margin-3">
          <span class="message-content-bold-font">
            Questions and support 
          </span>
          <br/>
          For direct support or assistance in using your new account, contact our Sales team at 
          <span style="text-decoration: underline">
            sales@outdefine.com 
          </span>
        </p>
      `,
      `
        <a href="${link}" class="button">
          Log in
        </a>
      `,
    ),
  };
};

const getCompanyVerifyAccountEmail = (name, code) => {
  return {
    subject: "Please verify your account",
    content: createEmailFromGenerate(
      "Your account is almost ready ",
      `
        <p class="message-content margin-2">
          Great news, ${name}, your company account is almost ready! You are one step closer to joining a platform where you will get access to Outdefine approved Trusted Members. Our team has ensured that Trusted Members have successfully passed a series of assessments that span the areas of skills, behavior, and communication.
        </p>

        <p class="message-content margin-3">
          Use the code below to verify your account.
        </p>
      `,
      `
        <span class="button">
          ${code}
        </span>
      `,
    ),
  };
};

const getCompanyInviteMemberEmail = (companyName, name, link) => {
  return {
    subject: `You've been invited to ${companyName} team account. Complete your account setup`,
    content: createEmailFromGenerate(
      `You've been invited to ${companyName} team account. Complete your account setup`,
      `
        <p class="message-content margin-2">
          Hey! Your colleague, ${name}, has invited you to join <Company> on Outdefine. With Outdefine you will be able to help manage your company's account, post job listings, hire Trusted Members, and more. 
        </p>

        <p class="message-content margin-3">
          Use the link below to complete your account setup.
        </p>
      `,
      `
        <a href="${link}" class="button">
          Sign up
        </a>
      `,
    ),
  };
};

const getRecommendedCandidatesEmail = (link) => {
  return {
    subject: `Review your shortlisted talent matches!`,
    content: createEmailFromGenerate(
      `You have new shortlisted talent matches to review!`,
      `
        <p class="message-content margin-2">
          You've successfully posted a job listing to Outdefine. After reviewing the details and specifications of the position, we came up with a selection of potential talent matches. We provide personalized talent match options as a courtesy and supplement to your own talent search. 
        </p>

        <p class="message-content margin-2">
          To view our recommendations and request further support from our team, follow the link below.
        </p>
      `,
      `
        <a href="${link}" class="button">
          View recommendations
        </a>
      `,
    ),
  };
};

interface ITalentAcceptOfferEmail {
  userName: string;
  jobTitle: string;
}

const getTalentAcceptOfferAlertEmail = (data: ITalentAcceptOfferEmail) => {
  return {
    subject: `Offer Accepted: ${data.userName} has accepted ${data.jobTitle}!`,
    content: createEmailFromGenerate(
      `Your offer has been accepted!`,
      `<pre class="message-content" style="margin-top: 102px;">
${data.userName}, has accepted your job offer for ${data.jobTitle}. This talent is now a part of your team!
  
Manage and keep track of your team in your <span style="color: #5F5FFF">“Talent”</span> page, under <span style="color: #5F5FFF">“Manage talent”.</span></pre>`,
      `<a class="button" href="https://app.outdefine.com/talent/manage" target="_blank" rel="noreffer noopener">Go to manage team</a>`,
    ),
  };
};

interface IApplicationAlertEmail {
  jobTitle: string;
  companyAdminName: string;
  talentName: string;
}

const getApplicationAlertEmail = (data: IApplicationAlertEmail) => {
  return {
    subject: `Application Received: ${data.talentName} just applied to ${data.jobTitle}`,
    content: createEmailFromGenerate(
      `You received a new application submission!`,
      `<pre class="message-content" style="margin-top: 72px;">
${data.companyAdminName}, you have received a new application submission from a Trusted Member, ${data.talentName}, for the position of ${data.jobTitle}. 

Please log in to your company account to view the applicant's profile, work history, and details.
      </pre>`,
      `<a class="button" href="https://app.outdefine.com/talent/applications" target="_blank" rel="noreffer noopener">Go to applications</a>`,
    ),
  };
};

export {
  getCompanyWelcomeEmail,
  getCompanyVerifyAccountEmail,
  getCompanyInviteMemberEmail,
  getRecommendedCandidatesEmail,
  getTalentAcceptOfferAlertEmail,
  getApplicationAlertEmail,
};
