var express = require('express');
var User = require('../models/User');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', (req, res, next) => {
  res.render('userRegisterForm');
});

router.post('/register', (req, res, next) => {
  let data = req.body;
  User.create(data, (err, user) => {
    if (err) return next(err);
    res.json(user);
  });
});
module.exports = router;
