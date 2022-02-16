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
  User.findById(user._id)
    .populate('tweets')
    .then(retrievedUser => {
      res.render('profile', {
        user: user,
        title: `${user.username}'s profile`,
        tweets: retrievedUser.tweets,
      });
    })
    .catch(err => next(err));
});

// Post new tweet from your profile
router.post('/tweet/new', (req, res, next) => {
  const { tweet } = req.body;
  Tweet.create({ content: tweet })
    .then(newTweet => {
      const tweetId = newTweet._id;
      const userId = req.session.user._id;
      User.findByIdAndUpdate(
        userId,
        { $push: { tweets: tweetId } },
        { new: true }
      ).then(updatedUser => {
        console.log(updatedUser.tweets);
        res.redirect('/profile');
      });
    })
    .catch(err => next(err));
});

// Delete one of your tweets on your profile
router.get('/tweet/del/:id', async (req, res, next) => {
  const id = req.params.id;
  const userId = req.session.user._id;
  try {
    await Tweet.findByIdAndDelete(id);
    await User.findByIdAndUpdate(userId, { $pull: { tweets: id } });
    res.redirect('/profile');
  } catch (err) {
    next(err);
  }
});

router.get('/tweet/edit/:id', (req, res, next) => {
  const id = req.params.id;
  Tweet.findById(id).then(retrievedTweet => {
    const { content } = retrievedTweet;
    res.render('tweet-edit', { content, tweetId: id });
  });
});

router.post('/tweet/edit/:id', (req, res, next) => {
  const id = req.params.id;
  const { tweet } = req.body;
  Tweet.findByIdAndUpdate(id, { content: tweet }).then(() => {
    res.redirect('/profile');
  });
});

module.exports = router;
