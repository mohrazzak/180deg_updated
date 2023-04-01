const Frm = require(`../models/Frm`);
const errorHandler = require(`../helpers/errorHandler`);

// Get all admissions
exports.getAllFrm = async (req, res, next) => {
  try {
    const [frm, _] = await Frm.findAll();
    res.json({ frm, message: "تم الحصول على المقالات بنجاح" });
  } catch (err) {
    errorHandler(next, err, `حدث خطأ عند الحصول على المقالات بنجاح`);
  }
};

// Get admission
exports.getFrm = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [frm, _] = await Frm.findById(id);
    if (!frm || frm.length == 0)
      errorHandler(next, null, "حدث خطأ المقالات غير موجودة", 400);
    res.json({ frm });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند الحصول على المقالات");
  }
};

// Create admission
exports.newFrm = async (req, res, next) => {
  try {
    const { title, forum_desc } = req.body;
    const uniData = {
      title,
      forum_desc,
    };

    const frm = new Frm(uniData);
    await frm.save();
    res.json({ message: "تم انشاء المقالات بنجاح" });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند انشاء المقالات");
  }
};

// Update admission
exports.updateFrm = async (req, res, next) => {
  try {
    const { title, forum_desc } = req.body;
    const id = req.params.id;
    const uniData = [title, forum_desc, id];
    await Frm.update(uniData);
    res.json({ message: "تم تعديل المقالات بنجاح" });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند تعديل المقالات");
  }
};

// Delete admission
exports.deleteFrm = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Frm.delete(id);
    res.json({ message: "تم حذف المقالات بنجاح " });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند حذف المقالات");
  }
};
