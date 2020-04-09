var express = require('express');
var router = express.Router();
var dsdon_m = require('../../models/dsdon_model');
var auth = require('../../middlewares/auth').authUser;
router.get("/", auth, function(req, res, next) {

    var stt = "Đã nhận";
    if (req.body.luachon) {
        switch (req.body.luachon) {
            case 1:
                stt = "Đã nhận";
            case 2:
                stt = "Đang chờ";
            case 3:
                stt = "Đã từ chối";
        }
    }
    dsdon_m.getAll(req.user.id).then(val => {
        var danhan = [];
        var dangcho = [];
        var datuchoi = [];
        val.forEach(element => {
            if (element.trangthai == 'Đã nhận') {
                danhan.push(element);
            } else if (element.trangthai == 'Đang chờ') {
                dangcho.push(element);
            } else {
                datuchoi.push(element);
            }
        });

        res.render('trangchu/dsdon', {
            title: 'TrangChu',
            dsdon: req.user ? req.user.loai === 1 : true,
            dangnhap: req.isAuthenticated(),
            username: (req.isAuthenticated()) ? req.user.username : "",
            danhan,
            dangcho,
            datuchoi,
            loai: {
                user: true
            }
        });
    }).catch(e => next(e))

})
module.exports = router;