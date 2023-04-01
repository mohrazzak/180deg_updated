module.exports = (req, res, next) => {
  try {
    if (req.user.role == "admin") return next();
    const error = new Error("Not Authuorized.");
    error.statusCode = 401;
    return next(error);
  } catch {
    const error = new Error("Not Authuorized.");
    error.statusCode = 401;
    return next(error);
  }
};
