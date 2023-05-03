var express = require('express');
var path = require('path');

require('./boot/db')();

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/test', (req, res) => {
    res.render('test', {title:'test'})
    // res.sendFile(path.join(__dirname, '/test.html'))
})
var morgan = require('morgan');
// logging
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length] :res[set-cookie] :req[cookie]'));
require('./boot/auth')(app);
require('./boot/middleware')(app);
require('./boot/routers')(app);
require('./boot/error')(app);
module.exports = app;
