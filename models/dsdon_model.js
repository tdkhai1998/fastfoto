var db = require('./db');
module.exports = {
    getAll: (idNguoiDung) => db.load(`select * from dondatchup ddc  join goichup gc on gc.magoi=ddc.goichup join studio st on st.id=gc.studio where ddc.daxoa=false and khachhang=${idNguoiDung}`),
    xoaDonChup: (kc) => db.load(`UPDATE dondatchup SET daxoa=1 where khachhang=${kc.khachhang} and goichup=${kc.goichup} and ngaydat='${kc.ngaydat}'`),
}