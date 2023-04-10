import { createEmailFromGenerate } from "./template";

const getAssessmentRoleConfirmEmail = (name, role, link) => {
  return {
    subject: "Your assessment is ready to begin!",
    content: createEmailFromGenerate(
      `Your ${role} assessment is ready for you`,
      `
      <p class="message-content margin-2">
        Hey ${name}, you've selected the role <Selected Role> to be assessed for. We are thrilled to have you on board and in the process of becoming a Trusted Member.
      </p>

      <p class="message-content margin-2">
        You will become a Trusted Member and earn <span class="message-content-bold-font">500 tokens</span> once you pass your assessment.
      </p>      

      <div class="margin-80">
      </div>
    `,
      `
      <a href="${link}" class="button" style="margin-bottom: 70">
        Begin assessment
      </a>
    `,
    ),
  };
};

const getAssessmentReminderEmail = (name, link) => {
  return {
    subject: "One more step to go! You forgot to complete your assessment",
    content: createEmailFromGenerate(
      `One more step to go!`,
      `
      <p class="message-content" style="margin-top:50px">
        Hey ${name}, it looks like you took the first step towards becoming a Trusted Member, but got sidetracked. After you pass your assessment you will earn <span class="message-content-bold-font">500 Outdefine Tokens</span> and be able to access jobs from top companies globally. Log in to your assessments page to complete the process!
      </p>

      <div class="margin-80">
      </div>
    `,
      `
      <a href="${link}" class="button" style="margin-bottom: 70">
        Go to assessments
      </a>
    `,
    ),
  };
};

const getAssessmentPassedEmail = (name, link) => {
  return {
    subject: "Welcome, Trusted Member! You passed your assessment!",
    content: createEmailFromGenerate(
      `Congratulations! You passed.`,
      `
      <p class="message-content margin-2">
        You did it, ${name}!
      </p>

      <p class="message-content margin-2">
        You successfully passed your assessment process and have earned <span class="message-content-bold-font">500 Outdefine tokens</span> in your account. You are officially a Trusted Member! 
      </p>

      <p class="message-content margin-2">
        As a Trusted Member you will: 
      </p>

      <p class="message-content margin-2">
        1. Receive exposure from top companies <br/>
        2. Be able to apply to global positions <br/>
        3. Showcase your Trusted Member badge in your user profile <br/>
        4. Use your tokens to boost your profile and job applications <br/>
        5. Vote in and govern the Outdefine community <br/>
      </p>

      <p class="message-content margin-2">
        We are thrilled to welcome you as a Trusted Member and we are in your corner as you begin to expand your career with new opportunities. Stay involved by joining Discord, where your insights and engagement are vital to the overall growth of your talent focused community. Cheers!
      </p>
    `,
      `
      <a href="${link}" class="button">
        Go to profile
      </a>
    `,
    ),
  };
};

const getAssessmentOneMoreAttemptEmail = (link) => {
  return {
    subject: "You got this! Complete your final assessment attempt",
    content: createEmailFromGenerate(
      `One more assessment attempt!`,
      `
      <p class="message-content margin-2">
        You have one more attempt to complete your assessment. The Outdefine team is rooting for you! 
      </p>

      <p class="message-content margin-2">
        Once you pass your assessment you will become a Trusted Member and earn <span class="message-content-bold-font">500 Outdefine Tokens</span>. 
      </p>

      <p class="message-content margin-2">
        If you do not pass your assessment in this round, you will be invited back to retest in 2 months.
      </p>
    `,
      `
      <a href="${link}" class="button">
        Go to assessment
      </a>
    `,
    ),
  };
};

const getAssessmentFailedEmail = (link) => {
  return {
    subject: "No worries! There is always next time.",
    content: createEmailFromGenerate(
      `Unfortunately, you have not passed the assessments.`,
      `
      <p class="message-content margin-2">
        No worries, you can try again in 2 months! Here's what you can do in the meantime to utilize the community and earn tokens along the way. 
      </p>

      <div class="margin-2" style="display: flex">
        <p class="message-content margin-0" style="flex-shrink: 0">1. &nbsp;</p>
        <p class="message-content margin-0">
          Refer and earn. For every friend you refer who passes their assessment
          you will earn
          <span class="message-content-bold-font">250 Outdefine tokens! </span>
        </p>
      </div>

      <div class="" style="display: flex">
        <p class="message-content margin-0" style="flex-shrink: 0">2. &nbsp;</p>
        <p class="message-content margin-0">
          Engage and participate. Join Discord and connect and network with like
          minded professionals. You will be able to enjoy virtual events and
          opportunities to grow your career in unique ways.
        </p>
      </div>

      <p class="message-content margin-2">
        Learn more about the referral program below!
      </p>
    `,
      `
      <a href="${link}" class="button">
        Refer a friend
      </a>
    `,
    ),
  };
};

const getAssessmentInviteBackEmail = (link) => {
  return {
    subject: `Let's try this again!`,
    content: createEmailFromGenerate(
      `Time flies! Come back to Outdefine to complete your assessment.`,
      `
      <p class="message-content margin-2">
        Great news! It has been two months and you are now able to try again on your assessment. 
      </p>

      <p class="message-content margin-2">
        When you pass your assessment you will become a Trusted Member and earn <span class="message-content-bold-font">500 Outdefine tokens! </span>
      </p>

      <p class="message-content margin-2">
        Trusted Members enjoy unique access to top web3 jobs globally and token earning benefits. Use the link below to give it a go!
      </p>
    `,
      `
      <a href="${link}" class="button">
        Go to assessment
      </a>
    `,
    ),
  };
};

const getAssessmentBehavioralInviteEmail = (link) => {
  return {
    subject: `You passed your skills test! Let's schedule your interview`,
    content: createEmailFromGenerate(
      `Congrats! You passed your assessment. Now let's schedule your interview!`,
      `
      <p class="message-content margin-2">
        You're in the final stretch to becoming a Trusted Member and earning <span class="message-content-bold-font">500 Outdefine Tokens</span>. You passed your skills test, hooray! The next step is to schedule your interview with an Outdefine team member. Our career experts are excited to meet you!
      </p>
    `,
      `
      <a href="${link}" class="button">
        Schedule now
      </a>
    `,
    ),
  };
};

/**
 *
 * @param time format:8/2/22  @2:00pm PST
 * @returns
 */
const getAssessmentBehavioralConfirmEmail = (time, link) => {
  return {
    subject: `Your interview with Outdefine is scheduled!`,
    content: createEmailFromGenerate(
      `Thank you for scheduling your interview.`,
      `
      <p class="message-content margin-2">
        Your interview is schedule for : <br />
        <span class="message-content-bold-font">${time}</span>
      </p>

      <div class="message-format-list">
        <p class="message-content margin-3">For your interview:</p>
        <ul>
          <li class="message-content">
            Follow the link to your assessments page and "Enter" your interview on the confirmed day and time. Make sure you have a functioning microphone and web cam to ensure a great conversation with your personal career expert.
          </li>
        <ul>
      </div>

      <div class="message-format-list">
        <p class="message-content margin-3">To reschedule:</p>
        <ul>
          <li class="message-content">
            Log in to your account and reschedule your interview in the assessments page. We'll see you soon!
          </li>
        <ul>
      </div>
    `,
      `
      <a href="${link}" class="button">
        Review invitation
      </a>
    `,
    ),
  };
};

export {
  getAssessmentRoleConfirmEmail,
  getAssessmentReminderEmail,
  getAssessmentPassedEmail,
  getAssessmentOneMoreAttemptEmail,
  getAssessmentFailedEmail,
  getAssessmentInviteBackEmail,
  getAssessmentBehavioralInviteEmail,
  getAssessmentBehavioralConfirmEmail,
};
