const router = require("express").Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index", {
    title: 'Shopping',
  });
});

//middleware
function loginCheck(){
  return (req, res, next) => {
    if(req.session.user){
      next()
    } else {
      res.redirect('/login')
    }
  }
}

const isLoggedIn = () => {
  return (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.redirect('/login');
    }
  };
};

// is loggedOut -> 

router.get("/profile", loginCheck(), (req, res, next) => {
  const user = req.session.user
  res.render("profile",{user: user});
});


router.get('/main',isLoggedIn(),  (req, res, next) => {
  res.render('main')
})

router.get('/private',isLoggedIn(), (req, res, next) => {
  res.render('private')
})



module.exports = router;