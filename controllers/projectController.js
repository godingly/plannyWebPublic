var Project = require('../models/project');
var List = require('../models/list');
// var Task = require('../models/task');

var async = require('async');

const { body,validationResult } = require("express-validator");

exports.projects_list = function(req, res, next) {
    Project.find()
    .exec(function (err, projects_list) {
        if (err) {next(err);}
        res.render('project/projects_list', {title:'Project List', projects_list: projects_list});
    });
};

exports.project_detail = function(req, res, next) {
    async.parallel({
        project: function(callback) {
            Project.findById(req.params.id)
            .exec(callback);
        },
        project_lists: function(callback) {
            List.find({'project': req.params.id}, 'name')
            .exec(callback)
        }
    }, function(err, results) {
        if (err) {return next(err);} // Error in API usage.
        if (results.project==null) { // No results
            var err = new Error('project not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('project/project_detail', { title: 'Project Detail', project: results.project, project_lists: results.project_lists} );
    }
    );
}

// Handle project create on POST.
exports.project_create_get = function(req, res, next) {
    res.render('project_form', {title:'Create Project'})
};

// Display project create form on GET.
exports.project_create_post = [
    body('name', 'Project name required').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        const errors  = validationResult(req);
        var project = new Project({name: req.body.name});
        if (!errors.isEmpty()) {
            res.render('project_form', {title:'Create Project', project:project, errors:errors.array()});
            return;
        } else {
            Project.findOne({'name': req.body.name})
             .exec(function (err, found_project) {
                if (err) { return next(err);}
                if (found_project) {res.redirect(found_project.url)}
                else {
                    project.save(function (err) {
                        if (err) { return next(err);}
                        res.redirect(project.url);
                    });
                }
             });
        }
    }
];

// Display project delete form on GET.
exports.project_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: project delete GET');
};

// Handle project delete on POST.
exports.project_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: project delete POST');
};

// Display project update form on GET.
exports.project_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: project update GET');
};

// Handle project update on POST.
exports.project_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: project update POST');
};