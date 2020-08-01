const express = require('express');

const speakersRoute = require('./speakers');
const feedbackRoute = require('./feedback');

const router = express.Router();

module.exports = (params) => {
  const { speakersServices } = params;
  router.get('/', async (req, res) => {
    const allSpeakers = await speakersServices.getList();
    const artwork = await speakersServices.getAllArtwork();

    if (!req.session.visitcount) {
      req.session.visitcount = 0;
    }
    req.session.visitcount += 1;
    // console.log(`number of visit is ${req.session.visitcount}`);

    res.render('layout', { pageTitle: 'welcome', template: 'index', allSpeakers, artwork });
  });

  router.use('/speakers', speakersRoute(params));
  router.use('/feedback', feedbackRoute(params));
  return router;
};
