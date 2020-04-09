var createError = require('http-errors');
var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var logger = require('morgan');
var numeral = require('numeral');
var hbs_section = require('express-handlebars-sections');
var hbs = require('hbs');

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
require('./middlewares/view-engine')(app);
require('./middlewares/session')(app);
require('./middlewares/passport')(app);


var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));




app.use(logger('dev'));
app.use(express.json());


app.use('/', require('./routes/trangchu/trangchu_router'));
app.use('/thongtintaikhoan', require('./routes/trangchu/thongtintaikhoan'));
app.use('/trangchustudio', require('./routes/studio/trangchuStudio'));
app.use('/goichup', require('./routes/studio/goiChup'));
app.use('/bosuutap', require('./routes/studio/boSuuTap'));
app.use('/danhsachdonchup', require('./routes/studio/danhSachDon'));
app.use('/danhsachnhan', require('./routes/studio/danhSachNhan'));
app.use('/danhsachtuchoi', require('./routes/studio/danhSachTuChoi'));
app.use('/timkiem', require('./routes/trangchu/timkiem'));
app.use('/dsdon', require('./routes/trangchu/dsdon'));
app.use('/xoadondat', require('./routes/trangchu/xoadondat'));
app.use('/quanlitaikhoan', require('./routes/admin/quanlitaikhoan'));
app.use('/quanlistudio', require('./routes/admin/quanlistudio'));

app.use('/xemstudio', require('./routes/guess/xemstudio'));
app.use('/xembosuutap', require('./routes/guess/xembosuutap'));
app.use('/xemgoichup', require('./routes/guess/xemgoichup'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log(err.message);
    if (err.status == 404) {
        res.render('error', {
            loi: '404',
            urlBack: "/",
            message: err.message,
            layout: false
        });
    } else {
        res.render('loi', {
            message: err,
            layout: false
        });
    }
});

module.exports = app;