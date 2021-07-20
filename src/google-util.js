import { google } from "googleapis";
import config from "../config";
import dotenv from "dotenv";
dotenv.config();

const clientURL = process.env.CLIENT_URL;

/*******************/
/** CONFIGURATION **/
/*******************/

const googleConfig = {
  clientId: config.googleCredentials.clientId,
  clientSecret: config.googleCredentials.clientSecret,
  redirect: clientURL,
};

/*************/
/** HELPERS **/
/*************/

function createConnection() {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

/*************/
/** CONNECTION **/
/*************/

const auth = createConnection();

function makeBody(to, from, subject, message) {
  var str = [
    'Content-Type: text/html; charset="UTF-8"\n',
    "MIME-Version: 1.0\n",
    "Content-Transfer-Encoding: 7bit\n",
    "to: ",
    to,
    "\n",
    "from: ",
    from,
    "\n",
    "subject: ",
    subject,
    "\n\n",
    message,
  ].join("");

  var encodedMail = new Buffer(str)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return encodedMail;
}

function getGmailApi(auth) {
  return google.gmail({ version: "v1", auth });
}

function getGoogleCalendarApi(auth) {
  return google.calendar({ version: "v3", auth });
}

function getGoogleContactsApi(auth) {
  return google.people({ version: "v1", auth });
}

async function getUserByEmail(token, resource) {
  auth.setCredentials({ refresh_token: token });
  const people = getGoogleContactsApi(auth);
  // console.log(people);
  return await people.people.get({
    resourceName: resource,
  });
}

/**********/
/** MAIN **/
/**********/

/**
 * Take the "code" parameter which Google gives us once when the user logs in, then get the user's email and id.
 */
async function getGoogleAccountFromCode(code) {
  const data = await auth.getToken(code);
  const tokens = data.tokens;

  auth.setCredentials(tokens);
  const profile = await google.oauth2("v2").userinfo.v2.me.get({ auth: auth });
  return {
    id: profile.data.id,
    email: profile.data.email,
    full_name: profile.data.name,
    given_name: profile.data.given_name,
    family_name: profile.data.family_name,
    picture: profile.data.picture,
    refresh_token: tokens.refresh_token,
  };
}

async function sendGmail(token, subject, message, to) {
  auth.setCredentials({ refresh_token: token });
  const profile = await google.oauth2("v2").userinfo.v2.me.get({ auth: auth });

  var raw = makeBody(to, profile.data.email, subject, message);
  const gmail = getGmailApi(auth);
  const res = await gmail.users.messages.send({
    auth: auth,
    userId: "me",
    resource: {
      raw: raw,
    },
  });
  const messageSent = await getEmailWithAuthExisting(
    gmail,
    res.data.id,
    "full"
  );
  return messageSent;
}

async function getEmails(token, query = "", responseFormat = "metadata") {
  auth.setCredentials({ refresh_token: token });
  const gmail = getGmailApi(auth);
  const res = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults: query ? 50 : 100,
  });
  const messages = res.data.messages;

  const getEmails = async () => {
    return Promise.all(
      messages.reduce(function (filtered, message) {
        if (message) {
          filtered.push(
            getEmailWithAuthExisting(gmail, message.id, responseFormat)
          );
        }
        return filtered;
      }, [])
    );
  };

  // if (!messages) {
  //   return;
  // }
  if (!messages) {
    return "";
  }

  const emails = await getEmails();
  // console.log(emails);

  return emails;
}

async function getEmailWithAuthExisting(gmail, emailId, responseFormat) {
  const res = await gmail.users.messages.get({
    userId: "me",
    id: emailId,
    format: responseFormat,
    metadataHeaders: [
      "From",
      "Subject",
      "To",
      "Date",
      "Content-Transfer-Encoding",
    ],
  });
  // console.log(res);
  const { id, payload, snippet, raw, labelIds } = res.data;
  // console.log(payload);
  // let buff = new Buffer(payload.parts[0].body.data, "base64");
  // let text = buff.toString("ascii");
  // console.log(text);
  // console.log(res.data);
  return { id, payload, snippet, raw, labelIds };
}

async function getGoogleEvents(token, date, endDate) {
  auth.setCredentials({ refresh_token: token });
  const calendar = getGoogleCalendarApi(auth);
  return await calendar.events.list({
    calendarId: "primary",
    timeMax: endDate,
    timeMin: date,
    maxResults: 10,
    singleEvents: true,
    orderBy: "startTime",
  });
}

async function saveGoogleEvent(
  token,
  { title, description, inviteList, eventDate, startTime, endTime, id }
) {
  auth.setCredentials({ refresh_token: token });
  const calendar = getGoogleCalendarApi(auth);
  const startDate = new Date(eventDate + " " + startTime);
  const endDate = new Date(eventDate + " " + endTime);
  var event = {
    summary: title,
    description: description,
    start: {
      dateTime: startDate,
    },
    end: {
      dateTime: endDate,
    },

    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 10 },
      ],
    },
  };
  if (inviteList.length > 0 && inviteList[0].email) {
    console.log(inviteList.length);
    event.attendees = inviteList;
  }

  if (id) {
    console.log("updated!");
    return await calendar.events.patch({
      calendarId: "primary",
      eventId: id,
      resource: event,
    });
  }
  console.log("inserted!");
  return await calendar.events.insert({
    auth: auth,
    calendarId: "primary",
    resource: event,
  });
}

async function deleteGoogleEvent(token, id) {
  auth.setCredentials({ refresh_token: token });
  const calendar = getGoogleCalendarApi(auth);

  return await calendar.events.delete({
    calendarId: "primary",
    eventId: id,
  });
}

async function getGooglePeople(token) {
  auth.setCredentials({ refresh_token: token });
  const people = getGoogleContactsApi(auth);

  const users = await people.otherContacts.list({
    readMask: "metadata,names,emailAddresses",
  });

  return users;
}

async function changeStarEmail(token, emailId, isStarred) {
  auth.setCredentials({ refresh_token: token });
  const gmail = getGmailApi(auth);
  let result = [];

  if (isStarred) {
    result = await gmail.users.messages.modify({
      userId: "me",
      id: emailId,
      addLabelIds: ["STARRED"],
    });
  } else {
    result = await gmail.users.messages.modify({
      userId: "me",
      id: emailId,
      removeLabelIds: ["STARRED"],
    });
  }

  const messageStarred = await getEmailWithAuthExisting(
    gmail,
    result.data.id,
    "full"
  );
  return messageStarred;
}

async function trashEmail(token, emailId) {
  auth.setCredentials({ refresh_token: token });
  const gmail = getGmailApi(auth);
  const result = await gmail.users.messages.trash({
    userId: "me",
    id: emailId,
  });

  const messageTrashed = await getEmailWithAuthExisting(
    gmail,
    result.data.id,
    "full"
  );
  return messageTrashed;
}

async function trashAllEmail(token, query) {
  auth.setCredentials({ refresh_token: token });
  const gmail = getGmailApi(auth);

  const res = await gmail.users.messages.list({
    userId: "me",
    q: query,
  });
  const messages = res.data.messages;

  if (messages) {
    messages.forEach((message) => {
      if (message) {
        gmail.users.messages.trash({
          userId: "me",
          id: message.id,
        });
      }
    });
  }

  return true;
}

export default {
  sendGmail,
  getGoogleAccountFromCode,
  getEmails,
  getGoogleEvents,
  saveGoogleEvent,
  deleteGoogleEvent,
  getGooglePeople,
  getUserByEmail,
  changeStarEmail,
  trashEmail,
  trashAllEmail,
};
