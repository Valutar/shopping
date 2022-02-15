const router = require('express').Router();

//middleware
function loginCheck() {
  return (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  };
}

router.get('/profile', loginCheck(), (req, res, next) => {
  const user = req.session.user;
  res.render('profile', { user: user });
});

module.exports = router;
