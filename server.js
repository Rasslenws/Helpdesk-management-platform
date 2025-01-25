const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const colors = require("colors");
const db = require("./src/db/index");
const path = require("path");

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post("/", (req, res) => {
  res.status(200).json({
    message: "Web service !",
  });
});

app.use(express.json());

require("./src/routes/index.routes")(app);

const PORT = process.env.PORT;
app.listen(PORT, (err) => {
  if (!err) {
    console.log(`🚀 Server ready at http://localhost:${PORT} `.bgGreen);
  } else {
    console.log(`⛔server is down : ${err}`.bgRed);
  }
});
