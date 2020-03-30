/**
 * 发送http请求
 * @param data
 * @returns {Promise<unknown>}
 */
function sendHttpRequest(data) {
    let params={};
    let headers={};
    console.log(data);
    for(let i in data.params){
        params[data.params[i]['values']['key']]=data.params[i]['values']['value'];
    }
    for(let i in data.headers){
        headers[data.headers[i]['values']['key']]=data.headers[i]['values']['value'];
    }
    return new Promise((resolve, reject) => {
        $.ajax({
            type: data.type,
            data: params,
            url: data.url,
            dataType: 'json',
            beforeSend: function(request) {
                for(let i in headers){
                    request.setRequestHeader(i,headers[i]);
                }
            },
            success: res => {
                    typeof resolve === 'function' && resolve(res);
            },
            error: err => {
                console.log(err);
                typeof reject === 'function' && reject(err.statusText);
            }
        });
    });
}

/**
 * 美化Json字符串
 * @param json
 * @returns {string}
 */
function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function(match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        }
    );
}