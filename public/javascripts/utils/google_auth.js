/**  On load, called to load the auth2 library and API client library. */
export function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

/** Initializes the API client library and sets up sign-in state listeners. */
function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(
      function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      },
      function (error) {
        alert(JSON.stringify(error, null, 2));
      }
    );
}

/** Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called. */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    signoutButton.style.display = "block";
    // listUpcomingEvents();
  } else {
    authorizeButton.style.display = "block";
    signoutButton.style.display = "none";
  }
}

/** Sign in the user upon button click. */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/** Sign out the user upon button click. */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

// var CLIENT_ID ="317061049210-tj4ff55n406to2vnvg7e0pl2g4flojot.apps.googleusercontent.com";
// var API_KEY = "AIzaSyCMGZFfdY6FtQVw_jFl2q8thk9E9uIK6yI";
var CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
var API_KEY = process.env.GOOGLE_API_KEY;
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",];
var SCOPES = "https://www.googleapis.com/auth/calendar";

var authorizeButton = document.getElementById("authorize_button");
var signoutButton = document.getElementById("signout_button");