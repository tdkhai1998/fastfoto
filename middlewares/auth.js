// module.exports = (req, res, next) => {
//   // if (!req.user) {
//   //   res.locals.url = req.originalUrl;
//   //   res.redirect('/account/login');
//   // } else next();
//   if (req.user && req.user.loaiTaiKhoan == "4") {
//     next();
//   } else {
//     req.session.sessionFlash = {
//       urlBack: req.baseUrl + req.url
//     }
//     res.redirect('/account/login');
//   }
// }


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

module.exports = {
    authAdminUser: (req, res, next) => {
        if (req.user) {
            if (req.user.loai != 3) {
                res.render('error', {
                    loi: '403',
                    urlBack: urlBack(req.user.loai),
                    message: "Bạn không có quyền truy cập",
                    layout: false
                });
            } else
                next();
        } else {
            req.session.urlBack = req.baseUrl + req.url;
            req.session.message = "Bạn cần đăng nhập để thực hiện chức năng này";
            req.session.candangnhap = true;
            res.redirect('/');
        }
    },

    authAdminStudio: (req, res, next) => {
        if (req.user) {
            if (req.user.loai != 4) {
                res.render('error', {
                    loi: '403',
                    urlBack: urlBack(req.user.loai),
                    message: "Bạn không có quyền truy cập",
                    layout: false
                });
            } else
                next();
        } else {
            req.session.urlBack = req.baseUrl + req.url;
            req.session.message = "Bạn cần đăng nhập để thực hiện chức năng này";
            req.session.candangnhap = true;
            res.redirect('/');
        }
    },
    authStuio: (req, res, next) => {
        if (req.user) {
            if (req.user.loai != 2) {
                res.render('error', {
                    loi: '403',
                    urlBack: urlBack(req.user.loai),
                    message: "Bạn không có quyền truy cập",
                    layout: false
                });
            } else
                next();
        } else {
            req.session.urlBack = req.baseUrl + req.url;
            req.session.message = "Bạn cần đăng nhập để thực hiện chức năng này";
            req.session.candangnhap = true;
            res.redirect('/');
        }
    },
    authUser: (req, res, next) => {
        if (req.user) {
            if (req.user.loai === 1) {
                next();
            } else {
                req.session.message = "Bạn không thể thực hiện chức năng này";
                res.redirect('/');
            }
        } else {
            req.session.urlBack = req.baseUrl + req.url;
            req.session.message = "Bạn cần đăng nhập để thực hiện chức năng này";
            req.session.candangnhap = true;
            res.redirect('/');
        }
    }
}