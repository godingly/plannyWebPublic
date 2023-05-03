var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');
// var wwwhisper = require('connect-wwwhisper');
var compression = require('compression');
var helmet = require('helmet');


const { expressCspHeader, INLINE, NONE, SELF, EVAL } = require('express-csp-header');

module.exports = function (app) {
  app.use(expressCspHeader({
    directives: {
      'default-src': [SELF,
         '*.rackcdn.com/wwwhisper/',
         'https://cdnjs.cloudflare.com/',
         'https://ka-f.fontawesome.com/',
         'https://apis.google.com/',
         'https://accounts.google.com/',
         'https://content.googleapis.com/',
         'http://localhost:35729/',
         'ws://localhost:35729/', INLINE, EVAL],
    }
  }));

  // app.use(helmet());
  app.use(compression()); //Compress all routes
  // app.use(wwwhisper());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};
