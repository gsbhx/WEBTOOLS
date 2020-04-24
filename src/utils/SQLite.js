const SQLite3 = window.require("sqlite3").verbose();

class SQLDB {
    constructor(dbName) {
        this._db = new SQLite3.Database(dbName);
    }

    query(sql, param = []) {
        return new Promise(((resolve, reject) => {
            this._db.all(sql, param, (err, res) => {
                if (err) {
                    console.log("sqlErr:", err)
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        }))

    };

    execute(sql, param = []) {
        return new Promise(((resolve, reject) => {
            this._db.run(sql, param, (err) => {
                if (err) {
                    console.log("execute err:", err)
                    reject(err)
                } else
                    resolve(this)
            })
        }))
    };



    update(table, data, where) {

        let where_info = this.getWhere(data);
        console.log("where_info", where_info)
        var sql = "UPDATE " + table + " SET " + where_info.sql;
        if (where) {
            sql += " WHERE " + where;
        }
        return new Promise(((resolve, reject) => {
            this.execute(sql, where_info.param).then(res => {
                resolve(res.changes);
            }, err => {
                console.log("update err", err)
                reject(false);
            });
        }))

    }

    insert(table, data, where) {
        delete data.id;
        let keys = Object.keys(data).join(",");
        let values = Object.values(data)
        for (let i in values) {
            values[i] = "'" + values[i] + "'";
        }

        values = values.join(",");
        let sql = ` insert into ${table} (${keys}) values (${values})`;
        return new Promise(((resolve, reject) => {
            this.execute(sql, [], res => {
                console.log("insert res", res);
                resolve(res);
            }, err => {
                console.log("insert ERR", err)
                reject(err);
            })
        }))


    };

    delete(where, table) {
        let sql = `DELETE FROM ${table}`;
        if (where) {
            sql += " where " + where;
        }
        return new Promise(((resolve) => {
            this.execute(sql, []).then(res => {
                resolve(res);
            })
        }))
    }

    fetchRow(id, table) {
        let sql = `select * from ${table} where id=?`
        return new Promise(((resolve, reject) => {
            this.query(sql, [id]).then(res => {
                console.log("fetchAll res", res)
                resolve(res);
            }, err => {
                console.log("fetchALL ERR", err)
                reject(false);
            })
        }))
    }

    fetchAll(table) {
        let sql = `select * from ${table} ORDER BY id DESC`;
        return new Promise(((resolve, reject) => {
            this.query(sql, []).then(res => {
                console.log("fetchAll res", res)
                resolve(res);
            }, err => {
                console.log("fetchALL ERR", err)
                reject(false);
            })
        }))

    }

    /**
     * 组装查询条件
     */
    getWhere(data) {
        var whereData = [];
        if (typeof data === 'object') {
            for (let i in data) {
                whereData.push(i + "='" + (typeof data[i] === 'object' ? JSON.stringify(data[i]) : data[i]) + "'");
            }
        }
        return {sql: whereData.join(' , '), param: []};
    }
}

export default SQLDB;
