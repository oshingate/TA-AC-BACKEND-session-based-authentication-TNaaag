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
  let err = req.flash('error')[0];
  console.log(req.session);
  res.render('userLoginForm', { err });
});
router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.clearCookie('connection.sid');
  res.redirect('/users/login');
});

router.post('/login', (req, res, next) => {
  let { email, password } = req.body;

  console.log(email, password);
  if (!email || !password) {
    req.flash('error', 'Email/password required');
    return res.redirect('/users/login');
  }

  User.findOne({ email }, (err, user) => {
    if (err) return next(err);

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/users/login');
    }

    if (user) {
      user.checkPassword(password, (err, result) => {
        if (err) return next(err);

        if (!result) {
          req.flash('error', 'Invalid password');
          return res.redirect('/users/login');
        } else {
          req.session.userId = user.id;
          return res.redirect('/users/dashboard');
        }
      });
    }
  });
});

module.exports = router;
