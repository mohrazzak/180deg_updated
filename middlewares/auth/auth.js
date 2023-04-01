const jwt = require("jsonwebtoken");
const codes = require(`http-status-codes`).StatusCodes;

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    // const error = new Error("Not authenticated.");
    // error.statusCode = codes.UNAUTHORIZED;
    // return next(error);
    return next();
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.TOKEN);
  } catch (err) {
    err.statusCode = codes.INTERNAL_SERVER_ERROR;
    return next(err);
  }
  if (!decodedToken) {
    const error = new Error("غير مصرح لك بتنفيذ العملية.");
    error.statusCode = codes.UNAUTHORIZED;
    return next(error);
  }
  let user = {
    id: decodedToken.id,
    role: decodedToken.role,
  };
  req.user = user;
  next();
};
