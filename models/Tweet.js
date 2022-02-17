const { Schema, model } = require('mongoose');

const tweetSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 280,
    },
    author: { type: Schema.Types.ObjectId, ref: 'author', required: true },
  },
  { timestamps: true }
);

const Tweet = model('Tweet', tweetSchema);

module.exports = Tweet;
