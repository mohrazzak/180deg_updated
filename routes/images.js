const express = require(`express`);
const router = express.Router();

// AWS

const multer = require("multer");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileStream } = require("../aws/s3");

// Get all unis
router.get("/uni/:key", (req, res) => {

  const key = "uni/" + req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

router.get("/sch/:key", (req, res) => {

  const key = "sch/" + req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});
router.get("/nws/:key", (req, res) => {

  const key = "nws/" + req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

router.get("/maj/:key", (req, res) => {

  const key = "maj/" + req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

module.exports = router;
