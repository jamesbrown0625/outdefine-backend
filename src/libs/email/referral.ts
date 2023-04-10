import { createEmailFromGenerate } from "./template";

const getReferralEmail = (name, link) => {
  return {
    subject: `${name} has referred you to Outdefine! Join today`,
    content: createEmailFromGenerate(
      `${name} has invited you to Outdefine!`,
      `
        <p class="message-content margin-2">
          Hey there! ${name} thinks that you are an exceptional talent and would find success at Outdefine! I wanted to reach out and invite you to be a trusted member of the Outdefine community.
          <br/>
          <br/>
          Outdefine is an excellent community if you want to take your career to the next level with premier job opportunities, growth within web3, networking opportunities, and early access to the Outdefine token and NFT rewards.
        
          <br/>
          <br/>
          <span class="message-content-bold-font">
            What is Outdefine?
          </span>
          <br/>
          Outdefine is a web3 decentralized talent community that connects top talent with leading companies and enterprises globally. By joining this community, you can earn native Outdefine token rewards for finding and doing work, referring friends, and becoming a Trusted Member. As a Trusted Member, you will earn <span class="message-content-bold-font">500 Outdefine tokens</span> and access to premier job opportunities, networking, and a token-powered global community.

          <br/>
          <br/>
          <span class="message-content-bold-font">
            Benefits
          </span>
          <br/>
          As a Trusted Member of the Outdefine community, you can find premier jobs and <span class="message-content-bold-font">keep all your earnings.</span> Contrast this with traditional hiring networks and agencies that charge membership fees and take up to 100% of your earnings as their markup. You also earn tokens and unique achievement NFTs rewards.
          <br/>
          And with our decentralized open-source community, you can interact directly with companies without middlemen. The community is available for anyone to see, use, or build on, making it more transparent and accessible for all. Learn more on our 
          <a href="https://discord.gg/outdefine" class="red-underline-txt"> 
            discord server. 
          </a>

          <br/>
          <br/>
          <span class="message-content-bold-font">
            Built by a seasoned team
          </span>
          <br/>
          Romil Verma, CEO, and Sanjay Verma, COO, co-founded Outdefine. Romil's foundation began at Stanford and Purdue where he studied crypto and blockchain. Later, he went on to work for Search at Google and co-founded a $100M fintech startup. Sanjay has built a $2.5B engineering services company and understands what it takes to create the next generation of talent experience that is fair and efficient. Check out the full scoop on Outdefine and how we are a talent-first community by reading our 
          <a href="https://outdefine.com/whitepaper" class="red-underline-txt"> 
            token whitepaper.
          </a>

          <br/>
          <br/>
          <span class="message-content-bold-font">
            Backed by top web3 investors
          </span>
          <br/>
          Outdefine is venture-backed by investors such as TCG Crypto, Jump Crypto, Blocore, Big Brain Holdings, and Formless Capital, who believe in the mission to make remote work fair for talent and want to help people own their careers. Read the 
          
          <a href="https://www.theblock.co/post/193418/jump-crypto-and-tcg-crypto-back-decentralized-hiring-network-outdefine" class="red-underline-txt"> 
            fundraising announcement here.
          </a>

          <br/>
          <br/>
          <span class="message-content-bold-font">
            Opportunities with top companies
          </span>
          <br/>
          There are jobs available with top enterprises and web3 startups like Microsoft, Walmart, IBM, and more.
          <br/>
          These companies are looking to hire trusted talent from the Outdefine community, and we think you are a good fit to join our community.
          <br/>
          <br/>
          Please let me know if you have any questions or want to learn more about it. I am more than happy to assist in any way that I can. Join with your personalized invitation link.
        </p>
      `,
      `
      <a href="${link}" class="button"
        >Accept invite</a
      >
      <p class="message-content margin-2">
        Best, <br/>
        Halle from Outdefine <br/>
        Sr.Community and Marketing Manager<br/>
        Outdefine<br/>
      </p>
    `,
    ),
  };
};

const getReferalPassedAssessmentEmail = (userName, referedName, link) => {
  return {
    subject: "You just earned 250 tokens for your successful referral!",
    content: createEmailFromGenerate(
      `Your referral passed their assessment!`,
      `
        <p class="message-content margin-2">
          Hey ${userName}, You referred ${referedName} to Outdefine. Great news! They accepted the invitation and went on to pass their assessment.
        </p>

        <p class="message-content margin-2">
          You have earned <span class="message-content-bold-font">250 Outdefine tokens</span> which can be viewed in your account. Every time you refer a friend who moves on to pass their assessment and become a Trusted Member, you earn <span class="message-content-bold-font">250 tokens</span>.
        </p>

        <p class="message-content margin-2">
          Thank you for helping shape the Outdefine community! To view your token account, log in with the link below.
        </p>
      `,
      `
      <a href="${link}" class="button"
        >Go to tokens</a
      >
    `,
    ),
  };
};

export { getReferralEmail, getReferalPassedAssessmentEmail };
