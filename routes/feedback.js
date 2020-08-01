const express = require('express');
const {
  // check,
  validationResult,
} = require('express-validator');

const router = express.Router();

module.exports = (params) => {
  const { feedbackServices } = params;

  router.get('/', async (req, res, next) => {
    try {
      const feedback = await feedbackServices.getList();
      // check errors and success messages
      const errors = req.session.feedback ? req.session.feedback.errors : false;
      req.session.feedback = {};

      const successMessage = req.session.feedback ? req.session.feedback.message : false;

      return res.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedback,
        errors,
        successMessage,
      });
    } catch (error) {
      return next(error);
    }
  });

  router.post(
    '/',
    [
      // check('name').trim().isLength({ min: 3 }).escape.withMessage('name is required'),
      // check('title').trim().isLength({ min: 3 }).escape.withMessage('title is required'),
      // check('message').trim().isLength({ min: 3 }).escape.withMessage('message is required'),
      // check('email').trim().isEmail().normalizeEmail().withMessage('vaild email is required'),
    ],
    async (req, res) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        req.session.feedback = {
          errors: errors.array(),
        };
        return res.redirect('feedback');
      }
      // console.log(req.body);
      const { name, email, title, message } = req.body;
      await feedbackServices.addEntry(name, email, title, message);
      req.session.feedback = {
        message: 'thanks for your feedback',
      };

      return res.redirect('feedback');
    }
  );

  router.post('/api', async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty) {
        return res.json({ errors: errors.array() });
      }

      const { name, email, title, message } = req.body;
      await feedbackServices.addEntry(name, email, title, message);
      const feedback = await feedbackServices.getList();
      return res.json({ feedback });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
