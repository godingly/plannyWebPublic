var Task = require('../models/task');
var Project = require('../models/project');
var List = require('../models/list');

var async = require('async');

const { body, validationResult } = require("express-validator");

// Display detail page for a specific task.
exports.task_list = function(req, res, next) {
    Task.find()
    .exec(function (err, list_list) {
        if (err) {next(err);}
        res.render('task_list', {title:'Tasks List', task_list: task_list});
    });
};

// Display detail page for a specific task.
exports.task_detail = function(req, res, next) {
    res.send('NOT IMPLEMENTED: task detail');
};

// Display task create form on GET.
exports.task_create_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: task create GET');
};

// Handle task create on POST.
exports.task_create_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: task create POST');
};
// Display task delete form on GET.
exports.task_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: task delete GET');
};

// Handle task delete on POST.
exports.task_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: task delete POST');
};

// Display task update form on GET.
exports.task_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: task update GET');
};

// Handle task update on POST.
exports.task_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: task update POST');
};