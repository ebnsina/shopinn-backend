const { readdirSync } = require("fs");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

app.use(cors());

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Database connected!`))
  .catch((err) => console.log(err));

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: false }));
app.use(morgan("dev"));

readdirSync("./routes").map((route) =>
  app.use("/api", require(`./routes/${route}`))
);

app.get("/", (req, res) => {
  res.send("Shop Inn API.");
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server: http://localhost:${port}`));
