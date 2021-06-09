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

router.get('/dashboard', (req, res, next) => {
  console.log(req.session);
  res.render('dashboard');
});

//login routes

router.get('/login', (req, res, next) => {
  res.render('userLoginForm');
});

router.post('/login', (req, res, next) => {
  let { email, password } = req.body;

  console.log(email, password);
  if (!email || !password) {
    res.redirect('/users/login');
  }

  User.findOne({ email }, (err, user) => {
    if (err) return next(err);

    if (!user) {
      res.redirect('/users/login');
    }

    if (user) {
      user.checkPassword(password, (err, result) => {
        if (err) return next(err);

        if (!result) {
          return res.redirect('/users/login');
        } else {
          req.session.userId = user.id;
          res.redirect('/users/dashboard');
        }
      });
    }
  });
});

module.exports = router;
