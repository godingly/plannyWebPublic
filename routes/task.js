const express = require('express');
const router = express.Router();

var task_controller = require('../controllers/taskController');

// TASK routes
router.get('/', task_controller.task_list);

router.get('/create', task_controller.task_create_get);

router.post('/create', task_controller.task_create_post);

module.exports = router;
