let router = require("express").Router();

router.use("/users", require("./users"));
router.use("/news", require("./news"));
router.use("/comments", require("./comments"));

module.exports = router;
