var express = require('express');
var router = express.Router();
var loadinfo = require("../../models/studio_model")
var multer = require('multer');
var filename = ""
var oldgallery = ""
var auth = require('../../middlewares/auth').authStuio;
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
        filename = file.fieldname + '-' + Date.now() + ".jpg"
        cb(null, filename)
    }
});
var upload = multer({
    storage: storage
});



function splitImg(x) {
    var imgs = x.split(",");

    return imgs;
}


router.get('/', auth, function (req, res, next) {
    if (!req.isAuthenticated())
        res.redirect("/");
    else {
        loadinfo.single(req.user.id)
            .then(rows => {
                oldgallery = rows[0].bosuutap;
                var img = splitImg(rows[0].bosuutap);
                var imgobj = [];

                img.forEach(element => {
                    var temp = new Object;

                    temp.ch = true;
                    temp.img = element;
                    imgobj.push(temp);
                })
                res.render("./studio/boSuuTap", {
                    ch: true,
                    row: imgobj,
                    info: rows[0],
                    layout: "studio"
                });

            }).catch(err => {
                console.log(err);
                res.end('error occured.')
            });
    }
});


router.post('/', auth, upload.single('anhmau'), function (req, res, next) {
    var value = req.body;
    console.log(value)
    var entity = new Object
    var newimg = "/images/uploads/" + filename;
    newgallry = oldgallery.replace(value.oldimg, newimg)
    console.log(newgallry)
    entity.bosuutap = newgallry;
    entity.id = value.id;
    if (!req.file) {
        console.log("No file received");
        return res.send({
            Message: "No image uploaded ! Please try again !"
        });
    }
    loadinfo.update(entity).then(value =>

        res.redirect('/bosuutap')
    )
});




module.exports = router;