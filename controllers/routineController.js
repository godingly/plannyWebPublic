var RoutineTask = require('../models/routineTask');

const { body,validationResult } = require("express-validator");
var async = require('async');

exports.get_routine_home = function (req, res, next) {
    const routineName = req.params.routineName.toLowerCase();
    res.render('routine', { routineName, title:routineName });
}

exports.get_routine_tasks = function (req, res, next) {
    const routineName = req.params.routineName.toLowerCase();
    RoutineTask.find({ routine: routineName })
        .exec((err, routine_task_list) => {
            if (err) { console.log(`get_routine_tasks(), err= ${err}`); return next(err); }
            res.json(routine_task_list);
        }
        );
}

exports.post_routine_task = [
    body('name', 'Task name required').trim().isLength({ min: 1 }).escape(),
    body('duration', 'duration required, integer >=1').trim().isInt({ min: 1 }).escape(),
    body('routine', 'routine required').trim().isLength({ min: 1 }).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const task = new RoutineTask({ name: req.body.name, duration: req.body.duration, routine: req.body.routine, order:req.body.order});
        if (!errors.isEmpty()) {
            console.log(`add error 1, ${errors.array()}`);
            res.send({ errors: errors.array() });
            return;
        } else {
            task.save(function (err) {
                if (err) {
                    console.log(`add error 2 ${err}`);
                    return next(err);  
                } // else, success
                res.json({id:task._id});
            });
        }
    }
];

exports.put_routine_task = [
    body('name', 'Task name required').trim().isLength({ min: 1 }).escape(),
    body('duration', 'duration required, integer >=1').trim().isInt({ min: 1 }).escape(),
    body('routine', 'routine required').trim().isLength({ min: 1 }).escape(),
    body('order', 'order required').trim().isInt({ min: 0 }).escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const task = new RoutineTask({ name: req.body.name, duration: req.body.duration,
             routine: req.body.routine, order:req.body.order, _id: req.params.id });
        // console.log(`put_routine_task() task=${task}`);
        if (!errors.isEmpty()) {
            console.log(`put_routine_task() error 1, ${errors.array()}`);
            res.send({ errors: errors.array() });
            return;
        } 
        RoutineTask.findByIdAndUpdate(req.params.id, task, {}, (err, new_task) => {
            if (err) { console.log(`put_routine_task() error 2, err=${err}`); return next(err); }
            // else, Success 
            res.json({id:new_task._id});
        });
    }
];

exports.delete_routine_task = function (req, res, next) {
  RoutineTask.findByIdAndRemove(req.params.id, (err, deleted_task) => {
    if (err) {return next(err);}
    // else
    let order_deleted = deleted_task.order;
    let routineName = deleted_task.routine;
    RoutineTask.updateMany(
        {order: {$gt:order_deleted}, routine: routineName},
        {$inc: {order:-1}},
        function (err) {
            if (err){return next(err);}
            else{
                res.json({isDeleted:true})
            }
        }
    );
  });
};

function reorder_others(oldIndex, newIndex, routineName, callback) {
  console.log(`reorder_others(), ${routineName}, ${oldIndex}, ${newIndex}`);
  if (oldIndex < newIndex) {
    console.log(`reorder_others(),first method`);
    RoutineTask.updateMany(
      { order: { $gt: oldIndex, $lte: newIndex }, routine: routineName },
      { $inc: { order: -1 } },
      function (err) {
        if (err) {
          console.log(`reorder_things() err1, err=${err}`);
          return callback(err, null);
        } else {
            console.log('reoder_things(), success1');
            return callback(null, "success_others1");
        }
      }
    );
  } else {
    console.log(`reorder_others(),second method`);
    RoutineTask.updateMany(
      { order: { $gte: newIndex, $lt: oldIndex }, routine: routineName },
      { $inc: { order: 1 } },
      function (err) {
        if (err) {
          console.log(`reorder_others() err2, err=${err}`);
          return callback(err, null);
        } else {
            console.log('reorder_others(), success2');
            return callback(null, "success_others2");
        }
      }
    );
  }
}

exports.reorder_tasks = function (req, res, next) {
    const routineName = req.params.routineName;
    const oldIndex = Number(req.body.oldIndex);
    const newIndex = Number(req.body.newIndex);
    const taskId = req.body.id;
    console.log(`reorder(), ${routineName}, ${oldIndex}, ${newIndex}, ${taskId}`);
    async.series([
        (callback) => {reorder_others(oldIndex, newIndex, routineName, callback)},
        (callback) => {
            console.log(`reorder_this()`);
            RoutineTask.findByIdAndUpdate(
                taskId,
                {$set: {order: newIndex}},
                (err) => {
                    if (err) {
                        console.log(`reorder_this() error=${err}`);
                        return callback(err, null);
                    } else {
                        console.log(`reorder_this() success`);
                        return callback(null, 'success_this')
                    }
                }
                );
            }
    ],(err, results) => {
        if (err) {return next(err);}
        else {
            console.log(`reorder_final(), results=${results}`);
            res.json({success:true})
        }
    });
}