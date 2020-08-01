const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const bodyParser = require('body-parser');

const routes = require('./routes');

const FeedbackServices = require('./services/FeedbackService');
const SpeakersServices = require('./services/SpeakerService');

const feedbackServices = new FeedbackServices('./data/feedback.json');
const speakersServices = new SpeakersServices('./data/speakers.json');
// node can't recognize __dirname directly
// const __dirname = path.resolve(path.dirname(''));

const app = express();
const PORT = 4000;

app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'session',
    keys: ['Abcd!1234', 'aahhoo'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'RRR Meetups';

app.use(express.static(path.join(__dirname, './static')));

app.use(async (req, res, next) => {
  try {
    const names = await speakersServices.getNames();
    res.locals.speakerNames = names;
    next();
  } catch (error) {
    next();
  }
});

app.use(
  '/',
  routes({
    feedbackServices,
    speakersServices,
  })
);

app.use((req, res, next) => {
  next(createError(404, 'page not tt found'));
});

//  render error.ejs
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  // console.error(err);
  const status = err.status || 500;
  res.locals.status = status;
  res.status(status);
  res.render('error');
  next();
});

app.listen(PORT, () => {
  // console.log(`express server is listening ${PORT}`);
});
