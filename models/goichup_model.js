var db = require('./db');
module.exports = {

    all: id => db.load(`select * from goichup, studio where goichup.studio = studio.id and studio.id = '${id}' and daxoa = 0`),
    single: id => db.load(`select * from studio where id = '${id}'`),
    add: entity => db.add('goichup', entity),
    update: entity => db.update('goichup', 'magoi', entity),
    delete: id => db.delete('goichup', 'id', id),
    
    phantrang: (limit, offset) =>
        db.load(`select * from studio limit ${limit} offset ${offset}`),

    dem: () => db.load(`select count(*) as tong from studio`),
    datlich: (entity)=> db.add('dondatchup',entity)
};