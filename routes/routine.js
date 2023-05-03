const express = require('express');
const router = express.Router();

var routine_controller = require('../controllers/routineController');


router.get('/routine/:routineName', routine_controller.get_routine_home);
router.get('/routine/:routineName/tasks', routine_controller.get_routine_tasks);
router.post('/routine/:routineName/reorder', routine_controller.reorder_tasks);

router.post('/routine/task/add', routine_controller.post_routine_task);
router.put('/routine/task/:id', routine_controller.put_routine_task)
router.delete('/routine/task/:id', routine_controller.delete_routine_task)
  
module.exports = router;
  