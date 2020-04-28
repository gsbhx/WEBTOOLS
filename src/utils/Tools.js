import $ from 'jquery'

const Tools = {
    /**
     * 发送http请求
     * @param data
     * @returns {Promise<unknown>}
     */
    sendHttpRequest: (data) => {
        let params = {};
        let headers = {};
        for (let i in data.params) {
            if (data.params[i].status === true)
                params[data.params[i]['values']['key']] = data.params[i]['values']['value'];
        }
        for (let i in data.headers) {
            if (data.headers[i].status === true)
                headers[data.headers[i]['values']['key']] = data.headers[i]['values']['value'];
        }

        console.log("Tools params,headers", params, headers);
        return new Promise((resolve, reject) => {
            $.ajax({
                type: data.type,
                data: params,
                url: data.url,
                dataType: 'json',
                beforeSend: function (request) {
                    for (let i in headers) {
                        request.setRequestHeader(i, headers[i]);
                    }
                },
                success: res => {
                    resolve(res);
                },
                error: err => {
                    console.log(err);
                    reject({"error": err.statusText});
                }
            });
        });
    },
    urlEncode: (param) => {
        let str = '';
        for (let i in param) {
            str += '&' + i + '=' + param[i];

        }

        return str.slice(1);
    },
    isJSON: (str) => {
        if (typeof str == 'string') {
            try {
                return (typeof JSON.parse(str) == 'object')
            } catch (e) {
                return false;
            }
        }
    }
};
export default Tools;
