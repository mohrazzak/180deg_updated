const Nws = require(`../models/Nws`);
const Yos = require(`../models/Yos`);
const Maj = require(`../models/Maj`);
const Uni = require(`../models/Uni`);

const errorHandler = require(`../helpers/errorHandler`);

exports.getHome = async (req, res, next) => {
  try {
    console.log('t');
    const [yos] = await Yos.find5();
    const [maj] = await Maj.find5();
    const [nws] = await Nws.find5();
    const [unis] = await Uni.find5();

    res.json({ yos, maj, nws, unis });
  } catch (err) {
    errorHandler(next, err, `حدث خطأ عند الحصول على البيانات`);
  }
};
