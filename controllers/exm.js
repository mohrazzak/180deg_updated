const Exm = require(`../models/Exm`);
const errorHandler = require(`../helpers/errorHandler`);

// Get all admissions
exports.getAllExm = async (req, res, next) => {
  try {
    const [exm, _] = await Exm.findAll();
    res.json({ exm, message: "تم الحصول على اسئلة الدورات بنجاح" });
  } catch (err) {
    errorHandler(next, err, `حدث خطأ عند الحصول على اسئلة الدورات بنجاح`);
  }
};

// Get admission
exports.getExm = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [exm, _] = await Exm.findById(id);
    if (!exm || exm.length == 0)
      errorHandler(next, null, "حدث خطأ اسئلة الدورات غير موجودة", 400);
    res.json({ exm });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند الحصول على اسئلة الدورات");
  }
};

// Create admission
exports.newExm = async (req, res, next) => {
  try {
    const { url, theYear, uni_id } = req.body;
    const uniData = {
      url,
      theYear,
      uni_id,
    };

    const exm = new Exm(uniData);
    await exm.save();
    res.json({ message: "تم انشاء اسئلة الدورات بنجاح" });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند انشاء اسئلة الدورات");
  }
};

// Update admission
exports.updateExm = async (req, res, next) => {
  try {
    const { url, theYear, uni_id } = req.body;
    const id = req.params.id;
    const uniData = [url, theYear, uni_id, id];
    await Exm.update(uniData);
    res.json({ message: "تم تعديل اسئلة الدورات بنجاح" });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند تعديل اسئلة الدورات");
  }
};

// Delete admission
exports.deleteExm = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Exm.delete(id);
    res.json({ message: "تم حذف اسئلة الدورات بنجاح " });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند حذف اسئلة الدورات");
  }
};
