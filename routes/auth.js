const { post } = require('.');
const bcrypt = require('bcryptjs');
const User = require('../models/User.js');

const router = require('express').Router();

router.get('/signup', (req, res, next) => {
  res.render('signup', {
    title: 'Twitter | Sign Up',
  });
});

router.get('/login', (req, res, next) => {
  res.render('login', {
    title: 'Twitter | Log In',
  });
});

router.post('/signup', (req, res, next) => {
  const { username, password, email } = req.body;
  User.findOne({ username: username }).then(userFromDB => {
    if (userFromDB) {
      res.render('signup', { message: 'Username is already taken' });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      User.create({ username, password: hash, email })
        .then(createdUser => {
          console.log(createdUser);
          res.redirect('/login');
        })
        .catch(err => next(err));
    }
  });
});

router.post('/login', (req, res, next) => {
  console.log('this body', req.body);
  const { username, password } = req.body;
  User.findOne({ username: username }).then(userFromDB => {
    if (userFromDB === null) {
      res.render('login', { message: 'Invalid credentials' });
      return;
    }
    if (bcrypt.compareSync(password, userFromDB.password)) {
      req.session.user = userFromDB;
      res.redirect('/profile');
    }
  });
});

router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
