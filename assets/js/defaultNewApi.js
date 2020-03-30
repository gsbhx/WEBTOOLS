const defaultOneApi = {
    id: '0',
    title: "请求本地127.0.0.1",
    describtion:"",
    groupid:1,
    type: 'GET',
    url: "http://127.0.0.1",
    headers: [
        {
            status: true,
            values: {
                "key": "content-type",
                "value": "application/x-www-form-urlencoded",
                "describtion": "",
            }
        }
    ],
    params: [
        {
            status: true,
            values: {
                "key": "",
                "value": "",
                "describtion": "",
            }
        }
    ],
    createdAt: parseInt(Date.parse(new Date())/1000)
};