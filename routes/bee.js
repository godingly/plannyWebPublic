var express = require('express');
var router = express.Router();

const fs = require('fs');
const path =  require('path');

const Beeminder = require('../services/beeminder.js');
const bee = new Beeminder();

router.post('/:slug/datapoint', function(req, res, next) {
    const slug = req.params.slug;
    const value = req.body.value;
    console.log(`bee POST, ${slug}, ${value}`);
    bee.add_datapoint(slug, value);
    res.send('success');
});

router.post('/charge', function(req, res, next) {
    const amount = req.body.amount;
    const comment = req.body.comment;
    const log = `${new Date().toLocaleString()}: ${amount}$ : ${comment}`
    // if (process.env.NODE_ENV == 'production')
    //     bee.charge(amount, comment);
    res.send(`router.post bee charge success ${log}`);
});

module.exports = router;