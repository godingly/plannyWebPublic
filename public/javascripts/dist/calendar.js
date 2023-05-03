/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/javascripts/calendar.js":
/*!****************************************!*\
  !*** ./public/javascripts/calendar.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _utils_google_auth_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/google_auth.js */ \"./public/javascripts/utils/google_auth.js\");\n\r\n\r\nvar PRIMARY = 'primary'\r\nvar PLANNY_CMD = 'planny_cmd'\r\n\r\nfunction appendPre(message) {\r\n  var pre = document.getElementById(\"content\");\r\n  var textContent = document.createTextNode(message + \"\\n\");\r\n  pre.appendChild(textContent);\r\n}\r\n\r\n/**\r\n * Print the summary and start datetime/date of the next ten events in\r\n * the authorized user's calendar. If no events are found an\r\n * appropriate message is printed.\r\n */\r\nasync function getUpcomingEvents() {\r\n  var response = await gapi.client.calendar.events.list({\r\n    calendarId: \"primary\",\r\n    timeMin: new Date().toISOString(),\r\n    showDeleted: false,\r\n    singleEvents: true,\r\n    maxResults: 10,\r\n    orderBy: \"startTime\",\r\n  });\r\n  var events = response.result.items;\r\n  appendPre(\"Upcoming events:\");\r\n  var events_array = []\r\n  if (events.length > 0) {\r\n    for (let i = 0; i < events.length; i++) {\r\n      var event = events[i];\r\n      var when = event.start.dateTime;\r\n      if (!when) {\r\n        when = event.start.date;\r\n      }\r\n      events_array.push(`${event.summary} (${when})`);\r\n    }\r\n    return events_array;\r\n  } else {\r\n    return;\r\n  }\r\n}\r\n\r\nasync \r\n\r\nasync function listUpcomingEvents() {\r\n  var events = await getUpcomingEvents();\r\n  if (events) {\r\n    events.forEach((event) => {\r\n      console.log(event);\r\n      appendPre(event);\r\n    })\r\n  } else {\r\n    appendPre(\"No upcoming events\")\r\n  }\r\n}\r\n\r\n\r\n\r\nvar eventsButton = document.getElementById(\"get_events_button\");\r\neventsButton.addEventListener(\"click\", listUpcomingEvents);\r\n\r\n$(document).ready(_utils_google_auth_js__WEBPACK_IMPORTED_MODULE_0__.handleClientLoad);\r\n\n\n//# sourceURL=webpack://planny/./public/javascripts/calendar.js?");

/***/ }),

/***/ "./public/javascripts/utils/google_auth.js":
/*!*************************************************!*\
  !*** ./public/javascripts/utils/google_auth.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"handleClientLoad\": () => (/* binding */ handleClientLoad)\n/* harmony export */ });\n/**  On load, called to load the auth2 library and API client library. */\r\nfunction handleClientLoad() {\r\n  gapi.load(\"client:auth2\", initClient);\r\n}\r\n\r\n/** Initializes the API client library and sets up sign-in state listeners. */\r\nfunction initClient() {\r\n  gapi.client\r\n    .init({\r\n      apiKey: API_KEY,\r\n      clientId: CLIENT_ID,\r\n      discoveryDocs: DISCOVERY_DOCS,\r\n      scope: SCOPES,\r\n    })\r\n    .then(\r\n      function () {\r\n        // Listen for sign-in state changes.\r\n        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);\r\n\r\n        // Handle the initial sign-in state.\r\n        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());\r\n        authorizeButton.onclick = handleAuthClick;\r\n        signoutButton.onclick = handleSignoutClick;\r\n      },\r\n      function (error) {\r\n        alert(JSON.stringify(error, null, 2));\r\n      }\r\n    );\r\n}\r\n\r\n/** Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called. */\r\nfunction updateSigninStatus(isSignedIn) {\r\n  if (isSignedIn) {\r\n    authorizeButton.style.display = \"none\";\r\n    signoutButton.style.display = \"block\";\r\n    // listUpcomingEvents();\r\n  } else {\r\n    authorizeButton.style.display = \"block\";\r\n    signoutButton.style.display = \"none\";\r\n  }\r\n}\r\n\r\n/** Sign in the user upon button click. */\r\nfunction handleAuthClick(event) {\r\n  gapi.auth2.getAuthInstance().signIn();\r\n}\r\n\r\n/** Sign out the user upon button click. */\r\nfunction handleSignoutClick(event) {\r\n  gapi.auth2.getAuthInstance().signOut();\r\n}\r\n\r\n// var CLIENT_ID =\"317061049210-tj4ff55n406to2vnvg7e0pl2g4flojot.apps.googleusercontent.com\";\r\n// var API_KEY = \"AIzaSyCMGZFfdY6FtQVw_jFl2q8thk9E9uIK6yI\";\r\nvar CLIENT_ID = \"317061049210-tj4ff55n406to2vnvg7e0pl2g4flojot.apps.googleusercontent.com\";\r\nvar API_KEY = \"AIzaSyCMGZFfdY6FtQVw_jFl2q8thk9E9uIK6yI\";\r\nvar DISCOVERY_DOCS = [\"https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest\",];\r\nvar SCOPES = \"https://www.googleapis.com/auth/calendar\";\r\n\r\nvar authorizeButton = document.getElementById(\"authorize_button\");\r\nvar signoutButton = document.getElementById(\"signout_button\");\n\n//# sourceURL=webpack://planny/./public/javascripts/utils/google_auth.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/javascripts/calendar.js");
/******/ 	
/******/ })()
;