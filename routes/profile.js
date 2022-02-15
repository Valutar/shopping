const router = require('express').Router();
const Tweet = require('../models/Tweet');
const User = require('../models/User');

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

router.get('/', loginCheck(), (req, res, next) => {
  const user = req.session.user;
  res.render('profile', { user: user, title: `${user.username}'s profile` });
});

router.post('/new-tweet', (req, res, next) => {
  const { tweet } = req.body;
  Tweet.create({ content: tweet })
    .then(newTweet => {
      const tweetId = newTweet._id;
      const userId = req.session.user._id;
      User.findByIdAndUpdate(userId, { $push: { tweets: tweetId } }).then(
        editedUser => console.log(editedUser)
      );
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
