const Yos = require(`../models/Yos`);
const errorHandler = require(`../helpers/errorHandler`);

// Get all admissions
exports.getAllYos = async (req, res, next) => {
  try {
    const [yos, _] = await Yos.findAll();
    res.json({ yos, message: "تم الحصول على امتحانات اليوس بنجاح " });
  } catch (err) {
    errorHandler(next, err, `حدث خطأ عند الحصول على امتحانات اليوس`);
  }
};

// Get admission
exports.getYos = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [yos, _] = await Yos.findById(id);
    if (!yos || yos.length == 0)
      errorHandler(next, null, "حدث خطأ الامتحان غير موجودة", 400);
    res.json({ yos });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند الحصول على الامتحان");
  }
};

// Create admission
exports.newYos = async (req, res, next) => {
  try {
    const {
      exam_date,
      degree_expiry,
      exam_cost,
      currency,
      register_start,
      register_end,
      result_date,
      exam_centers,
      register_url,
      num,
      uni_id,
    } = req.body;
    const uniData = {
      exam_date,
      degree_expiry,
      exam_cost,
      currency,
      register_start,
      register_end,
      result_date,
      exam_centers,
      register_url,
      num,
      uni_id,
    };

    const yos = new Yos(uniData);
    await yos.save();
    res.json({ message: "تم انشاء الامتحان بنجاح" });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند انشاء الامتحان");
  }
};

// Update admission
exports.updateYos = async (req, res, next) => {
  try {
    const {
      exam_date,
      degree_expiry,
      exam_cost,
      currency,
      register_start,
      register_end,
      result_date,
      exam_centers,
      register_url,
      num,
      uni_id,
    } = req.body;
    const id = req.params.id;
    const uniData = [
      exam_date,
      degree_expiry,
      exam_cost,
      currency,
      register_start,
      register_end,
      result_date,
      JSON.stringify(exam_centers),
      register_url,
      num,
      uni_id,
      id,
    ];
    await Yos.update(uniData);
    res.json({ message: "تم تعديل الامتحان بنجاح " });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند تعديل الامتحان");
  }
};
exports.getYosName = async (req, res, next) => {
  try {
    const [yos, _] = await Yos.findAllMain();
    res.json({ yos });
  } catch {
    errorHandler(next, err, "حدث خطأ عند الحصول على اليوس");
  }
};

// Delete admission
exports.deleteYos = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Yos.delete(id);
    res.json({ message: "تم حذف الامتحان بنجاح " });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند حذف الامتحان");
  }
};
