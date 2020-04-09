var db = require('./db');
var full_text_search_QS = (key) => `SELECT * , round(MATCH(hoten) AGAINST (N'${key}' IN BOOLEAN MODE),5) diem FROM taikhoan as tk JOIN khach as k ON tk.id=k.id where round(MATCH(hoten) AGAINST (N'${key}' IN BOOLEAN MODE),5)>0  order by diem DESC`;

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
    search: key => db.load(full_text_search_QS(key)),
    block: (id) => db.load(`UPDATE taikhoan SET tinhtrang=0 where id=${id}`),
    unblock: (id) => db.load(`UPDATE taikhoan SET tinhtrang=1 where id=${id}`),
    all: () => db.load('select * from taikhoan tk join khach k on  tk.id=k.id '),
    single: id => db.load(`select * from taikhoan where username = '${id}' `),
    add: entity => db.add('taikhoan', entity),
    update: entity => db.update('user', 'username', entity),
    delete: id => db.delete('user', 'username', id),
    create: () => {
        var obj = new Object();
        obj.id = Date.now();
        obj.username = "";
        obj.password = "";
        obj.loai = 1;
        obj.tinhtrang = 1;
        return obj;
    }
};