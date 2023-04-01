const Sch = require(`../models/Sch`);
const errorHandler = require(`../helpers/errorHandler`);
const fileDeleter = require(`../helpers/fileDeleter`);

// aws
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileStream, delFile } = require("../aws/s3");
// Get all admissions
exports.getAllSch = async (req, res, next) => {
  try {
    const [sch, _] = await Sch.findAll();
    res.json({ sch, message: "تم الحصول على المنح بنجاح" });
  } catch (err) {
    errorHandler(next, err, `حدث خطأ عند الحصول على المنح بنجاح`);
  }
};

// Get admission
exports.getSch = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [sch, _] = await Sch.findById(id);
    if (!sch || sch.length == 0)
      errorHandler(next, null, "حدث خطأ المنح غير موجودة", 400);
    res.json({ sch });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند الحصول على المنح");
  }
};

// Create admission
exports.newSch = async (req, res, next) => {
  try {
    const {
      title,
      ss_desc,
      register_start,
      register_end,
      requirements,
      whoCan,
      features,
    } = req.body;
    if (!req.file) errorHandler(next, null, "حدث خطأ عند رفع صورة المنحة", 400);
    // aws upload
    const file = req.file;
    const result = await uploadFile(file, "/sch");
    await unlinkFile(file.path);
    const image_url = "images/" + result.Key;

    const uniData = {
      title,
      ss_desc,
      register_start,
      register_end,
      requirements,
      whoCan,
      features,
      image_url,
    };

    const sch = new Sch(uniData);
    await sch.save();
    res.json({ message: "تم انشاء المنح بنجاح" });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند انشاء المنح");
  }
};

// Update admission
exports.updateSch = async (req, res, next) => {
  try {
    const {
      title,
      ss_desc,
      register_start,
      register_end,
      requirements,
      whoCan,
      features,
    } = req.body;
    const id = req.params.id;
    let image_url;
    const oldSch = await Sch.findById(id);

    if (!req.file) image_url = oldSch[0][0].image_url;
    else {
      const file = req.file;
      let a = oldSch[0][0].image_url.split("/");
      await delFile(a[1] + "/" + a[2]);
      const result = await uploadFile(file, "/sch");
      image_url = "images/" + result.Key;
      await unlinkFile(file.path);
    }

    const uniData = [
      title,
      ss_desc,
      register_start,
      register_end,
      requirements,
      whoCan,
      features,
      image_url,
      id,
    ];

    await Sch.update(uniData);
    res.json({ message: "تم تعديل المنح بنجاح" });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند تعديل المنح");
  }
};

// Delete admission
exports.deleteSch = async (req, res, next) => {
  try {
    const id = req.params.id;
    const oldSch = await Sch.findById(id);
    let a = oldSch[0][0].image_url.split("/");
    await delFile(a[1] + "/" + a[2]);
    await Sch.delete(id);
    res.json({ message: "تم حذف المنح بنجاح " });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند حذف المنح");
  }
};
