const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  username: {
    type: String,
    minLength: 4,
    maxLength: 13,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    minLength: 7,
    unique: true,
    required: true,
  },
  avatarUrl: String,
  tweets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }],
});

const User = model('User', userSchema);

module.exports = User;
