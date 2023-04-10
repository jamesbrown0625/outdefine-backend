const createEmailFromGenerate = (headerText, content, actionButton, appendedText?: string) =>
  `<html
    style="
      font-family: 'Inter', 'Montserrat', 'Poppins', 'Helvetica Neue', 'Helvetica,
        Arial',
        'sans-serif';
    "
  >
    <head>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        rel="noopener"
        target="_blank"
        href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Montserrat:thin,extra-light,light,100,200,300,400,500,600,700,800"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <style>
        body {
          font-family: "Inter", "Helvetica Neue", Helvetica, Arial, "sans-serif";
        }

        .before-footer-text {
          font-size: 12px;
          font-family: "Inter", sans-serif;
          line-height: 24px;
        }

        .message-wrapper {
          margin: 0 auto;
          padding: 40 10px;
          padding-top: 61px;
          background-color: #fff;
          font-size: 1.2rem;
          font-style: normal;
          font-weight: normal;
          line-height: 19px;
        }

        .red-underline-txt {
          color: #ff5757;
          text-decoration: underline;
        }

        @media only screen and (min-width: 680px) {
          .message-wrapper {
            max-width: 640px;
          }
        }

        @media only screen and (max-width: 680px) {
          .message-wrapper {
            max-width: 100%;
          }
        }

        .logo-left {
          float: left;
          background-color: #2f3454;
          border-bottom-left-radius: 9999px;
          border-top-left-radius: 9999px;
          border: 8px solid #2f3454;
          border-right: none;
        }
        .logo-right {
          float: left;
          margin-left: 4px;
          border-bottom-right-radius: 9999px;
          border-top-right-radius: 9999px;
          border: 8px solid #2f3454;
          border-left: none;
        }
        .logo-text {
          font-family: "Montserrat", "Helvetica Neue", Helvetica, Arial,
            "sans-serif";
          letter-spacing: 0.05em;
          font-weight: 900;
          font-size: 32px;
          font-style: normal;
          color: #2f3454;
          padding-top: 11px;
          margin: 0px;
          padding-left: 16px;
        }
        .footer-logo-text {
          font-family: "Montserrat", "Helvetica Neue", Helvetica, Arial,
            "sans-serif";
          margin: 0px;
          padding-top: 5px;
          padding-left: 11px;
          letter-spacing: 0.05em;
          line-height: 24px;
          font-weight: 800;
          font-size: 16px;
          font-style: normal;
          color: #2f3454;
        }
        .footer-text {
          font-family: "Inter", sans-serif;
          line-height: 20px;
          margin-top: 37px;
          font-weight: 600;
          color: #2f3454;
          font-size: 14px;
        }
        .social-link {
          color: #5f5fff;
          font-family: "Inter", sans-serif;
          font-weight: 600;
          font-size: 12px;
          line-height: 12px;
          text-decoration: none;
          padding: 10px 18px;
          border: 2px solid #5f5fff;
          border-radius: 8px;
          margin-right: 10px;
        }
        .message-header {
          font-family: "Poppins", "Helvetica Neue", Helvetica, Arial, "sans-serif";
          letter-spacing: -0.05em;
          color: #2f3454;
          font-weight: 600;
          font-size: 36px;
          line-height: 45px;
        }
        .message-format-list {
          margin: 0px;
        }
        .message-format-list > ul {
          margin: 0px;
          padding: 0px;
          padding-left: 25px;
        }
        .margin-0 {
          margin: 0px;
        }
        .margin-1 {
          margin: 0px;
          margin-top: 98px;
        }
        .margin-80 {
          margin: 0px;
          margin-top: 80px;
        }
        .margin-2 {
          margin: 0px;
          margin-top: 48px;
        }
        .margin-3 {
          margin: 0px;
          margin-top: 35px;
        }
        .bold-font {
          font-weight: 550 !important;
          line-height: 30px !important;
        }
        .message-content {
          font-family: "Inter", sans-serif;
          font-weight: 400;
          letter-spacing: -0.02em;
          line-height: 24px;
          color: black;
          font-size: 16px;
        }
        .footer-wrapper {
          border-top: 2px solid #333333;
          padding-top: 26px;
          padding-bottom: 60px;
        }
        .button-wrapper {
          margin: 60px 0px;
        }
        .button {
          color: white !important;
          font-family: "Poppins", "Helvetica Neue", Helvetica, Arial, "sans-serif";
          background-color: #2f3454;
          text-decoration: none;
          padding: 20px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          line-height: 24px;
        }
        .footer-logo-wrapper {
          margin: 10px 0px;
        }
        .social-link-wrapper {
          padding: 0px;
          margin: 50px 0px;
        }
        .logo-wrapper {
          display: flex;
          flex-direction: row;
        }

        .li a[href] {
          color: white !important;
        }

        .ii a[href] {
          color: white !important;
        }

        .message-content-bold-font {
          font-weight: 600;
        }
      </style>
    </head>
    <body>
      <div class="message-wrapper">
        <div class="logo-wrapper">
          <img src="https://www.app.outdefine.com/common/logo/OutdefineLogo.png" width="40" height="40" alt="logo" style="float: left; margin-top: 0px;" />
          <p class="logo-text">outdefine</p>
        </div>

        <p class="message-header margin-1">${headerText}</p>           
        ${content}

        ${!!actionButton ? '<div class="button-wrapper">' + actionButton + "</div>" : ""}
        
        
        ${appendedText !== undefined ? appendedText : ""}


        <p class="message-content" style="font-size: 12px; margin-top:80px; margin-bottom:25px;">
          You are recieving this emails because you are subscribed to Outdefine emails. To unsubscribe from future emails you can 
          <a href="{{amazonSESUnsubscribeUrl}}">
            unsubscribe here.
          </a>
        </p>
        <div class="footer-wrapper">
          <div class="footer-logo-wrapper logo-wrapper">
            <img src="https://www.app.outdefine.com/common/logo/OutdefineLogo.png" width="32" height="32" alt="logo" style="float: left; margin-top: 0px;" />
            <p class="footer-logo-text">outdefine</p>
          </div>

          <p class="footer-text">Own your career.</p>

          <div class="social-link-wrapper">
            <a href="https://www.twitter.com/outdefine" class="social-link"> Twitter </a>
            <a href="https://www.discord.gg/outdefine" class="social-link"> Discord </a>
            <a href="https://www.linkedin.com/company/outdefine" class="social-link"> Linkedin </a>
          </div>
        </div>
      </div>
    </body>
  </html>
  `;

export { createEmailFromGenerate };
