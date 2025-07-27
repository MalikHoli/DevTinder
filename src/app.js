const express = require("express");
const { connectToMongodb } = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const server = express();
const PORT = 3000;
let requestNo = 0;

connectToMongodb()
  .then(() => {
    console.log("Database connection is established");
    server.listen(PORT, "localhost", () => {
      console.log("Server is listening now");
    });
  })
  .catch((err) => {
    console.log(err);
  });

server.use(
  "/",
  (req, res, next) => {
    ++requestNo;
    console.log(Date.now(), " : ", "incoming request no: ", requestNo);
    next();
  },
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
  express.json(),
  cookieParser()
);

const authRounter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/connectionRequests.js");
const userRouter = require("./routes/user.js");

server.use("/", authRounter);
server.use("/", profileRouter);
server.use("/", requestRouter);
server.use("/", userRouter);
