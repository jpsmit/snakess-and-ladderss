var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/splash", function (req, res) {
    res.sendFile("splash.html", {root: "./public"});
});

/* Pressing the 'Start Game' button, returns this page */
router.get("/game", function(req, res) {
    res.sendFile("game.html", {root: "./public"});
});

module.exports = router;
