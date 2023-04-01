const express = require(`express`);

const exmControllers = require(`../controllers/exm`);
const auth = require(`../middlewares/auth/auth`);
const isAdmin = require(`../middlewares/auth/is-admin`);
const router = express.Router();

// Get all unis
router.get(`/`, auth, exmControllers.getAllExm);

// Get single uni
router.get(`/:id`, auth, exmControllers.getExm);

// Add new uni
router.post(`/new`, auth, isAdmin, exmControllers.newExm);

// Update uni
router.put(`/update/:id`, auth, isAdmin, exmControllers.updateExm);

// Update uni
router.delete(`/delete/:id`, auth, isAdmin, exmControllers.deleteExm);

module.exports = router;
