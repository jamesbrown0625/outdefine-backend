export type EmailObject = {
  subject: string
  content: string
}

export const getInviteToApplyTemplate = (
  interviewer: string,
  company: string,
  interviewee: string,
  position: string,
  calendar_link: string,
): EmailObject => ({
  subject: `You have been invited to interview with ${company}!`,
  content: `<html style="font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, 'sans-serif';">
    <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="noopener" target="_blank" href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Montserrat:thin,extra-light,light,100,200,300,400,500,600,700,800" rel="stylesheet">
    </head>
    <body style="background-color:#333; font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; ">
        <div
            style="margin: 0 auto; width: 640px; background-color: #fff; font-size: 1.2rem; font-style: normal;font-weight: normal;line-height: 19px;">
            <div style="padding: 40px 80px;">
                <div>
                    <div>
                        <img src="https://www.app.outdefine.com/common/logo/OutdefineLogo.png" width="40" height="40" alt="logo" style="float: left; margin-top: 5px;" />
                        <p style="letter-spacing: 0.05em; margin-left: 56px; font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; line-height: 150%; font-weight:800; font-size:32px; font-style: normal; color: #2F3454">
                            outdefine
                        </p>
                    </div>
                </div>

                <p style="margin-top: 40px; font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; letter-spacing: -0.05em; color: #2F3454; font-weight: 600; font-size: 48px; line-height: 64px;">
                    You have been invited to interview with ${company}!
                </p>

                <p style="margin-bottom: 56px; font-family: 'Inter', sans-serif; letter-spacing: -0.02em; line-height: 24px; color: black; font-size: 20px; ">
                    Hey ${interviewee}, here’s a quick introduction to ${interviewer} from ${company}, she has invited you to apply to ${position} position. Click the “schedule interview” below to schedule your first interview. Please feel free to respond to this email to chat with ${interviewer} or a member of the Outdefine team. 
                </p>

                <div style="width: 170px; padding: 16px 20px; background-color: #2F3454; border-radius: 8px; text-align: center; color: white; font-family: 'Inter', sans-serif; font-size: 16px; line-height: 24px">
                    <a href="${calendar_link}" style="color: white; text-decoration: none;">Schedule Interview</a>
                </div>
                <p style="margin-top: 56px; font-family: 'Inter', sans-serif; letter-spacing: -0.02em; line-height: 24px; color: #2F3454; font-size: 16px; ">
                    If you didn’t request this email, there’s nothing to worry about. You can safely ignore it.
                </p>

                <div style="border-top: 2px solid #333333; padding-top: 26px;">
                    <div>
                        <img src="https://www.app.outdefine.com/common/logo/OutdefineLogo.png" width="32" height="32" alt="logo" style="float: left; margin-top: 5px;" />
                        <p style="padding-top:10px; letter-spacing: 0.05em; margin-left: 46px; font-family: 'Montserrat', 'Helvetica Neue', Helvetica, Arial, 'sans-serif'; line-height: 150%; font-weight:800; font-size:16px; font-style: normal; color: #2F3454">
                            outdefine
                        </p>
                    </div>
                    <p style="margin-bottom: 24px; font-family: 'Inter', sans-serif; line-height: 24px; color: #2F3454; font-size: 14px; ">Own your career</p>
                    <a href="https://twitter.com/outdefine" style="text-decoration: none; padding:10px 18px; width: 98px; height: 36px; border: 2px solid #5F5FFF; border-radius: 10px; color: #5F5FFF;; font-size: 16px; line-height: 16px;">Twitter</a>
                    <a href="https://discord.gg/outdefine" style="text-decoration: none; padding:10px 18px; width: 98px; height: 36px; border: 2px solid #5F5FFF; border-radius: 10px; color: #5F5FFF;; font-size: 16px; line-height: 16px;">Discord</a>
                    <a href="https://linkedin.com/company/outdefine" style="text-decoration: none; padding:10px 18px; width: 98px; height: 36px; border: 2px solid #5F5FFF; border-radius: 10px; color: #5F5FFF;; font-size: 16px; line-height: 16px;">Linkedin</a>
                </div>
                
            </div>
        </div>
    </body>
    </html>`,
});
