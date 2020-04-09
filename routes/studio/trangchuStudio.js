var express = require('express');
var router = express.Router();
var load = require("../../models/studio_model")
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

router.get('/', auth, function(req, res, next) {
    load.single(req.user.id)
        .then(rows => {

            res.render("./studio/trangChu", {
                ch: true,
                studio: rows[0],
                layout: "studio"
            });
        }).catch(err => {
            console.log(err);
            res.end('error occured.')
        });
});

router.post('/quangcao', auth, upload.single('anhquangcao'), function(req, res, next) {
    var entity = new Object();
    entity.id = req.user.id;
    entity.quangcao = "/images/uploads/" + filename;
    load.updatequangcao(entity).then(
        res.redirect('/trangchustudio')
    )
})



router.post('/', auth, upload.single('anhdaidien'), function(req, res, next) {
    var entity = new Object;
    var value = req.body;
    entity.id = value.id;
    entity.tenStudio = value.tenstudio;
    entity.mota = value.mota;
    entity.bosuutap = value.bosuutap;
    entity.chuky = value.chuky;
    entity.phongcach = value.phongcach;
    entity.diachi = value.diachi;
    entity.sodienthoai = value.sodienthoai;
    entity.facebook = value.facebook;
    entity.email = value.email;
    if (req.file) {
        entity.anhDaiDien = "/images/uploads/" + filename;
    }
    load.update(entity).then(val =>
        res.redirect('/trangchustudio')
    )
})


module.exports = router;