require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const compression = require(`compression`);
const morgan = require("morgan");
const path = require("path");
const cors = require(`cors`);
const uniRoutes = require("./routes/uni");
const admRoutes = require("./routes/adm");
const yosRoutes = require("./routes/yos");
const majRoutes = require("./routes/maj");
const exmRoutes = require("./routes/exm");
const frmRoutes = require("./routes/frm");
const nwsRoutes = require("./routes/nws");
const schRoutes = require("./routes/sch");
const authRoutes = require("./routes/auth");
const imagesRoutes = require("./routes/images");
const usersRoutes = require(`./routes/user`);
const homeRoutes = require(`./routes/home`);
const app = express();

// Middlewares
// app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
app.use(cors());

// Routes
app.use(`/home`, homeRoutes);
app.use(`/uni`, uniRoutes);
app.use(`/adm`, admRoutes); // add uniname and city DONE
app.use(`/yos`, yosRoutes); // add uniname and city DONE
app.use(`/maj`, majRoutes); // add image, DONE
app.use(`/exm`, exmRoutes); // uniimage, name,
app.use(`/frm`, frmRoutes);
app.use(`/nws`, nwsRoutes); // add date, add uni name

// uni major
app.use(`/sch`, schRoutes);
app.use(`/auth`, authRoutes);
app.use(`/images`, imagesRoutes);
app.use(`/user`, usersRoutes);

// Error handlers
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data, err: error });
});

// 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Sorry, page not found" });
});

// Listen on pc port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
