import SQLDB from "./SQLite";

const Data = {
        getAllSendMethod: () => {
            return [
                '', 'GET', 'POST', 'PUT', 'DELETE'
            ]
        },
        getAllSendMethodType: () => {
            return {
                'GET': 1, 'POST': 2, 'PUT': 3, 'DELETE': 4,
            }
        },
        /**
         * 获取所有的tab
         */
        getAllTabs: () => {
            const db = new SQLDB("Tables.db")
            return new Promise(((resolve, reject) => {
                db.fetchAll('tabs').then(result => {
                    console.log("getAllTabssssssssss result", result)
                    for (let i in result) {
                        result[i].headers = JSON.parse(result[i].headers);
                        result[i].params = JSON.parse(result[i].params);
                        result[i].type=Data.getAllSendMethod()[result[i].type]||'UnKnown'
                    }

                    console.log("getAllTabdddddddddd result", result)
                    resolve(result);
                }, err => {
                    console.log("getAllTabs,err", err);
                });
            }))


        },
        getCurrentConfig: () => {
            let db = new SQLDB("Tables.db");
            return new Promise(((resolve, reject) => {
                var configs = {};
                db.fetchAll('tab_current').then(res => {
                    (async function () {

                        res.forEach(await function (v, k) {
                            let value = v.value
                            if (v.key === 'currentLink' || v.key === 'openedIds') {
                                value = JSON.parse(value)
                            }
                            configs[v.key] = value;
                        })
                        resolve(configs);
                    })();

                })

            }))

        },
        saveCurrentConfig: (params) => {
            let data = JSON.parse(JSON.stringify(params))
            let db = new SQLDB("Tables.db");
            let insertData = [];
            for (let i in data) {
                if (i === 'currentLink' || i === "openedIds") {
                    data[i] = JSON.stringify(data[i]);
                }
                insertData.push({key: i, value: data[i]});
            }
            return new Promise(((resolve, reject) => {
                db.delete(null, 'tab_current').then(res => {
                    (async function () {
                        insertData.forEach(await function (v, k) {
                            db.insert('tab_current', v)
                        })
                    }());
                    resolve(true)

                })
            }))
        },
        getTabById: (id) => {
            let db = new SQLDB("Tables.db");
            return new Promise(((resolve, reject) => {
                db.fetchRow(id, 'tabs').then(res => {
                    res.type = this.getAllSendMethod()[res.type];
                    resolve(res)
                })
            }))
        },
        saveAllTab: (data) => {

            return new Promise((resolve, reject) => {
                data.forEach((v, k) => {
                    Data.saveRowTab(v)
                })
                resolve()
            })

        },
        /**
         * 添加一条信息
         * @param data
         * @returns {Promise<unknown>}
         */
        insertRowTab: (params) => {
            let data = JSON.parse(JSON.stringify(params))
            data.headers = JSON.stringify(data.headers);
            data.params = JSON.stringify(data.params);
            data.type = Data.getAllSendMethodType()[data.type];
            data.create_time = parseInt(new Date().getTime() / 1000);
            const db = new SQLDB("Tables.db");
            console.log("insertRowTab,开始创建Promise")
            return new Promise((resolve, reject) => {
                console.log("insertRowTab,promise 1")
                db.insert('tabs', data).then(res => {
                    console.log("insertRowTab,开始回调")
                    resolve()
                }, err => {
                    console.log("insertRowTab 这里貌似出了点问题……", err)
                })
            })
        },
        /**
         * 更新一条信息
         * @param data
         * @returns {Promise<unknown>}
         */
        saveRowTab: (params) => {
            let data = JSON.parse(JSON.stringify(params))
            console.log("saveRowTabsaveRowTabsaveRowTabsaveRowTab", data)
            data.headers = JSON.stringify(data.headers);
            data.params = JSON.stringify(data.params);
            data.type = Data.getAllSendMethodType()[data.type];
            const db = new SQLDB("Tables.db");
            return new Promise((resolve, reject) => {
                let where = `id=${data.id}`;
                db.update('tabs', data, where).then(res => {
                    resolve()
                })
            })
        },

    }
;
export default Data;