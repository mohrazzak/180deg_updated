module.exports = (next, err, msg = "حدث خطأ", code = 500) => {
  const error = new Error(msg);
  err ? (error.err = err) : "";
  error.statusCode = code;
  return next(error);
};
