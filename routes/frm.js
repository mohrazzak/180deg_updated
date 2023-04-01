const express = require(`express`);

const FrmControllers = require(`../controllers/frm`);
const auth = require(`../middlewares/auth/auth`);
const isAdmin = require(`../middlewares/auth/is-admin`);
const router = express.Router();

// Get all unis
router.get(`/`, auth, FrmControllers.getAllFrm);

// Get single uni
router.get(`/:id`, auth, FrmControllers.getFrm);

// Add new uni
router.post(`/new`, auth, isAdmin, FrmControllers.newFrm);

// Update uni
router.put(`/update/:id`, auth, isAdmin, FrmControllers.updateFrm);

// Delete uni
router.delete(`/delete/:id`, auth, isAdmin, FrmControllers.deleteFrm);

module.exports = router;
