/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
const CLIENT_ID =
  "654022633429-hgsih4jak72ithfna2jh4ha8mg3bne4l.apps.googleusercontent.com";
const SCOPES =
  "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events";
const DISCOVERY_DOC =
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

let accessToken = null;
let tokenClient = null;

// ✅ Load Google Identity Services and Calendar API
export const initGoogleAPI = () =>
  new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("client", async () => {
        try {
          await window.gapi.client.init({
            discoveryDocs: [DISCOVERY_DOC],
          });
          resolve(true);
        } catch (err) {
          console.error("GAPI Init Error:", err);
          reject(err);
        }
      });
    };
    script.onerror = reject;
    document.body.appendChild(script);

    const gisScript = document.createElement("script");
    gisScript.src = "https://accounts.google.com/gsi/client";
    gisScript.async = true;
    gisScript.defer = true;
    document.body.appendChild(gisScript);
  });

// ✅ Get Access Token with GIS
const getAccessToken = () =>
  new Promise((resolve, reject) => {
    if (!tokenClient) {
      tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          if (tokenResponse.error) {
            reject(tokenResponse);
          } else {
            accessToken = tokenResponse.access_token;
            resolve(accessToken);
          }
        },
      });
    }

    tokenClient.requestAccessToken();
  });

// 🔍 Helper: Get events in the slot
const getEventsInTimeSlot = async (startTimeISO, endTimeISO) => {
  const response = await window.gapi.client.calendar.events.list({
    calendarId: "primary",
    timeMin: startTimeISO,
    timeMax: endTimeISO,
    showDeleted: false,
    singleEvents: true,
    orderBy: "startTime",
  });

  return response.result.items || [];
};

// ✅ FIXED: Delete events with parallel execution using Promise.all
export const deleteEventInTimeSlot = async (startTimeISO, endTimeISO) => {
  try {
    if (!accessToken) {
      await getAccessToken();
    }

    const events = await getEventsInTimeSlot(startTimeISO, endTimeISO);

    const deletions = events
      .filter((event) => event.summary === "Auto Interview Call")
      .map((event) =>
        window.gapi.client.calendar.events
          .delete({
            calendarId: "primary",
            eventId: event.id,
          })
          .then(() => {
            console.log("Event deleted:", event.id);
          })
      );

    await Promise.all(deletions);
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};

// ✅ Create Google Meet Link with max 3 limit
export const createMeetLink = async (startTimeISO, endTimeISO, guestEmail) => {
  try {
    if (!accessToken) {
      await getAccessToken();
    }

    const existingEvents = await getEventsInTimeSlot(startTimeISO, endTimeISO);
    if (existingEvents.length >= 3) {
      console.warn("❌ Slot already has 3 meetings. Choose another time.");
      return null;
    }

    const event = {
      summary: "Auto Interview Call",
      description: "Scheduled via Interview Portal",
      start: {
        dateTime: startTimeISO,
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endTimeISO,
        timeZone: "Asia/Kolkata",
      },
      attendees: [{ email: guestEmail }],
      conferenceData: {
        createRequest: {
          requestId: String(new Date().getTime()),
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    };

    const response = await window.gapi.client.calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: "all",
    });

    return response.result.hangoutLink || null;
  } catch (error) {
    console.error("Error creating Meet link:", error);
    return null;
  }
};
