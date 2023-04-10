import { createEmailFromGenerate } from "./template";

const getMockEmail = () => {
  return {
    subject: "Test Email",
    content: createEmailFromGenerate(
      "This is mock email",
      `
      <a href="" class="button"
        >Mocked</a
      >
    `,
      ``,
    ),
  };
};

const getWelcomeEmail = (link) => {
  return {
    subject: "Welcome to Outdefine!",
    content: createEmailFromGenerate(
      "Welcome to Outdefine!",
      `
      <p class="message-content margin-2">
        We can't wait to see how you help shape the world of web3. You are officially a Founding community member!
      </p>
      <div class="message-format-list">
        <p class="bold-font message-content margin-3">Quickstart</p>
        <ul>
          <li class="message-content">
            Outdefine is a decentralized talent community where you can network with like minded professionals and grow your career.
          </li>
          <li class="message-content">
            Complete the assessment process to unlock even more features like increasing your exposure to top companies and efficiently applying to full-time positions globally.
          </li>
        <ul>
      </div>
      <div class="message-format-list">
        <p class="bold-font message-content margin-3">Refer and earn</p>
        <ul>
          <li class="message-content">
            Earn 500 Outdefine tokens when you successfully become a Trusted Member. 
          </li>
          <li class="message-content">
            Complete the assessment process to unlock even more features like increasing your exposure to top companies and efficiently applying to full-time positions globally.
          </li>
        <ul>
      </div>
    `,
      `
      <a href="${link}" class="button">
        Log in
      </a>
    `,
    ),
  };
};

const getVerifyAccountEmail = (name, code) => {
  return createEmailFromGenerate(
    "Your account is almost ready",
    `
      <p class="message-content margin-2">
        Great news, ${name}, your account is almost ready! You are one step closer to joining a community where you will network with like minded people, earn tokens, and embark on a career path that fits your lifestyle. 
      </p>

      <p class="message-content margin-2">
        Use the code below to verify your account.
      </p>
    `,
    `
      <span href="/signup?referral_code=" class="button margin-1">
        ${code}
      </span>
    `,
  );
};

const getResendVerifyAccountEmail = (code) => {
  return createEmailFromGenerate(
    "We resent your verification code",
    `
      <p class="message-content margin-2">
        Use the code below to verify your account.
      </p>
    `,
    `
      <span href="/signup?referral_code=" class="button margin-1">
        ${code}
      </span>
    `,
  );
};

const getPasswordResetEmail = (link) => {
  return createEmailFromGenerate(
    "Password reset request",
    `
        <p class="message-content margin-2">
          You’re receiving this email because you requested to change your Outdefine password. Tap the button below to reset your password.
        </p>
      `,
    `
      <a href="${link}" class="button">
        Reset password
      </a>
    `,
  );
};

const getResetConfirmationEmail = (link) => {
  return createEmailFromGenerate(
    "Your password has been changed.",
    `
      <p class="message-content margin-2">
        You’re receiving this email because your password has been changed. No further action is needed. If you didn’t request this change please contact community@outdefine.com.
      </p>
    `,
    `
      <a href="${link}" class="button">
        Go to profile
      </a>
    `,
  );
};
interface IInvitationEmail {
  companyName: string;
  userName: string;
  contractType: string;
  jobTitle: string;
  rate: string;
  location: string;
  skills: string[];
}

const getInvitationAlertMail = (data: IInvitationEmail) => {
  return {
    subject: `You've received an interview invite!`,
    content: createEmailFromGenerate(
      `You have received an interview invite for ${data.jobTitle} at ${data.companyName}!`,
      `
        <pre class="message-content" style="margin-top: 32px;">
Hey ${data.userName}! ${
        data.companyName
      } is interested in interviewing you for a ${data.contractType.toLowerCase()} position! Check out the specs below: 
  
Job role: ${data.jobTitle} 
Pay rate: ${data.rate} 
Location: ${data.location[0] + data.location.slice(1, data.location.length).toLowerCase()} 
Skills: ${data.skills.slice(0, 3).join(",")}${data.skills.length > 3 ? "..." : ""}          

Does this seem like it might be an interesting opportunity? If you'd like to pursue the interview, a member from Outdefine can assist in scheduling your interview with ${
        data.companyName
      } for ${data.jobTitle} or you can schedule your interview by accepting your invitation.
        </pre>
      `,
      `<a class="button" href="https://app.outdefine.com/jobs/yours" target="_blank" rel="noopener noreferrer">Go to invitations</a>`,
      `<p class="before-footer-text" style="margin-top: 90px;">You have 7 days to schedule your interview. If you do not schedule your interview during this time your invite can be withdrawn. If you would like to decline this invite you can do this on your <span style="color: #5F5FFF;">“Jobs”</span> page under your <span style="color: #5F5FFF;">“Invited”</span> tab.</p>`,
    ),
  };
};

interface IOfferEmail {
  userName: string;
  companyName: string;
  jobTitle: string;
}

const getOfferAlertMail = (data: IOfferEmail) => {
  return {
    subject: `Congrats! You received a ${data.jobTitle} Offer at ${data.companyName}:Next Steps Inside`,
    content: createEmailFromGenerate(
      `First line, You have received a job offer at ${data.companyName}!`,
      `<pre class="message-content" style="margin-top: 72px;">
Congratulations, ${data.userName}! You have received a job offer from ${data.companyName} for the position of ${data.jobTitle}. 

Next steps: 
1. Read through your job offer by logging in to your account.
2. To accept your job offer, follow the prompts inside of your account.
    
When you accept a position on Outdefine, you will earn tokens. You will earn more tokens when you continue to work and hit certain milestones in your contract agreement. Please complete the next steps by viewing your official job offer.</pre>`,
      `<a href="https://app.outdefine.com/jobs/offer" target="_blank" class="button">
      Go to offers
    </a>`,
    ),
  };
};

interface IOfferAcceptedEmail {
  userName: string;
  companyName: string;
  jobTitle: string;
  rate: string;
  contractStart: string;
  contractEnd: string;
}

const getOfferAcceptAlertEmail = (data: IOfferAcceptedEmail) => {
  return {
    subject: `It's official, you accepted the offer!`,
    content: createEmailFromGenerate(
      `You've accepted a full time contract!`,
      `<pre class="message-content" style="margin-top: 60px;">
Congratulations, ${data.userName}! You have accepted a full-time contract with ${data.companyName} for the position of ${data.jobTitle} and have earned <b>250 Outdefine tokens!</b> 
  
Here are some of the details about your acceptance: 
Company name: ${data.companyName} 
Job title: ${data.jobTitle} 
Pay rate: $${data.rate}/hr 

<b>Tokens earned: 250</b>
We are thrilled to see you succeed in this way and are excited to watch you continue to grow your career with Outdefine in your new position with ${data.companyName}! Share the exciting news with your Outdefine community in <a href="https://www.discord.gg/outdefine" target="_blank" rel="noreferrer noopener" style="color: #5F5FFF;">Discord!</a> 
        
View your acceptance and next steps from ${data.companyName} within your account.</pre>`,
      `<a class="button" href="https://app.outdefine.com/jobs/manage" target="_blank">Go to manage jobs</a>`,
    ),
  };
};

interface IInvitationToApplyEmail {
  talentName: string;
  companyName: string;
  jobTitle: string;
  rate: string;
  location: string;
}

const getInvitationToApplyAlertMail = (data: IInvitationToApplyEmail) => {
  return {
    subject: `${data.talentName}, you have been invited to interview with ${data.companyName} on Outdefine.`,
    content: createEmailFromGenerate(
      `You have been invited for an interview on Outdefine.`,
      `<pre class="message-content" style="margin-top: 72px;">
${data.talentName}, ${
        data.companyName
      } came across your profile on Outdefine and have invited you to interview for their ${
        data.jobTitle
      } role. Here are a few details about this position:

Job title: ${data.jobTitle}
Salary: ${data.rate}
Location: ${data.location[0] + data.location.slice(1, data.location.length).toLowerCase()}

You can find more information about the job opportunity and ${
        data.companyName
      }, including the job description and requirements, directly within your Outdefine profile. Follow the link in this email to directly apply.
      </pre>`,
      `<a class="button" href="https://app.outdefine.com/jobs/yours" target="_blank" rel="noreffer noopener">View job</a>`,
      `<p class="before-footer-text" style="margin-top: 90px;">If you have any questions or need assistance with the application process, please feel free to reach out to us at <a href="mailto:community@outdefine.com" style="color: #5F5FFF;">community@outdefine.com</a></p>`,
    ),
  };
};

export {
  getMockEmail,
  getWelcomeEmail,
  getVerifyAccountEmail,
  getResendVerifyAccountEmail,
  getPasswordResetEmail,
  getResetConfirmationEmail,
  getInvitationAlertMail,
  getOfferAlertMail,
  getOfferAcceptAlertEmail,
  getInvitationToApplyAlertMail,
};
