const fs = require("fs");
const path = require(`path`);
module.exports = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlinkSync(filePath);
};
