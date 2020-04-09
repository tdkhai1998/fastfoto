var express = require('express');
var router = express.Router();
var moment = require('moment');
var bcrypt = require('bcrypt');
var passport = require('passport')
var taikhoan_model = require('../../models/taikhoan_model');
var khach_model = require('../../models/khach_model');
var studio_model = require('../../models/studio_model');
var multer = require('multer');
var upload = multer({
    dest: 'public/images/studio/avt'
});
var path = require('path');
var fs = require('fs');

router.get('/dangxuat', function(req, res, next) {
    req.logout();
    res.redirect('/');
});
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
router.get('/', function(req, res, next) {
    var limit = 9;
    var page = req.query.page || 1;
    if (page < 1) page = 1;
    var offset = (page - 1) * limit;
    Promise.all([studio_model.phantrang(limit, offset), studio_model.dem()]).then(([r, count]) => {
        var nPages = count[0].tong / limit;
        console.log(count);
        var pages = [];
        var i;
        for (i = 0; i < nPages; i++) {
            var pageM = new Object();
            pageM.id = i + 1;
            pageM.active = false;
            pages.push(pageM);
        }
        var nxt = new Object();
        var pre = new Object();
        if (page > i) {
            page = i;
        }
        if (count[0].tong > 0) {
            pages[page - 1].active = true;
            if ((pages[page - 1].id - 1) <= 0) {
                pre.active = false;
            } else {
                pre.active = true;
                pre.id = pages[page - 1].id - 1;
            }
            if (pages[page - 1].id + 1 > nPages) {
                nxt.active = false;
            } else {
                nxt.active = true;
                nxt.id = pages[page - 1].id + 1;
            }
        }
        var message = req.session.message;
        req.session.message = null;
        var candangnhap = () => {
            if (req.session.candangnhap) {
                req.session.candangnhap = false;
                return true;
            }
            return false
        };
        var loai = new Object();
        loai.user = false;
        loai.studio = false;
        loai.adminuser = false;
        loai.adminstudio = false;
        if (req.isAuthenticated()) {
            switch (req.user.loai) {
                case 1:
                    loai.user = true;
                    break;
                case 2:
                    loai.studio = true;
                    break;
                case 3:
                    loai.adminuser = true;
                    break;
                case 4:
                    loai.adminstudio = true;
            }
        }
        console.log(loai);
        res.render('trangchu/trangchu', {
            title: 'TrangChu',
            dsdon: req.user ? req.user.loai === 1 : true,
            message,
            candangnhap,
            loai,
            dangnhap: req.isAuthenticated(),
            username: (req.isAuthenticated()) ? req.user.username : "",
            pages,
            nxt,
            pre,
            rows: r
        });
    }).catch(e => next(e));
});
router.get('/dangky', function(req, res, next) {
    res.render('trangchu/dangky', {
        title: 'Đăng ký'
    });
});
router.post('/dangky', upload.single('image'), function(req, res, next) {
    var loai = req.body.loai;
    var acc = taikhoan_model.create();
    acc.username = req.body.username;
    acc.password = (loai == "U") ? req.body.passwordU : req.body.passwordS;
    acc.password = bcrypt.hashSync(acc.password, 10);
    var add_nguoidung = null;
    var user = null;
    var studio = null;
    if (loai == "U") {
        user = khach_model.create();
        user.id = acc.id;
        user.hoten = req.body.hoten;
        user.email = req.body.email;
        user.ngaysinh = moment(req.body.ngaysinh, 'DD/MM/YYYY').format("YYYY-MM-DD");
        user.sodienthoai = req.body.sdt;
        user.facebook = req.body.facebook;
        taikhoan_model.add(acc).then((val) => {
            khach_model.add(user).then(val =>
                res.redirect('/')
            ).catch(e => {
                next(e)
            }).catch(e => {
                next(e)
            })
        });
    } else {
        var file = path.join(__dirname, '../../public/images/studio/avt/') + req.body.username + "." + req.file.mimetype.replace('image/', '');
        fs.rename(req.file.path, file, function(err) {
            if (err) {
                next(err);
            } else {
                studio = studio_model.create();
                studio.id = acc.id;
                studio.tenStudio = req.body.tenStudio;
                studio.email = req.body.email;
                studio.diachi = req.body.diachi;
                studio.sodienthoai = req.body.sdt;
                studio.facebook = req.body.facebook;
                studio.quangcao = "/images/studio/quangcao.gif";
                studio.anhDaiDien = '/images/studio/avt/' + req.body.username + "." + req.file.mimetype.replace('image/', '');
                studio.bosuutap = '/images/studio/sample.jpg,/images/studio/sample.jpg,/images/studio/sample.jpg,/images/studio/sample.jpg,/images/studio/sample.jpg,/images/studio/sample.jpg,/images/studio/sample.jpg,/images/studio/sample.jpg,/images/studio/sample.jpg';
                acc.loai = 2;
                taikhoan_model.add(acc).then(() => {
                    studio_model.add(studio).then(val => {
                        console.log(val);
                        res.redirect('/');
                    }).catch(e => {
                        next(e)
                    }).catch(e => {
                        next(e)
                    })
                });
            }
        });
    }
})
router.get('/account/is-available', function(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.query.username == req.user.username)
            return res.json(true);
    }
    taikhoan_model.single(req.query.username).then(rows => {
        if (rows.length > 0) {
            return res.json(false);
        }
        return res.json(true);
    })
});
router.post('/', function(req, res, next) {
    if (req.user) {
        req.session.message = null;
        return res.redirect(urlBack(req.user.loai));
    }
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            req.session.message = "Đăng nhập không thành công";
            req.session.candangnhap = true;
            return res.redirect("/");
        }
        req.logIn(user, err => {
            if (err)
                return next(err);
            if (req.user.tinhtrang === 0) {
                req.session.message = "TÀI KHOẢN ĐÃ BỊ BLOCK";
                req.logOut();
                return res.redirect('/');
            }
            if (req.session.urlBack) {
                return res.redirect(req.session.urlBack);
            }
            return res.redirect(urlBack(req.user.loai));
        });
    })(req, res, next);
});
module.exports = router;