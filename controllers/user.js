const User = require(`../models/User`);
const errorHandler = require(`../helpers/errorHandler`);

// Get all admissions
exports.getAllUsers = async (req, res, next) => {
  try {
    const [emails, _] = await User.findEmails();
    res.json({
      emails: emails.map((e) => e.u_email),
      message: "تم الحصول على المستخدمين بنجاح ",
    });
  } catch (err) {
    errorHandler(next, err, `حدث خطأ عند الحصول على المستخدمين`);
  }
};
