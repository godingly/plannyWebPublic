import * as g_auth from "./utils/google_auth.js";

var PRIMARY = 'primary'
var PLANNY_CMD = 'planny_cmd'

function appendPre(message) {
  var pre = document.getElementById("content");
  var textContent = document.createTextNode(message + "\n");
  pre.appendChild(textContent);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
async function getUpcomingEvents() {
  var response = await gapi.client.calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(),
    showDeleted: false,
    singleEvents: true,
    maxResults: 10,
    orderBy: "startTime",
  });
  var events = response.result.items;
  appendPre("Upcoming events:");
  var events_array = []
  if (events.length > 0) {
    for (let i = 0; i < events.length; i++) {
      var event = events[i];
      var when = event.start.dateTime;
      if (!when) {
        when = event.start.date;
      }
      events_array.push(`${event.summary} (${when})`);
    }
    return events_array;
  } else {
    return;
  }
}

async 

async function listUpcomingEvents() {
  var events = await getUpcomingEvents();
  if (events) {
    events.forEach((event) => {
      console.log(event);
      appendPre(event);
    })
  } else {
    appendPre("No upcoming events")
  }
}



var eventsButton = document.getElementById("get_events_button");
eventsButton.addEventListener("click", listUpcomingEvents);

$(document).ready(g_auth.handleClientLoad);
