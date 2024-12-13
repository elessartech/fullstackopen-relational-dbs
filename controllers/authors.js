const router = require("express").Router();
const { Blog } = require("../models");
const { fn, col, literal } = require("sequelize");

router.get("/", async (req, res) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        "author",
        [fn("COUNT", col("author")), "articles"],
        [fn("SUM", col("likes")), "likes"],
      ],
      group: ["author"],
      order: [[literal("likes"), "DESC"]],
    });
    res.json(authors);
  } catch (error) {
    console.error("Error fetching authors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
