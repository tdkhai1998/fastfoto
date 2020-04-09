var express = require('express');
var router = express.Router();
var moment = require('moment');
var khach_model = require('../../models/khach_model');
var auth = require('../../middlewares/auth').authUser;
var urlBack = (loai) => {
    switch (loai) {
        case 1:
            return "/";
        case 2:
            return "/trangchustudio";
        case 3:
            return "/quanlitaikhoan";
        case 4:
            return "/quanlistudio";
        default:
            return "/sair";
    }
}

router.post("/", auth, function(req, res, next) {
    var u = req.body;
    u.id = req.user.id;
    delete u.username;
    u.ngaysinh = moment(req.body.ngaysinh, 'DD/MM/YYYY').format("YYYY-MM-DD");
    khach_model.update(u).then(val => {
        console.log(req.url);
        res.redirect('/thongtintaikhoan');
    }).catch(e => {
        res.render('test', {
            noidung: e
        })
    })
})
router.get('/', auth, function(req, res, next) {
    console.log("zsxdcfvgbhn");
    khach_model.single(req.user.id).then(val => {
        if (val.length > 0) {
            val[0].ngaysinh = moment(val[0].ngaysinh).format("DD/MM/YYYY");
            res.render("trangchu/thongtintaikhoan", {
                taikhoan: req.user,
                khach: val[0],
                dsdon: req.user ? req.user.loai === 1 : true,
                title: 'TrangChu',
                dangnhap: true,
                loai: {
                    user: true
                },
                username: (req.isAuthenticated()) ? req.user.username : "",
            });
        } else {
            req.session.message = "Tài khoản của bạn không phải là user";
            res.redirect(urlBack(req.user.loai));
        }
    }).catch(e => next(e));
})
module.exports = router;