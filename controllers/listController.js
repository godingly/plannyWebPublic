var List = require('../models/list');
var Project = require('../models/project');
var Task = require('../models/task');

var async = require('async');

const { body, validationResult } = require("express-validator");

exports.list_list = function(req, res, next) {
    List.find()
    .exec(function (err, list_list) {
        if (err) {next(err);}
        res.render('list_list', {title:'List List', list_list: list_list});
    });
};

// Display detail page for a specific list.
exports.list_detail = function(req, res, next) {
    res.send('NOT IMPLEMENTED: list detail');
};

// Display list create form on GET.
exports.list_create_get = function(req, res, next) {
    res.send('NOT IMPLEMENTED: list create GET');
};

// Handle list create on POST.
exports.list_create_post = function(req, res, next) {
    res.send('NOT IMPLEMENTED: list create POST');
};
// Display list delete form on GET.
exports.list_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: list delete GET');
};

// Handle list delete on POST.
exports.list_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: list delete POST');
};

// Display list update form on GET.
exports.list_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: list update GET');
};

// Handle list update on POST.
exports.list_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: list update POST');
};