var express = require('express');
var User = require('../models/User');
var Blog = require('../models/Blog');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('blogsHome');
});

//list of blog

router.get('/list', (req, res, next) => {
  Blog.find({})
    .populate('author')
    .exec((err, blogs) => {
      if (err) return next(err);

      res.render('blogList', { blogs });
    });
});

//create new blog

router.get('/new', (req, res, next) => {
  if (req.session.userId) {
    res.render('blogCreateForm');
  } else {
    req.flash('error', 'You must login to create new blog');
    res.redirect('/users/login');
  }
});

router.post('/new', (req, res, next) => {
  req.body.author = req.session.userId;

  Blog.create(req.body, (err, blog) => {
    if (err) return next(err);

    res.redirect('/blogs/list');
  });
});

//get blog details

router.get('/:slug', (req, res, next) => {
  if (!req.session.userId) {
    req.flash('error', 'You must login to see blog details');
    return res.redirect('/users/login');
  }
  let givenSlug = req.params.slug;

  Blog.findOne({ slug: givenSlug })
    .populate('author')
    .exec((err, blog) => {
      if (err) return next(err);

      res.render('blogDetails', { blog });
    });
});

//like handler

router.get('/:slug/likes/:method', (req, res, next) => {
  if (!req.session.userId) {
    req.flash('error', 'You must login to see blog details');
    return res.redirect('/users/login');
  }
  let givenSlug = req.params.slug;
  let givenMethod = req.params.method;

  if (givenMethod === 'inc') {
    Blog.findOneAndUpdate(
      { slug: givenSlug },
      { $inc: { likes: 1 } },
      (err, updated) => {
        if (err) return next(err);

        return res.redirect('/blogs/' + updated.slug);
      }
    );
  }
  if (givenMethod === 'dec') {
    Blog.findOneAndUpdate(
      { slug: givenSlug },
      { $inc: { likes: -1 } },
      (err, updated) => {
        if (err) return next(err);

        return res.redirect('/blogs/' + updated.slug);
      }
    );
  }
});

module.exports = router;
