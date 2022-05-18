const router = require("express").Router();

router.use("/auth", require("./auth"));
router.use("/account", require("./account"));
router.use("/contact", require("./contact"));
router.use("/quest", require("./quest"));

module.exports = router;
