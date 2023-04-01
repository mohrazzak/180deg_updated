require(`dotenv`).config();
("use strict");
const nodemailer = require("nodemailer");

exports.sendMail = async (email, token, subject, message) => {
  let transporter = nodemailer.createTransport({
    host: process.env.EM_HOST,
    port: process.env.EM_PORT,
    secure: true,
    auth: {
      user: process.env.EM_USER,
      pass: process.env.EM_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: '"180 degAcademy" <support@180degreesacademy.net>',
    to: email,
    subject: subject,
    html: `
    <h1>180 Degrees Academy</h1>
    ${message}
    <p>مع كامل التحيات.</p>
    `,
  });
};
