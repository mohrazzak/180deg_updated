const express = require(`express`);
const { body } = require(`express-validator`);
const authControllers = require(`../controllers/auth`);
const router = express.Router();

router.post(`/login`, authControllers.userLogin);

router.put(`/user/update/:id`, authControllers.userReset);

router.get(`/confirmation/:token`, authControllers.confirmation);

router.post(
  `/signup`,
  [
    body('u_email', 'Please provide a valid email.')
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: false }),
    body(
      'u_password',
      'Please provide a valid password at least 5 charecters and maximium 16.'
    ).isLength({
      min: 5,
      max: 16,
    }),
    body('u_name', 'Please provide a valid name').isLength({ min: 3, max: 32 }),
  ],
  authControllers.UserSignup
);

router.post(`/reset`, authControllers.userReset);

router.post(`/reset/:token`, authControllers.resetHandler);

module.exports = router;
