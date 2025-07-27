const { User } = require("../model");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { DevtinderTocken } = req.cookies;
    if (!DevtinderTocken) {
      return res.status(401).send("Please login !");
    }
    const { id } = jwt.verify(DevtinderTocken, "ServerSide@#Pwd");
    const user = await User.findOne({ _id: id }).lean();
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; //attaching the retrived user to the reqest so that next handler can use it
    next();
  } catch (err) {
    res.status(400).send("something went wrong");
    console.log(err.message);
  }
};

module.exports = { userAuth };
