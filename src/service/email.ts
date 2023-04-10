import { getSES, getSESV2 } from "@config";
import { EmailObject } from "@resource";

export const sendEmailV1 = async (
  emailData: EmailObject,
  emailList: Array<string>,
  ccAddresses?: Array<string>,
) => {
  const ses = getSES();
  const params = {
    Destination: {
      BccAddresses: [],
      CcAddresses: ccAddresses ?? [],
      ToAddresses: emailList,
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: emailData.content,
        },
        Text: {
          Charset: "UTF-8",
          Data: "Join Outdefine talent market",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: emailData.subject,
      },
    },
    ReplyToAddresses: ["community@outdefine.co"],
    Source: "Outdefine <community@outdefine.co>",
  };

  try {
    await new Promise((res, rej) => {
      ses.sendEmail(params, (err, data) => {
        if (err) rej(err);
        else res(data);
      });
    });
    console.log("Email successfully sent!");
  } catch (err) {
    console.log(err);
  }
};

export const sendEmail = async (emailData: EmailObject, emailList: Array<string>) => {
  const params = {
    FromEmailAddress: "Outdefine <jobs@outdefine.com>",
    Destination: { ToAddresses: emailList },
    ListManagementOptions: {
      // Defining this object allows us to have {{amazonSESUnsubscribeUrl}}
      ContactListName: "outdefineContactList", // Needs to point to a contact list
    },

    Content: {
      Simple: {
        Subject: {
          Data: emailData.subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: emailData.content,
            Charset: "UTF-8",
          },
        },
      },
    },
  };

  try {
    await getSESV2().sendEmail(params).promise();
  } catch (e) {
    console.error(`Failed to put - ${e}`);
  }
};

export const createContactList = async (name) => {
  const params = {
    ContactListName: name /* required */,
    Description: "Outdefine Community",
    Topics: [
      {
        TopicName: "Outdefine_Community",
        DisplayName: "Outdefine Community",
        Description: "Outdefine Community",
        DefaultSubscriptionStatus: "OPT_IN",
      },
    ],
  };

  try {
    await getSESV2().createContactList(params).promise();
  } catch (e) {
    console.error(`Failed to create a new contact list - ${e}`);
  }
};

export const createContact = async (name, email) => {
  const params = {
    ContactListName: name /* required */,
    EmailAddress: email /* required */,
    AttributesData: "",
    TopicPreferences: [
      {
        SubscriptionStatus: "OPT_IN" /* required */,
        TopicName: "Outdefine_Community" /* required */,
      },
      /* more items */
    ],
    UnsubscribeAll: true || false,
  };

  try {
    await getSESV2().createContact(params).promise();
  } catch (e) {
    console.error(`Failed to create a new contact - ${e}`);
  }
};
