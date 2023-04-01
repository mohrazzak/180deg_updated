const Nws = require(`../models/Nws`);
const errorHandler = require(`../helpers/errorHandler`);
const fileDeleter = require(`../helpers/fileDeleter`);

const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileStream, delFile } = require("../aws/s3");

// Get all admissions
exports.getAllNws = async (req, res, next) => {
  try {
    const [nws, _] = await Nws.findAll();
    res.json({ nws, message: "تم الحصول على الاخبار بنجاح" });
  } catch (err) {
    errorHandler(next, err, `حدث خطأ عند الحصول على الاخبار بنجاح`);
  }
};

// Get admission
exports.getNws = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [nws, _] = await Nws.findById(id);
    if (!nws || nws.length == 0)
      errorHandler(next, null, "حدث خطأ الاخبار غير موجودة", 400);
    res.json({ nws });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند الحصول على الاخبار");
  }
};

// Create admission
exports.newNws = async (req, res, next) => {
  try {
    const { title, news_type, news_desc, uni_id } = req.body;
    if (!req.file)
      errorHandler(next, null, "حدث خطأ عند رفع صورة الجامعة", 400);

    const file = req.file;
    const result = await uploadFile(file, "/nws");
    await unlinkFile(file.path);
    const image_url = "images/" + result.Key;
    const uniData = {
      title,
      news_type,
      news_desc,
      image_url,
      uni_id,
    };

    const nws = new Nws(uniData);
    await nws.save();
    res.json({ message: "تم انشاء الاخبار بنجاح" });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند انشاء الاخبار");
  }
};

exports.getNwsName = async (req, res, next) => {
  try {
    const [maj, _] = await Nws.findAllMain();
    res.json({ maj });
  } catch {
    errorHandler(next, err, "حدث خطأ عند الحصول على اسم التخصص");
  }
};

// Update admission
exports.updateNws = async (req, res, next) => {
  try {
    const { title, news_type, news_desc, uni_id } = req.body;
    const id = req.params.id;
    let image_url;
    const oldNws = await Nws.findById(id);
    if (!req.file) image_url = oldNws[0][0].image_url;
    else {
      // image_url = req.file.path.replace("\\", "/").replace("\\", "/");
      // fileDeleter(oldNws[0][0].image_url);
      const file = req.file;
      let a = oldNws[0][0].image_url.split("/");
      await delFile(a[1] + "/" + a[2]);
      const result = await uploadFile(file, "/nws");
      image_url = "images/" + result.Key;
      await unlinkFile(file.path);
    }

    const uniData = [title, news_type, news_desc, image_url, uni_id, id];

    await Nws.update(uniData);
    res.json({ message: "تم تعديل الاخبار بنجاح" });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند تعديل الاخبار");
  }
};

// Delete admission
exports.deleteNws = async (req, res, next) => {
  try {
    const id = req.params.id;
    const oldNws = await Nws.findById(id);
    let a = oldNws[0][0].image_url.split("/");
    await delFile(a[1] + "/" + a[2]);
    await Nws.delete(id);
    res.json({ message: "تم حذف الاخبار بنجاح " });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند حذف الاخبار");
  }
};
