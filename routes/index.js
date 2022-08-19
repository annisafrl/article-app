const express = require("express");
const router = express.Router();
const {version} = require("../package.json");
const v1Routes = require("./v1");

router.get("/", function(req, res,next){
    res.send("forum New API VERSION " + version);
})

router.use("/v1", v1Routes);

module.exports = router
