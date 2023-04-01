require(`dotenv`).config();
const codes = require("http-status-codes");
const User = require(`../models/User`);
const Admin = require(`../models/Admin`);
const errorHandler = require(`../helpers/errorHandler`);
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendMail = require(`../mail.js`).sendMail;
const { validationResult } = require(`express-validator`);
exports.userLogin = async (req, res, next) => {
  try {
    const { u_email, u_password } = req.body;
    let user = await User.findByEmail(u_email);
    user = user[0][0];
    if (!user) {
      errorHandler(
        next,
        null,
        "لايوجد حساب بهذا الايميل يرجى التاكد والمحاولة مرة اخرى",
        400
      );
    }
    if (!user.confirmation) {
      errorHandler(next, null, "يرجى تفعيل حسابك ثم المحاولة لاحقاً", 400);
    }
    let result = await bcrypt.compare(u_password, user.u_password);
    if (!result) {
      return res
        .status(codes.UNAUTHORIZED)
        .json({ message: `كلمة السر خاطئة` });
    }
    const token = await jwt.sign(
      {
        id: user.id,
        name: user.u_name,
        role: user.theRole,
      },
      process.env.TOKEN,
      { expiresIn: `7d` }
    );
    res.status(codes.ACCEPTED).json({
      message: "User signed in successfully.",
      user: {
        token,
        id: user.id,
        role: user.theRole,
        name: user.u_name,
      },
    });
  } catch (err) {
    errorHandler(next, err);
  }
};

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const role = "admin";
    const admin = await Admin.findByEmail(email);
    if (!admin) {
      const error = new Error(`Error finding admin.`);
      error.statusCode = codes.BAD_REQUEST;
      return next(error);
    }
    let result = await bcrypt.compare(password, admin.password);
    if (!result) {
      return res
        .status(codes.UNAUTHORIZED)
        .json({ message: `Password incorrect.` });
    }
    const token = jwt.sign(
      {
        id: admin.id,
        name: admin.name,
        role,
      },
      process.env.TOKEN,
      { expiresIn: `7d` }
    );
    res.status(codes.ACCEPTED).json({
      message: "Admin signed in successfully.",
      user: {
        token,
        id: admin.id,
        role,
        name: admin.name,
      },
    });
  } catch (err) {
    const error = new Error(`Error Logining in.`);
    error.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(error);
  }
};

exports.UserSignup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorHandler(next, null, errors.array()[0].msg, 400);
  }
  try {
    const { u_name, u_email, u_password } = req.body;
    const [oldUser, _] = await User.findByEmail(u_email);
    if (oldUser.length > 0) {
      return errorHandler(next, null, "المستخدم موجود مسبقاً", 400);
    }
    const uniData = {
      u_name,
      u_email,
      u_password: await bcrypt.hash(u_password, 10),
    };
    const user = new User(uniData);
    await user.save();
    const theUser = await User.findByEmail(u_email);
    const emailToken = await jwt.sign(
      {
        id: theUser[0][0].id,
        name: theUser[0][0].name,
      },
      process.env.EMAIL_TOKEN,
      { expiresIn: `1h` }
    );

    const html = `
    <p>يسعدنا انك تريد الانضمام ألينا، اذا أردت تفعيل الحساب يرجى الضغط على 
    <a href="${
      process.env.NODE_ENV == "production"
        ? process.env.DepURI + "/confirmed/" + emailToken
        : process.env.localURI + "/confirmed/" + emailToken
    }"
    target="_blank">الرابط التالي</a>.</p>
    `;
    process.env.NODE_ENV == "development"
      ? console.log(emailToken)
      : sendMail(u_email, emailToken, "تأكيد الحساب", html);

    res.json({ message: "تم انشاء المستخدم بنجاح" });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند انشاء المستخدم");
  }
};

// exports.AdminSignup = async (req, res, next) => {
//   try {
//     const { a_name, a_email, a_password } = req.body;
//     const uniData = {
//       a_name,
//       a_email,
//       a_password: await bcrypt.hash(a_password, 10),
//     };
//     const oldAdmin = await Admin.findByEmail(a_email);
//     if (oldAdmin) errorHandler(next, null, "الادمن موجود مسبقاً", 400);
//     const admin = new Admin(uniData);
//     await admin.save();
//     res.json({ message: "تم انشاء الادمن بنجاح" });
//   } catch (err) {
//     errorHandler(next, err, "حدث خطأ عند انشاء الادمن");
//   }
// };

exports.userReset = async (req, res, next) => {
  try {
    const { u_email } = req.body;
    let user = await User.findByEmail(u_email);
    user = user[0][0];
    if (!user)
      errorHandler(
        next,
        null,
        "الحساب غير موجود تأكد واعد المحاولة لاحقاً",
        400
      );

    const resetToken = jwt.sign(
      {
        email: u_email,
      },
      process.env.EMAIL_TOKEN,
      { expiresIn: `1h` }
    );
    const html = `
    <p>لتغير كلمة السر على موقعنا يرجى الضغط على
    Click this <a href="${
      process.env.NODE_ENV == "production"
        ? process.env.DepURI
        : process.env.localURI
    }/new-password/${resetToken}" target="_blank"> الرابط التالي</a>
    </p>
    `;
    process.env.NODE_ENV == "development"
      ? console.log(resetToken)
      : sendMail(u_email, resetToken, "تغيير كلمة السر", html);

    res.json({ message: "تم انشاء الادمن بنجاح" });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند انشاء الادمن");
  }
};

exports.resetHandler = async (req, res, next) => {
  try {
    const { u_password } = req.body;
    const token = req.params.token;
    let decodedToken;
    try {
      decodedToken = await jwt.verify(token, process.env.EMAIL_TOKEN);
    } catch (err) {
      errorHandler(next, err);
    }
    const email = decodedToken.email;
    let user = await User.findByEmail(email);
    user = user[0][0];
    user.u_password = await bcrypt.hash(u_password, 10);
    await User.update([user.u_name, user.u_email, user.u_password, user.id]);
    res.json({ message: "تم تعديل كلمة السر" });
  } catch (err) {
    errorHandler(next, err, "حدث خطأ عند انشاء الادمن");
  }
};

exports.confirmation = async (req, res, next) => {
  try {
    const token = req.params.token;
    let decodedToken;
    try {
      decodedToken = await jwt.verify(token, process.env.EMAIL_TOKEN);
    } catch (err) {
      errorHandler(next, err);
    }
    const id = decodedToken.id;
    let user = await User.findById(id);
    user = user[0][0];
    if (user.confirmation) {
      errorHandler(next, null, "حسابك مفعل مسبقاً", 400);
    }
    await User.activate(id);
    res.json({ message: "تم تفعيل حسابك بنجاح" });
  } catch (err) {}
};
