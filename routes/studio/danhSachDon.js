var express = require('express');
var router = express.Router();
var load = require("../../models/donchup_model");
var loadinfo = require("../../models/studio_model")
var moment = require('moment');
var auth = require('../../middlewares/auth').authStuio;


router.get('/', auth, function (req, res, next) {
    if (!req.isAuthenticated())
        res.redirect("/");
    else {
        Promise.all([load.all(req.user.id, 'Đang chờ'), loadinfo.single(req.user.id)])
            .then(([rows, rows2]) => {
                for (var i = 0; i < rows.length; i++) {

                    rows[i].ngaydat = moment(rows[i].ngaydat).format('YYYY/MM/DD HH:mm:ss')
                }
                var x = true;
                res.render("./studio/danhSachDon", {
                    trangthai: "Đang chờ",
                    check: true,
                    row: rows,
                    info: rows2[0],
                    quangcao: rows2[0].quangcao,
                    layout: "studio",

                });

            }).catch(err => {
                console.log(err);
                res.end('error occured.')
            });

    }
});

router.get("/tuchoi", auth, function (req, res, next) {


    load.update2(req.query.id, req.query.magoi, req.query.ngaydat, "Đã từ chối").then(
        () => {
            res.redirect('/danhsachdonchup');
        }
    ).catch(err => {
        console.log(err);
        res.end('error occured.')
    })
});

router.get("/nhan", auth, function (req, res, next) {
    load.update2(req.query.id, req.query.magoi, req.query.ngaydat, "Đã nhận").then(
        () => {
            res.redirect('/danhsachdonchup');
        }
    ).catch(err => {
        console.log(err);
        res.end('error occured.')
    })
});






module.exports = router;