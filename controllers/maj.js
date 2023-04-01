const Maj = require(`../models/Maj`);
const errorHandler = require(`../helpers/errorHandler`);
const fileDeleter = require(`../helpers/fileDeleter`);

const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileStream, delFile } = require("../aws/s3");

// Get all admissions
exports.getAllMaj = async (req, res, next) => {
  try {
    const [maj, _] = await Maj.findAll();
    res.json({ maj, message: "تم الحصول على التخصصات بنجاح " });
  } catch (err) {
    errorHandler(next, err, `حدث خطأ عند الحصول على التخصصات`);
  }
};

// Get admission
exports.getMaj = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [maj, _] = await Maj.findById(id);
    if (!maj || maj.length == 0)
      errorHandler(next, null, "حدث خطأ التخصص غير موجود", 400);
    res.json({ maj });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند الحصول على التخصص");
  }
};

// Create admission
exports.newMaj = async (req, res, next) => {
  try {
    const { major_name, major_desc } = req.body;

    if (!req.file) {
      errorHandler(next, null, "حدث خطأ عند رفع صورة الجامعة", 400);
    }
    // const image_url = req.file.path.replace("\\", "/").replace("\\", "/");
    const file = req.file;
    const result = await uploadFile(file, "/maj");
    await unlinkFile(file.path);
    const image_url = "images/" + result.Key;
    const uniData = {
      major_name,
      major_desc,
      image_url,
    };
    const maj = new Maj(uniData);
    await maj.save();
    res.json({ message: "تم انشاء التخصص  بنجاح" });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند انشاء التخصص");
  }
};

// Update admission
exports.updateMaj = async (req, res, next) => {
  try {
    const { major_name, major_desc } = req.body;
    const id = req.params.id;
    let image_url;
    const oldMaj = await Maj.findbyIdMain(id);
    if (!req.file) image_url = oldMaj[0][0].image_url;
    else {
      const file = req.file;
      let a = oldMaj[0][0].image_url.split("/");
      await delFile(a[1] + "/" + a[2]);
      const result = await uploadFile(file, "/maj");
      image_url = "images/" + result.Key;
      await unlinkFile(file.path);
    }
    const uniData = [major_name, major_desc, image_url, id];
    await Maj.update(uniData);
    res.json({ message: "تم تعديل التخصص بنجاح " });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند تعديل التخصص");
  }
};

// Delete admission
exports.deleteMaj = async (req, res, next) => {
  try {
    const id = req.params.id;
    const oldMaj = await Maj.findbyIdMain(id);
    let a = oldMaj[0][0].image_url.split("/");
    await delFile(a[1] + "/" + a[2]);
    await Maj.delete(id);
    res.json({ message: "تم حذف التخصص بنجاح " });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند حذف التخصص");
  }
};

exports.linkUniMajor = async (req, res, next) => {
  try {
    const { uni_id, maj_id } = req.body;
    await Maj.linkUniMajor(uni_id, maj_id);
    res.json({ message: "تم ربط التخصص بنجاح " });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند ربط التخصص");
  }
};

exports.getMajName = async (req, res, next) => {
  try {
    const [maj, _] = await Maj.findAllMain();
    res.json({ maj });
  } catch {
    errorHandler(next, err, "حدث خطأ عند الحصول على اسم التخصص");
  }
};

exports.unLinkUniMajor = async (req, res, next) => {
  try {
    const { uni_id, maj_id } = req.body;
    await Maj.unLinkUniMajor(uni_id, maj_id);
    res.json({ message: "تم حذف ربط التخصص بنجاح " });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند حذف ربط التخصص");
  }
};
