const Store = require('electron-store');
const store = new Store({"name":"apiData"});
const configStore=new Store({"name":"configData"});
const {remote,ipcMain,ipcRenderer,BrowserWindow}=require("electron");
// store.set("apis",defaultLink);
var apis = store.get("apis") || [];
/*let configObj={
    currentIndex:0,
    currentLink:apis[0],
    currentId:apis[0].id,
    openedIds:[],
    isHeaderShow:0,
};
configStore.set("config",configObj);*/
var configs=configStore.get("config")||{};
console.log("api,config",apis,configs);

ipcRenderer.on("main-window-will-close",(e)=>{
    let configObj={
        currentIndex:currentIndex||0,
        currentLink:currentLink||apis[currentIndex],
        currentId:currentId||currentLink.id,
        openedIds:openedIds||[],
        isHeaderShow:isHeaderShow||0,
    };
    configStore.set("config",configObj);

});
ipcRenderer.on("save-current-api",(e)=>{
    ipcRenderer.send("open-save-window",{currentLink: currentLink});
});

ipcRenderer.on("ready-to-save-api",(e,data)=>{
    currentLink.title=data.title;
    currentLink.describtion=data.describtion;
    currentLink.group=data.group_id;
    saveToStore();
    setApiList();
    ipcRenderer.send("api-save-ok");
});


var openedIds = configs.openedIds;
console.log("openedIds============",openedIds);
var currentIndex = configs.currentIndex;
var currentLink = configs.currentLink ;
var currentId = configs.currentId;
var isHeaderShow = configs.isHeaderShow;
const methodTypes = ['GET', 'POST', 'PUT', 'DELETE'];
$(document).ready(function () {
    console.log("first ",currentLink,currentIndex,currentId);
    setApiList();
    setUrlPanel();
    setTabList();
    setUrlPanel();
    setParams();
    setResponse();
    setGlobalVariables();
    //点击标签时变红
    $(document).on("click", '.link-list .link-item,.tab-item .tab-item-title', function () {
        setCurrent($(this).data("key"));
        setApiList();
        setTabList();
        setUrlPanel();
        setParams();
        setResponse();

    });
    //关闭标签时
    $(document).on("click",".tab-item .tab-item-close",function () {
       let id=parseInt($(this).data("key"));
       console.log("id================",id);
        openedIds = openedIds.filter(aId => {
            return aId != id;
        });
        console.log("close openedids11111========",openedIds);
        if (openedIds.length > 0) {
            setCurrent(id,false);
        } else {
            setCurrent(0)
        }
        console.log("close openedids========",openedIds);
        setApiList();
        setTabList();
        setUrlPanel();
        setParams();
    });
    //添加一行参数
    $(document).on("click", ".add-params-btn", function () {

        let params = isHeaderShow ? currentLink.headers : currentLink.params;

        if (params.length === 0 || (params && (params[params.length - 1].key !== '' && params[params.length - 1].value !== ''))) {
            params.push({status:true,values:{key: "", value: "", describtion: ""}});
        } else {
            return false;
        }
        setParams();
    });
    //点击切换header和params
    $(document).on("click", ".params-title", function () {
        $(document).find(".params-title").removeClass("active");
        $(this).addClass("active");
        let status = parseInt($(this).data('status'));
        if (status !== isHeaderShow) {
            isHeaderShow = status;
            setParams();
        }
    });

    //保存更改的参数
    //urlPanel select
    $(document).on("change", ".url-panel-main select", function () {
        console.log("url-panel", $(this));
        let name = $(this).attr("name");
        console.log("")
        currentLink[name] = $(this).val();
        saveToStore();
        setApiList()
    });
    //urlPanel input
    $(document).on("input", ".url-panel-main input", function () {
        console.log("url-panel", $(this));
        let name = $(this).attr("name");
        currentLink[name] = $(this).val();
        console.log("now curr is ", currentLink);
        saveToStore();
        setApiList();
    });
    $(document).on('input', "#params input[type='text']", function () {
        let name = $(this).attr("name");
        let value = $(this).val();
        let index = $(this).parents(".row").data('index');
        let isChecked=$(this).parents(".row").find("input[type='checkbox']").attr("checked");
        let key = isHeaderShow ? 'headers' : 'params';
        console.log("currentLink================",currentLink,key,index,name);
        currentLink[key][index]['values'][name] = value;
        currentLink[key][index]['status'] = !!isChecked;
    });
    //失去焦点后将内容保存到store中
    $(document).on("blur", "#params input", function () {
        saveToStore();
        setApiList();
    });

    //点击添加一个面板
    $(document).on("click", ".add-api-btn", function () {
        console.log("..add-api-btn is clicked");
        let lastId = apis[apis.length - 1].id;
        let newApi = defaultOneApi;
        newApi.id = parseInt(lastId) + 1;
        apis.push(newApi);
        saveToStore();
        setCurrent(newApi.id);
        setApiList();
        setTabList();
        setUrlPanel();
        setParams();
        setResponse();

    });

    $(document).on("click",".send-http-request",function () {
        sendHttpRequest(currentLink).then((res)=>{
            console.log("res",res)
            $(".response-area #result").JSONView(res,{collapsed: false,strict:true,escape:true});
        },err=>{
            $(".response-area").text(err);
        })
    })
});





