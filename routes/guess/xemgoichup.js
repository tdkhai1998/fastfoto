var express = require('express');
var router = express.Router();
var load = require("../../models/goichup_model")
var loadinfo = require("../../models/studio_model")
var auth = require('../../middlewares/auth').authUser;
var createError = require('http-errors');

router.get('/', function (req, res, next) {
    console.log(req.query);
    if (req.query.id != null && req.query.id != "") {
        Promise.all([load.all(req.query.id), loadinfo.single(req.query.id)])
            .then(([rows, rows2]) => {
                console.log(rows);
                res.render("./studio/goiChup", {
                    quangcao: rows2[0].quangcao,
                    ch: false,
                    row: rows,
                    info: rows2[0],
                    layout: "studio"
                });

            }).catch(err => {
                next(err);
            });
    } else {
        next(createError(404));
    }
});

router.post('/', auth, function (req, res, next) {
    if (req.user && req.user.loai != 1) {
        req.session.message = "Không thể đặt";
        req.session.urlBack = req.baseUrl + req.url;
        res.redirect('/');
    }
    if (req.user) {
        console.log(req.user);
        var entity = new Object();
        entity.khachhang = req.user.id;
        entity.ghichu = req.body.thongtinthem;
        entity.goichup = req.body.goichup;
        entity.ngaydat = new Date();
        entity.trangthai = "Đang chờ"
        load.datlich(entity).then(val =>
            res.redirect('/dsdon')
        ).catch(e => next(e));
    } else {
        req.session.message = "Đăng nhập trước";
        req.session.urlBack = req.baseUrl + req.url;
        res.redirect('/');
    }

})
module.exports = router;