var express = require('express');
var router = express.Router();
var tk_m = require('../../models/studio_model');

var auth = require('../../middlewares/auth').authAdminStudio;
router.get('/', auth, (req, res, next) => {
    tk_m.all().then(acc => {
        acc.forEach(e => {
            if (e.tinhtrang == 1) e.tinhtrang = true;
            else e.tinhtrang = false;
        });
        var message = req.session.message;
        req.session.message = null;
        res.render('admin/qlstudio', {
            title: 'TrangChu',
            dsdon: false,
            message,
            dangnhap: req.isAuthenticated(),
            username: (req.isAuthenticated()) ? req.user.username : "",
            acc,
            loai: {
                adminstudio: true
            }
        });
    }).catch(e => next(e));
})
router.get('/block', auth, (req, res, next) => {
    if (req.query) {
        tk_m.block(req.query.id).then(val => {
            res.redirect('/quanlistudio');
        }).catch(e => next(e))
    } else {
        res.redirect('/');
    }
})
router.get('/unblock', auth, (req, res, next) => {
    if (req.query) {
        tk_m.unblock(req.query.id).then(val => {
            res.redirect('/quanlistudio');
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
        res.render('admin/qlstudio', {
            title: 'TrangChu',
            timkiem: key,
            dsdon: false,
            message,
            dangnhap: req.isAuthenticated(),
            username: (req.isAuthenticated()) ? req.user.username : "",
            acc,
            loai: {
                adminstudio: true
            }
        });
    }).catch(e => next(e));

})
module.exports = router;