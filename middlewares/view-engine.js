var hbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');
var numeral = require('numeral');
var path = require('path');
var moment = require('moment');

module.exports = function(app) {
    app.engine('hbs', hbs({
        extname: 'hbs',
        defaultLayout: 'main',
        layoutsDir: 'views/layouts/',
        partialsDir: 'views/partials/',
        helpers: {
            formatDate: val => moment(val).format('DD/MM/YYYY HH:mm:ss'),
            section: hbs_sections(),
        }
    }));
    app.set('view engine', 'hbs');
}