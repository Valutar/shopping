const router = require('express').Router();
const Tweet = require('../models/Tweet');
const User = require('../models/User');

router.get('/', (req, res, next) => {
  const userId = req.session.user._id;
  Tweet.find()
    .populate('author')
    .sort({ updatedAt: 'desc' })
    .then(tweets => {
      res.render('explore/explore', {
        tweets,
        title: 'Explore tweets',
        currentUser: userId,
      });
    })
    .catch(err => next(err));
});

router.get('/retweet/:id', (req, res, next) => {
  const id = req.params.id;
  const userId = req.session.user._id;
  User.findByIdAndUpdate(userId, { $push: { tweets: id } }).then(() => {
    res.redirect('/profile');
  });
});

module.exports = router;
