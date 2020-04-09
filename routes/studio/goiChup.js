var express = require('express');
var router = express.Router();
var load = require("../../models/goichup_model")
var loadinfo = require("../../models/studio_model")
var multer = require('multer');
var filename = "";
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

router.get('/', auth, function (req, res, next) {
    if (!req.isAuthenticated())
        res.redirect("/");
    else {

        Promise.all([load.all(req.user.id), loadinfo.single(req.user.id)])
            .then(([rows, rows2]) => {
                rows.forEach(element => {
                    element.ch = true
                });
                res.render("./studio/goiChup", {
                    ch: true,
                    row: rows,
                    info: rows2[0],
                    quangcao: rows2[0].quangcao,
                    layout: "studio"

                });

            }).catch(err => {
                console.log(err);
                res.end('error occured.')
            });
    }
});

router.post('/', auth, upload.single('anhdaidien'), function (req, res, next) {

    var value = req.body;
    console.log(value)
    var entity = new Object()
    entity.magoi = Date.now();
    entity.anhdaidien = "/images/uploads/" + filename;
    entity.tengoi = value.tengoi;
    entity.soluonganh = value.soluong;
    entity.diadiem = value.diadiem;
    entity.thongtinthem = value.thongtinthem;
    entity.gia = value.gia;
    entity.studio = req.user.id;
    entity.daxoa = 0;
    if (!req.file) {
        console.log("No file received");
        return res.send({
            Message: "No image uploaded ! Please try again !"
        });
    }
    load.add(entity).then(value =>
        res.redirect('/goichup')
    );

})

router.get('/xoa', function (req, res, next) {

    var value = req.query;
    console.log(value)
    var entity = new Object()
    entity.magoi = value.magoi;
    entity.daxoa = 1;
    load.update(entity).then(
        value =>
        res.redirect('/goichup')
    );

})

router.post('/capnhat', auth, upload.single('anhdaidien'), function (req, res, next) {

    var value = req.body;
    console.log(value)
    var entity = new Object()
    entity.magoi = value.magoi
    if (req.file) {
        entity.anhdaidien = "/images/uploads/" + filename;
    }
    entity.tengoi = value.tengoi;
    entity.soluonganh = value.soluong;
    entity.diadiem = value.diadiem;
    entity.thongtinthem = value.thongtinthem;
    entity.gia = value.gia;
    entity.studio = req.user.id;
    entity.daxoa = 0;

    load.update(entity).then(value =>
        res.redirect('/goichup')
    );

})


module.exports = router;