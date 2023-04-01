const express = require(`express`);

const yosControllers = require(`../controllers/yos`);
const auth = require(`../middlewares/auth/auth`);
const isAdmin = require(`../middlewares/auth/is-admin`);
const router = express.Router();

// Get all unis
router.get(`/`, auth, yosControllers.getAllYos);

router.get(`/name`, yosControllers.getYosName);
// Get single uni
router.get(`/:id`, auth, yosControllers.getYos);


// Add new uni
router.post(`/new`, auth, isAdmin, yosControllers.newYos);

// Update uni
router.put(`/update/:id`, auth, isAdmin, yosControllers.updateYos);

// Delete uni
router.delete(`/delete/:id`, auth, isAdmin, yosControllers.deleteYos);

module.exports = router;
