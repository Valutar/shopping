const { post } = require(".");
const bcrypt = require('bcryptjs')
const User = require('../models/User.js')

const router = require("express").Router();

router.get('/signup', (req, res, next) => {
  res.render('signup', {
      title: 'Sign Up'
  });
});

router.get('/login', (req, res, next) => {
    res.render('login', {
        title: 'Log In'
    });
});



router.post('/signup', (req, res, next) => {
    const { username, password } = req.body
    if(password.length < 6){
        res.render('signup', {message: 'Your password should be min 6 character long'})
        return
    }
    if (username.length === 0){
        res.render('signup', {message: 'Your username is not valid'})
        return
    }
    User.findOne({username: username})
    .then(userFromDB => {
        if (userFromDB !== null) {
            res.render('signup', {message: 'Username is already taken'})
        } 
        else {
            const salt = bcrypt.genSaltSync()
            const hash = bcrypt.hashSync(password, salt)
            User.create({ username, password: hash })
            .then(createdUser => {
                console.log(createdUser)
                res.redirect('/login')
            })
            .catch(err => next(err))
        }
    })

});

router.post('/login', (req,res,next) => {
    console.log('this body', req.body)
    const {username, password} = req.body
    User.findOne({username: username})
    .then(userFromDB => {
        if (userFromDB === null) {
            res.render('login', {message: 'Invalid'})
            return 
        }
        if(bcrypt.compareSync(password, userFromDB.password)){
            req.session.user = userFromDB
            res.redirect('/profile')
        }
    })
})

router.get('/logout', (req, res, next) => {
    req.session.destroy()
    res.render('index')
})


module.exports = router;