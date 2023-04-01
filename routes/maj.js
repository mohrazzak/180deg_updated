const express = require(`express`);
const multer = require(`multer`);
const path = require(`path`);
const majControllers = require(`../controllers/maj`);
const auth = require(`../middlewares/auth/auth`);
const isAdmin = require(`../middlewares/auth/is-admin`);
const router = express.Router();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/maj");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: fileStorage, fileFilter: fileFilter });

// Get all unis
router.get(`/`, auth, majControllers.getAllMaj);

router.get(`/name`, majControllers.getMajName);
// Get single uni
router.get(`/:id`, auth, majControllers.getMaj);


// Add new uni
router.post(
  `/new`,
  auth,
  isAdmin,
  upload.single("image"),
  majControllers.newMaj
);

// Update uni
router.put(
  `/update/:id`,
  auth,
  isAdmin,
  upload.single("image"),
  majControllers.updateMaj
);

// Update uni
router.delete(`/delete/:id`, auth, isAdmin, majControllers.deleteMaj);

// link uni major
router.post(`/link`, auth, isAdmin, majControllers.linkUniMajor);

// unlink uni major
router.delete(`/unlink`, auth, isAdmin, majControllers.unLinkUniMajor);

const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileStream } = require("../aws/s3");
router.get("/images/:key", (req, res) => {

  const key = "maj/" + req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

module.exports = router;
