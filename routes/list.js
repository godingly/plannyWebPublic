const express = require('express');
const router = express.Router();

var list_controller = require('../controllers/listController');

// LIST routes
router.get('/', list_controller.list_list);

router.get('/create', list_controller.list_create_get);

router.post('/create', list_controller.list_create_post);

module.exports = router;
