var express = require('express');
var router = express.Router();
var studio_m = require('../../models/studio_model');

router.post('/', function (req, res, next) {
    var key = req.body.key;
    var limit = 2;
    var page = req.body.page || 1;
    if (page < 1) page = 1;
    var offset = (page - 1) * limit;
    Promise.all([studio_m.simpleSearch(key, limit, offset), studio_m.countSimpleSearch(key)])
        .then(([studios, count]) => {
            var nPages = count / limit;
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
            if (count > 0) {
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
            res.render('trangchu/trangchu', {
                title: 'T�m ki?m',
                message,
                dangnhap: req.isAuthenticated(),
                username: (req.isAuthenticated()) ? req.user.username : "",
                pages,
                nxt,
                pre,
                key,
                studios
            });
        }).catch(e => next(e));
});
module.exports = router;