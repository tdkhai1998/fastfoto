var express = require('express');
var router = express.Router();
var tk_m = require('../../models/taikhoan_model');
var auth = require("../../middlewares/auth").authAdminUser;
router.get('/', auth, (req, res, next) => {
    tk_m.all().then(acc => {
        acc.forEach(e => {
            if (e.tinhtrang == 1) e.tinhtrang = true;
            else e.tinhtrang = false;
        });
        var message = req.session.message;
        req.session.message = null;
        res.render('admin/qltaikhoan', {
            message,
            title: 'TrangChu',
            dsdon: false,
            dangnhap: req.isAuthenticated(),
            username: (req.isAuthenticated()) ? req.user.username : "",
            acc,
            loai: {
                adminuser: true
            }
        });
    }).catch(e => next(e));
})
router.get('/block', auth, (req, res, next) => {
    if (req.query) {
        tk_m.block(req.query.id).then(val => {
            res.redirect('/quanlitaikhoan');
        }).catch(e => next(e))
    } else {
        res.redirect('/');
    }
})
router.get('/unblock', auth, (req, res, next) => {
    if (req.query) {
        tk_m.unblock(req.query.id).then(val => {
            res.redirect('/quanlitaikhoan');
        }).catch(e => next(e))
    } else {
        res.redirect('/');
    }
})
router.post('/', auth, (req, res, next) => {
    var key = req.body.key;
    tk_m.search(key).then(acc => {
        acc.forEach(e => {
            if (e.tinhtrang == 1) e.tinhtrang = true;
            else e.tinhtrang = false;
        });
        var message = req.session.message;
        req.session.message = null;
        res.render('admin/qltaikhoan', {
            message,
            title: 'TrangChu',
            timkiem: req.body.key,
            dsdon: false,
            dangnhap: req.isAuthenticated(),
            username: (req.isAuthenticated()) ? req.user.username : "",
            acc,
            loai: {
                adminuser: true
            }
        });
    }).catch(e => next(e));
})
module.exports = router;