var express = require('express');
var router = express.Router();
var load = require("../../models/studio_model")
var createError = require('http-errors');
router.get('/', function (req, res, next) {
  if (req.query.id != null && req.query.id != "") {
    load.single(req.query.id)
      .then(rows => {

        res.render("./studio/trangChu", {
          ch: false,
          studio: rows[0],
          layout: "studio"
        });
      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });
  } else

  {
    next(createError(404));

  }
});


module.exports = router;