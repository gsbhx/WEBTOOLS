function saveToStore() {
    console.log("已保存到store");
    apis[currentIndex] = currentLink;
    store.set("apis", apis);
}

function setApiList() {
    console.log("正在执行 setApiList");
    let node = '';
    apis.map((v, k) => {
        let text_danger = v.id == currentId ? 'text-danger' : '';
        node += `
            <li class="list-group-item d-flex align-items-center  justify-content-around link-item  ` + text_danger + `" data-key="` + v.id + `">
                <span class="text-success  font-weight-bold align-text-top border-1 apiType"> ` + v.type + `</span>
                <span class="text-black-60 apiTitle"> ` + v.title + `</span>
            </li>`
    });
    $(".link-list").empty().append(node);
}

function setTabList() {
    let node = '';
    apis.forEach((v) => {
        if (openedIds.includes(parseInt(v.id))) {
            let active = v.id === currentId ? 'active' : '';
            node += `
            <li class="nav-item border-2  tab-item ` + active + `">
                <a href="#" class="nav-link" >
                    <span class="tab-item-title" data-key="` + v.id + `" > ` + v.title + `</span>
                    <span class="ml-2 tab-item-close" data-key="` + v.id + `" ><i class="fa fa-times"> </i></span>
                </a>
            </li>
            `
        }
    });
    node += `<li class="nav-item add-api-btn">
                <a href="#" class="nav-link active small" >
                    <i class="fa fa-plus"> </i>
                </a>

            </li>`;
    $(".tab-list").empty().append(node);

}

function setUrlPanel() {
    let node = `<div class="input-group-prepend"> <select class="custom-select bg-light" name="type" >`;
    methodTypes.forEach(v => {
        let selecte = (currentLink && currentLink.type || 'GET') === v ? "selected" : "";
        node += `<option value="` + v + `" ` + selecte + `> ` + v + ` </option>`
    });
    node += ` </select></div>
        <input type="text" name="url" class="form-control" value="` + ((currentLink && currentLink.url) || '127.0.0.1') + `" />
        <div class="input-group-append mr-3">
            <button class="btn btn-outline-secondary btn-primary text-white send-http-request" type="button" >发送</button>
        </div></div>`;
    $(".url-panel-main").empty().append(node);


}

function setParams() {
    $(document).find(".params-header").text("(" + ((currentLink && currentLink.headers.length) || 0) + ")");
    $(document).find(".params-body").text("(" + ((currentLink && currentLink.params.length) || 0) + ")");
    let node = `
        <div class="row">
                <div class="col-11">
                    <div class="form-row mb-3 d-flex align-items-center text-center">
                        <div class="col-1">
                        </div>
                        <div class="col">
                            参数名
                        </div>
                        <div class="col">
                            参数值
                        </div>
                        <div class="col">
                            描述
                        </div>
                    </div>
                </div>
                <div class="col-1">
                    <span>操作</span>
                </div>
            </div>`;
    let params = isHeaderShow ? currentLink.headers : currentLink.params;
    params.forEach((v, k) => {
        isChecked = v.status === true ? "checked" : '';
        console.log("isChecked is ", isChecked);
        node +=
            `
                <div class="row mb-1" data-index="` + k + `">
             
                <div class="col-11">
                    <div class="form-row">
                        <div class="col-1">
                            <div class="checkbox checkbox-primary">
                                <input id="checkboxId` + k + `" class="styled" type="checkbox" ` + isChecked + `>
                                <label for="checkboxId` + k + `"> </label>
                            </div>
                        </div>
                        <div class="col">
                            <input type="text" name="key" value="` + v.values.key + `" class="form-control form-control-sm"/>
                        </div>
                        <div class="col">
                            <input type="text" name="value" value="` + v.values.value + `" class="form-control form-control-sm"/>
                        </div>
                        <div class="col">
                            <input type="text" name="describtion" value="` + v.values.describtion + `" class="form-control form-control-sm"/>
                        </div>
                    </div>
                </div>
                <div class="col-1">
                    <a href="#" class=" bg-light">
                        <i class="fa fa-trash"> </i> 
                    </a>
                </div>
            </div>
                `;
    });


    node += ` <div class="row mb-1 add-params-btn">
                <div class="col-11">
                    <div class="form-row">
                        <div class="col-1"></div>
                        <div class="col ">
                            <button style=" background-color:#007bff30 " type="button" class="btn btn-default border form-control btn-sm"><i class="fa fa-plus"> </i></button>
                        </div>
                    </div>
                </div>
                <div class="col-1"></div>
            </div>
    `;
    $("#params").empty().append(node);
}

function setCurrent(id, need = true) {
    id = parseInt(id);
    let index;
    if (id === 0) {
        $(document).find(".add-api-btn").trigger('click');
    }

    for (let i in apis) {
        console.log("api id", apis[i].id);
        if (parseInt(apis[i].id) === id) {
            index = i;
            break;
        }
    }
    currentId = id;
    currentIndex = parseInt(index);
    if (need) {
        if (!openedIds.includes(id)) {
            openedIds = [...openedIds, id]
        }
    }
    currentLink = apis[currentIndex];
    console.log("setCurrent", id, index,openedIds,currentIndex,currentLink);
    setGlobalVariables();
    return true;
}

function setGlobalVariables() {
    remote.getGlobal('currentApi').currentLink = currentLink;
    remote.getGlobal('currentApi').currentIndex = currentIndex;
    remote.getGlobal('currentApi').currentId = currentId;
}


function setResponse(){
    $("#result").html("");
}




