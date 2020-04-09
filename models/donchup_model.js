var db = require('./db');
module.exports = {

    all: (id, trangthai) => db.load(`select * from dondatchup, khach, goichup, studio 
    where dondatchup.goichup = goichup.magoi and dondatchup.khachhang = khach.id and
    studio.id = goichup.studio and studio.id = '${id}' and dondatchup.trangthai='${trangthai}' `),
    update2: (id, magoi, ngaydat, trangthai) => db.load(`update dondatchup set trangthai='${trangthai}' where khachhang = '${id}' and goichup ='${magoi}' and ngaydat='${ngaydat}'`),
    add: entity => db.add('donchup', entity),
    update: entity => db.update('user', 'username', entity),
    delete: id => db.delete('user', 'username', id),

    phantrang: (limit, offset) =>
        db.load(`select * from studio limit ${limit} offset ${offset}`),

    dem: () => db.load(`select count(*) as tong from studio`)
};