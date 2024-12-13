const Session = require("../models/session");
const middleware = require("../util/middleware");
const router = require("express").Router();

router.delete("/", middleware.tokenVerifier, async (request, response) => {
  const token = request.query.token;
  await Session.destroy({
    where: {
      token,
    },
  });

  response.status(204).end();
});

module.exports = router;
