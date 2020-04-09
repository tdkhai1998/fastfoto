var db = require('./db');
module.exports = {
    mapping: id => {
        return Promise.all([db.load(`select ten`), db.load(`select  tenTag from thuoctag tg join tag t on (tg.idTag=t.idTag and tg.idBaiViet=${id})`)]).then(value => {
            value[0][0].tenTag = [];
            value[1].forEach(element => {
                value[0][0].tenTag.push(element.tenTag);
            });
            value[0][0].ngayDang2 = value[0][0].ngayDang.getDate() + "/" + value[0][0].ngayDang.getMonth() + 1 + "/" + value[0][0].ngayDang.getFullYear();
            console.log(value[0][0].ngayDang2);
            return value[0][0];
        })
    },
    all: () => db.load('select * from us.er'),
    single: id => db.load(`select * from khach where id = ${id}`),
    add: entity => db.add('khach', entity),
    update: entity => db.update('khach', 'id', entity),
    delete: id => db.delete('user', 'username', id),
    create: () => {
        var obj = new Object();
        obj.id = Date.now();
        obj.hoten = "";
        obj.email = "";
        obj.ngaysinh = "";
        obj.sodienthoai = "";
        obj.facebook = "";

        return obj;
    }
};