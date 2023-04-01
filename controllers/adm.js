const Adm = require(`../models/Adm`);
const errorHandler = require(`../helpers/errorHandler`);

// Get all admissions
exports.getAllAdm = async (req, res, next) => {
  try {
    const [adm, _] = await Adm.findAll();
    res.json({ adm, message: "تم الحصول على المفاضلات بنجاح " });
  } catch (err) {
    errorHandler(next, err, `حدث خطأ عند الحصول على المفاضلة`);
  }
};

// Get admission
exports.getAdm = async (req, res, next) => {
  try {
    const id = req.params.id;
    const [adm, _] = await Adm.findById(id);
    if (!adm || adm.length == 0)
      errorHandler(next, null, "حدث خطأ المفاضلة غير موجودة", 400);
    res.json({ adm });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند الحصول على المفاضلة");
  }
};

// Create admission
exports.newAdm = async (req, res, next) => {
  try {
    const {
      start_date,
      register_type,
      end_date,
      result_date,
      price,
      currency,
      bank_info,
      note,
      register_url,
      seats_url,
      acceptable_degrees_url,
      installment_url,
      num,
      uni_id,
    } = req.body;
    const uniData = {
      start_date,
      register_type,
      end_date,
      result_date,
      price,
      currency,
      bank_info,
      note,
      register_url,
      seats_url,
      acceptable_degrees_url,
      installment_url,
      num,
      uni_id,
    };

    const adm = new Adm(uniData);
    await adm.save();
    res.json({ message: "تم انشاء المفاضلة بنجاح" });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند انشاء المفاضلة");
  }
};

// Update admission
exports.updateAdm = async (req, res, next) => {
  try {
    const {
      start_date,
      register_type,
      end_date,
      result_date,
      price,
      currency,
      bank_info,
      note,
      register_url,
      seats_url,
      acceptable_degrees_url,
      installment_url,
      num,
      uni_id,
    } = req.body;
    const id = req.params.id;
    const uniData = [
      start_date,
      register_type,
      end_date,
      result_date,
      price,
      currency,
      bank_info,
      note,
      register_url,
      seats_url,
      acceptable_degrees_url,
      installment_url,
      num,
      uni_id,
      id,
    ];
    await Adm.update(uniData);
    res.json({ message: "تم تعديل الجامعة بنجاح " });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند تعديل معلومات المفاضلة");
  }
};

exports.getAdmName = async (req, res, next) => {
  try {
    const [adm, _] = await Adm.findAllMain();
    res.json({ adm });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند الحصول على اسم المفاضلة");
  }
};

// Delete admission
exports.deleteAdm = async (req, res, next) => {
  try {
    const id = req.params.id;
    await Adm.delete(id);
    res.json({ message: "تم حذف المفاضلة بنجاح " });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند حذف المفاضلة");
  }
};
