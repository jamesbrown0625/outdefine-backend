import { createEmailFromGenerate } from "./template";

const getInterviewInviteEmail = (
  companyName,
  userName,
  contractType,
  jobTitle,
  salaryRange,
  location,
  skills,
  link,
) => {
  return {
    subject: `You've received an interview invite!`,
    content: createEmailFromGenerate(
      `You have received an interview invitation from ${companyName}!`,
      `
        <p class="message-content margin-2">
          Hey ${userName}! ${companyName} is interested in interviewing you for a ${contractType} position! Check out the specs below: 
        </p>

        <p class="message-content margin-3">
          Job role: ${jobTitle} <br/>
          Pay rate: ${salaryRange}  <br/>
          Location: ${location}  <br/>
          Skills: ${skills} <br/>
        </p>

        <p class="message-content margin-3">
          Does this seem like it might be an interesting opportunity? If you'd like to pursue the interview, a member from Outdefine can assist in scheduling your interview with <Company Name> for <Job Title> or you can schedule your interview using the button below. 
        </p>
      `,
      `
        <a href="${link}" class="button">
          Schedule interview
        </a>
      `,
    ),
  };
};

export { getInterviewInviteEmail };
