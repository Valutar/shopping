const { Schema, model } = require('mongoose');

const Tweet = mongoose.model(
  'Tweet',
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
