const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const apiRoute = require("./route/auth");

const app = express();

app.get("/", (req, res) => {
  res.send("App running");
});

app.use(express.json(), cors());

app.use("/api/users", apiRoute);

const port = 3000;

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});

dotenv.config();

mongoose
  .connect(process.env.DB_URL, { useNewUrlParser: true })
  .then(() => console.log("Database connected"))
  .catch((error) => console.log(error));
