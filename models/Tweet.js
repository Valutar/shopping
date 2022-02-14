const { Schema, model } = require('mongoose');

const tweetSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
  },
  { timestamps: true }
);

const Tweet = model('Tweet', tweetSchema);

module.exports = Tweet;
