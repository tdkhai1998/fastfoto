var db = require('./db');



var simpleSearchString = (key) => {
    var keys = key.split(" ");
    var sql = ` `;
    sql += ` select * from studio join taikhoan on studio.id=taikhoan.id where taikhoan.tinhtrang=true  and  ( `
    keys.forEach(e => {
        sql += `tenStudio LIKE '%${e}%'  or `;
    })
    sql = sql.substring(0, sql.length - 4) + " ) ";
    return sql;
}
var full_text_search_QS = (key) => `SELECT * , round(MATCH(tenStudio) AGAINST (N'${key}' IN BOOLEAN MODE),5) diem FROM taikhoan as tk JOIN studio  ON tk.id=studio.id where round(MATCH(tenStudio) AGAINST (N'${key}' IN BOOLEAN MODE),5)>0  order by diem DESC`;
module.exports = {
    search: key => db.load(full_text_search_QS(key)),
    simpleSearch: (key, limit, offset) => db.load(simpleSearchString(key) + ` limit ${limit} offset ${offset}`),
    countSimpleSearch: (key) => db.load(simpleSearchString(key)).then(val => val.length),
    all: () => db.load('select * from taikhoan tk join studio s on  tk.id=s.id '),
    block: (id) => db.load(`UPDATE taikhoan SET tinhtrang=0 where id=${id}`),
    unblock: (id) => db.load(`UPDATE taikhoan SET tinhtrang=1 where id=${id}`),
    single: id => db.load(`select * from studio where id = '${id}'`),
    add: entity => db.add('studio', entity),
    update: entity => db.update('studio', 'id', entity),
    delete: id => db.delete('user', 'username', id),
    phantrang: (limit, offset) =>
        db.load(`select * from studio limit ${limit} offset ${offset}`),
    dem: () => db.load(`select count(*) as tong from studio`),
    updatequangcao: entity => db.update('studio', 'id', entity),
    create: () => {
        return new Object();
    }
};