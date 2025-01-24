const express = require("express");
const controllers = require("./controllers");
const multer = require("multer");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: {fieldSize: 25*1024*1024}});

router.get("/:ref/fulldata", controllers.getProfuctOffFullData);
router.get("/:ref", controllers.getProfuctOff);

router.post("/", controllers.createProductOFF);
router.post("/image", upload.single("offimg"), controllers.uploadOffImg)


module.exports = router;