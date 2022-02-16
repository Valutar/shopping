const router = require('express').Router();

// Middleware
function isLoggedIn() {
  return (req, res, next) => {
    if (req.session.user) {
      res.redirect('/profile');
    } else {
      next();
    }
  };
}

/* GET home page */

router.get('/', isLoggedIn(), (req, res, next) => {
  res.render('index', {
    layout: false,
  });
});

module.exports = router;
