const express = require(`express`);
const multer = require("multer");
const path = require("path");
const auth = require(`../middlewares/auth/auth`);
const isAdmin = require(`../middlewares/auth/is-admin`);
const NwsControllers = require(`../controllers/nws`);

const router = express.Router();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/nws");
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
router.get(`/`, auth, NwsControllers.getAllNws);

// router.get(`/`,auth,NwsControllers.get)

// Get single uni
router.get(`/:id`, auth, NwsControllers.getNws);

// Add new uni
router.post(
  `/new`,
  auth,
  isAdmin,
  upload.single("image"),
  NwsControllers.newNws
);

// Update uni
router.put(
  `/update/:id`,
  auth,
  isAdmin,
  upload.single("image"),
  NwsControllers.updateNws
);

// Delete uni
router.delete(`/delete/:id`, auth, isAdmin, NwsControllers.deleteNws);

const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileStream } = require("../aws/s3");
router.get("/images/:key", (req, res) => {

  const key = "nws/" + req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

module.exports = router;
