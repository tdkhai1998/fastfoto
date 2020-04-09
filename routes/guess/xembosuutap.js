var express = require('express');
var router = express.Router();
var loadinfo = require("../../models/studio_model")
var createError = require('http-errors');



router.get('/', function (req, res, next) {
  console.log(req.query.id)
  if (req.query.id != null && req.query.id != "") {
    loadinfo.single(req.query.id)
      .then(rows => {
        var img = rows[0].bosuutap.split(",");
        var imgobj = [];

        img.forEach(element => {
          var temp = new Object;

          temp.ch = false;
          temp.img = element;
          imgobj.push(temp);


        });
        res.render("./studio/boSuuTap", {

          ch: false,
          row: imgobj,
          info: rows[0],
          layout: "studio"
        });

      }).catch(err => {
        console.log(err);
        res.end('error occured.')
      });
  } else {
    next(createError(404));
  }
});


module.exports = router;