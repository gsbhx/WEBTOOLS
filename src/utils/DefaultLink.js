const defaultLink = [
    {
        id: 1,
        title: "请求本地127.0.0.1",
        describtion:"",
        groupid:1,
        type: 'GET',
        url: "http://127.0.0.1",
        isUnsaved:false,
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
        params: [{
            status: true,
            values: {
                "key": "name",
                "value": "小红",
                "describtion": "",
            }
        }

        ],
        createdAt: 1563762965704
    },
    {
        id: 2,
        title: "请求本地127.0.0.2",
        describtion:"",
        groupid:1,
        type: 'POST',
        url: "http://127.0.0.2",
        isUnsaved:false,
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
                    "key": "name",
                    "value": "小红",
                    "describtion": "",
                }
            }
        ],
        createdAt: 1563762965704
    },
    {
        id: 3,
        title: "请求本地127.0.0.3",
        describtion:"",
        groupid:1,
        type: 'DELETE',
        url: "http://127.0.0.3",
        isUnsaved:false,
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
                    "key": "name",
                    "value": "小红",
                    "describtion": "",
                }
            }
        ],
        createdAt: 1563762965704
    },
    {
        id: 4,
        title: "请求本地127.0.0.4",
        describtion:"",
        groupid:1,
        type: 'PUT',
        url: "http://127.0.0.4",
        isUnsaved:false,
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
                    "key": "name",
                    "value": "小红",
                    "describtion": "",
                }
            }
        ],
        createdAt: 1563762965704
    }
];

export default defaultLink