var express = require('express');
var router = express.Router();

var User = require('../models/User');
var Item = require('../models/Item');

/* handle create items request. */
router.get('/item/new', function (req, res, next) {
  console.log(req.session.isAdmin);
  if (req.session.isAdmin === 'true' && req.session.userId) {
    return res.render('itemListingForm');
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

router.post('/item/new', function (req, res, next) {
  console.log(req.session.isAdmin);
  if (req.session.isAdmin === 'true' && req.session.userId) {
    req.body.createdBy = req.session.userId;
    Item.create(req.body, (err, item) => {
      if (err) return next(err);
      res.redirect('/admin/item/list');
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

// list items list for admin

router.get('/item/list', (req, res, next) => {
  if (req.session.isAdmin === 'true' && req.session.userId) {
    Item.find({}, (err, items) => {
      if (err) return next(err);

      res.render('adminItemList', { items });
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//admin item details

router.get('/item/details/:id', (req, res, next) => {
  if (req.session.isAdmin === 'true' && req.session.userId) {
    let itemId = req.params.id;
    Item.findById(itemId, (err, item) => {
      if (err) return next(err);
      res.render('adminItemDetails', { item });
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//admin edit item

router.get('/item/:id/edit', (req, res, next) => {
  if (req.session.isAdmin === 'true' && req.session.userId) {
    let itemId = req.params.id;
    Item.findById(itemId, (err, item) => {
      if (err) return next(err);
      res.render('adminItemEdit', { item });
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

router.post('/item/:id/edit', (req, res, next) => {
  if (req.session.isAdmin === 'true' && req.session.userId) {
    let itemId = req.params.id;
    Item.findByIdAndUpdate(itemId, req.body, (err, item) => {
      if (err) return next(err);
      res.redirect('/admin/item/details/' + itemId);
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

//admin item delete
router.get('/item/:id/delete', (req, res, next) => {
  if (req.session.isAdmin === 'true' && req.session.userId) {
    let itemId = req.params.id;
    Item.findByIdAndDelete(itemId, (err, item) => {
      if (err) return next(err);
      res.redirect('/admin/item/list');
    });
  } else {
    req.flash('error', 'you must login as admin');
    return res.redirect('/home');
  }
});

module.exports = router;
