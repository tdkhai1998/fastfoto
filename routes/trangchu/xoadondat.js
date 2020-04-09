var express = require('express');
var router = express.Router();
var dsd_model = require('../../models/dsdon_model');
var mm = require('moment');
router.get('/', (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.query) {
            var khoachinh = req.query;
            khoachinh.ngaydat = mm(khoachinh.ngaydat).format('YYYY-MM-DD HH:mm:ss');
            dsd_model.xoaDonChup(khoachinh).then(val => {
                res.redirect('/dsdon');
            }).catch(err => next(err));
        } else {
            res.redirect("/");
        }
    } else {
        req.session.message = "Cần đăng nhập";
        res.redirect("/");
    }
})
module.exports = router;