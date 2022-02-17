const router = require('express').Router();
const Tweet = require('../models/Tweet');
const User = require('../models/User');

router.get('/', (req, res, next) => {
  Tweet.find()
    .populate('author')
    .sort({ updatedAt: 'desc' })
    .then(tweets => {
      res.render('explore/explore', { tweets });
    });
});

module.exports = router;
