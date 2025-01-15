const express = require("express");
const controllers = require("./controllers");
const router = express.Router();

router.get("/:ref/FullData", controllers.getProfuctOffFullData);
router.get("/:ref", controllers.getProfuctOff);


module.exports = router;