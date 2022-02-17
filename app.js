// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv').config();

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// HBS helper func
// Checks if tweet was edited and returns latest timestamp
hbs.registerHelper('normalDate', function (createdAt, updatedAt) {
  if (updatedAt.getTime() > createdAt.getTime()) {
    return `Edited on: ${updatedAt.getHours()}:${updatedAt.getMinutes()} ${updatedAt.getDate()}/${
      updatedAt.getMonth() + 1
    }/${updatedAt.getFullYear()}`;
  } else {
    return `Posted on: ${createdAt.getHours()}:${createdAt.getMinutes()} ${createdAt.getDate()}/${
      createdAt.getMonth() + 1
    }/${createdAt.getFullYear()}`;
  }
});

// Custom helper; receives two params and checks if equal, shows element if false
hbs.registerHelper('unlessTwoParams', function (a, b, opts) {
  if (a == b) {
    return opts.inverse(this);
  } else {
    return opts.fn(this);
  }
});

// Custom helper; receives two params and checks if equal, shows element if true
hbs.registerHelper('ifTwoParams', function (a, b, opts) {
  if (a == b) {
    return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
});

// default value for title local
const projectName = 'Twitclone';

app.locals.title = `${projectName}`;

const session = require('express-session');
const MongoStore = require('connect-mongo');

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const auth = require('./routes/auth');
app.use('/', auth);

const profile = require('./routes/profile');
app.use('/profile', profile);

const explore = require('./routes/explore');
app.use('/explore', explore);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;
