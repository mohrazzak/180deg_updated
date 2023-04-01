const express = require(`express`);

const admissionControllers = require(`../controllers/adm`);

const router = express.Router();

// Get all unis
router.get(`/`, admissionControllers.getAllAdm);

router.get(`/name`, admissionControllers.getAdmName);
// Get single uni
router.get(`/:id`, admissionControllers.getAdm);
// Add new uni
router.post(`/new`, admissionControllers.newAdm);

// Update uni
router.put(`/update/:id`, admissionControllers.updateAdm);

// Update uni
router.delete(`/delete/:id`, admissionControllers.deleteAdm);

module.exports = router;
