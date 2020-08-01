const express = require('express');

const router = express.Router();

module.exports = (params) => {
  const { speakersServices } = params;

  router.get('/', async (req, res) => {
    const speakers = await speakersServices.getList();
    const artwork = await speakersServices.getAllArtwork();
    // console.log(artwork);
    res.render('layout', { pageTitle: 'Speakers', template: 'speakers', speakers, artwork });
  });

  router.get('/:shortname', async (req, res) => {
    const speaker = await speakersServices.getSpeaker(req.params.shortname);
    const artwork = await speakersServices.getArtworkForSpeaker(req.params.shortname);

    res.render('layout', { pageTitle: 'Speaker', template: 'speaker-detail', speaker, artwork });
  });

  return router;
};
