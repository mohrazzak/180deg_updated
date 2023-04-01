const Uni = require(`../models/Uni`);
const errorHandler = require(`../helpers/errorHandler`);
const fileDeleter = require(`../helpers/fileDeleter`);

// aws
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileStream, delFile } = require("../aws/s3");

// Get all universities
exports.getAllUnis = async (req, res, next) => {
  try {
    const [unis, _] = await Uni.findAll();
    res.json({ unis, message: "تم الحصول على الجامعات بنجاح " });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند الحصول على الجامعات");
  }
};

// Get university
exports.getUni = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [uni, _] = await Uni.findById(id);
    if (!uni || uni.length == 0)
      errorHandler(next, null, "حدث خطأ الجامعة غير موجودة", 400);
    res.json({ uni });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند الحصول على الجامعة");
  }
};

// Get all university information
exports.getUniInfo = async (req, res, next) => {
  try {
    const id = req.params.id;
    const uniInfo = await Uni.findInfoById(id);
    res.json({ uniInfo, message: "تم الحصول على معلومات الجامعات بنجاح " });
  } catch {
    errorHandler(next, err, "حدث خطأ عند الحصول على معلومات الجامعة");
  }
};

// Create new university
exports.newUni = async (req, res, next) => {
  try {
    const {
      uni_name,
      uni_type,
      city,
      uni_desc,
      uni_createdAt,
      uni_order,
      website_url,
      languages,
      pre_video_link,
    } = req.body;

    if (!req.file) {
      errorHandler(next, null, "حدث خطأ عند رفع صورة الجامعة", 400);
    }

    // aws upload
    const file = req.file;
    const result = await uploadFile(file, "/uni");
    await unlinkFile(file.path);
    const logo_url = "images/" + result.Key;

    const uniData = {
      uni_name,
      logo_url,
      uni_type,
      city,
      uni_desc,
      uni_createdAt,
      uni_order,
      website_url,
      languages,
      pre_video_link,
    };
    const uni = new Uni(uniData);
    await uni.save();
    res.json({ message: "تم انشاء الجامعة بنجاح" });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند انشاء الجامعة");
  }
};

// Update University
exports.updateUni = async (req, res, next) => {
  try {
    const {
      uni_name,
      uni_type,
      city,
      uni_desc,
      uni_createdAt,
      uni_order,
      website_url,
      languages,
      pre_video_link,
    } = req.body;
    const id = req.params.id;
    let logo_url;
    const oldUni = await Uni.findById(id);
    if (!req.file) logo_url = oldUni[0][0].logo_url;
    else {
      // logo_url = req.file.path.replace("\\", "/").replace("\\", "/");
      const file = req.file;
      let a = oldUni[0][0].logo_url.split("/");
      await delFile(a[1] + "/" + a[2]);
      const result = await uploadFile(file, "/uni");
      logo_url = "images/" + result.Key;
      await unlinkFile(file.path);
    }
    const uniData = [
      uni_name,
      logo_url,
      uni_type,
      city,
      uni_desc,
      uni_createdAt,
      uni_order,
      website_url,
      JSON.stringify(languages),
      pre_video_link,
      id,
    ];
    await Uni.update(uniData);
    res.json({ message: "تم تعديل الجامعة بنجاح " });
  } catch (err) {
    deleteHelper(req.file.path);
    errorHandler(next, err, "حدث خطأ عند تعديل معلومات الجامعة");
  }
};

// Update University
exports.deleteUni = async (req, res, next) => {
  try {
    const id = req.params.id;
    const oldUni = await Uni.findById(id);
    let a = oldUni[0][0].logo_url.split("/");
    await delFile(a[1] + "/" + a[2]);
    await Uni.delete(id);
    res.json({ message: "تم حذف الجامعة بنجاح " });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند حذف الجامعة");
  }
};
