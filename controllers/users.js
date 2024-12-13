const router = require("express").Router();
const bcrypt = require("bcrypt");

const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.scope("withoutPassword").findAll({
    include: {
      model: Blog,
      attributes: ["title"],
    },
  });
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const where = req.query.read
    ? { read: req.query.read === "true" }
    : undefined;
  const user = await User.scope("withoutPassword").findByPk(req.params.id, {
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: { exclude: ["userId", "createdAt", "updatedAt"] },
        through: {
          attributes: ["id", "read"],
          as: "readinglists",
          where,
        },
      },
    ],
  });
  if (user) {
    return res.json(user);
  } else {
    return res.status(404).end();
  }
});

router.post("/", async (req, res) => {
  const { username, name, password } = req.body;
  if (!username || !name || !password) {
    return res
      .status(400)
      .json({ error: "username, name and password are required" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, name, passwordHash });
  return res.json(user);
});

router.put("/:username", async (req, res) => {
  const user = await User.scope("withoutPassword").findOne({
    where: { username: req.params.username },
  });
  if (user) {
    user.username = req.body.username;
    await user.save();
    return res.json(user);
  } else {
    return res.status(404).end();
  }
});

module.exports = router;
