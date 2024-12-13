const { Blog } = require("../models/index");
const { SECRET } = require("./config");
const jwt = require("jsonwebtoken");
const Session = require("../models/session");
const User = require("../models/user");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

const errorHandler = (error, _, response, next) => {
  console.error(error.message);
  if (error.name === "SequelizeValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.token = authorization.replace("Bearer ", "");
    } catch (error) {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

const tokenVerifier = async (req, res, next) => {
  const token = req.query.token;
  if (!token) {
    return res.status(401).json({ error: "token missing" });
  }
  const userToken = jwt.verify(token, SECRET);
  const session = await Session.findOne({
    where: { token: token, userId: userToken.id },
    include: { model: User, attributes: ["id", "username", "disabled"] },
  });

  if (!session) {
    return res.status(401).json({ error: "token invalid" });
  } else if (session.user.disabled) {
    return res.status(401).json({ error: "account disabled" });
  } else if (session.user.id !== userToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }

  req.user = session.user;
  next();
};

module.exports = {
  blogFinder,
  errorHandler,
  tokenExtractor,
  tokenVerifier,
};
