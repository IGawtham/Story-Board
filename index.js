const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");
//Load config
dotenv.config({ path: "./config/config.env" });
connectDB();
const app = express();

//Passport config
require("./config/passport")(passport);

//Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
//Handlebars
app.engine(".hbs", exphbs({ extname: ".hbs", defaultLayout: "main" }));
app.set("view engine", ".hbs");

//Sessions
app.use(
  session({
    secret: "stories",
    resave: false,
    saveUninitialized: false,
  })
);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
//static folder
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
