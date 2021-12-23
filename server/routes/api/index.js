let router = require("express").Router();

router.use("/users", require("./users"));
router.use("/news", require("./news"));

module.exports = router;
