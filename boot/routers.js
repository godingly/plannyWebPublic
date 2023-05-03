// routers
var indexRouter = require('../routes/index');
var projectRouter = require('../routes/project');
var routineRouter = require('../routes/routine');
// var listRouter = require('../routes/list');
// var taskRouter = require('../routes/task');
var beeRouter = require('../routes/bee');

module.exports = function(app) {
    // routes
    app.use('/', indexRouter);
    app.use('/', projectRouter);
    app.use('/', routineRouter);
    // app.use('/', listRouter);
    // app.use('/', taskRouter);
    app.use('/bee', beeRouter);
    app.get('/calendar', (req, res, next) => {
        res.render('calendar', {title:"calendar"});
    })
};
