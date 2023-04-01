const express = require(`express`);

const userController = require(`../controllers/user`);
const auth = require(`../middlewares/auth/auth`);
const isAdmin = require(`../middlewares/auth/is-admin`);
const router = express.Router();

// Get all unis
router.get(`/emails`, auth, isAdmin, userController.getAllUsers);

module.exports = router;
