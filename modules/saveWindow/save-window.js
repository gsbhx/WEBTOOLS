const Store=require("electron-store");
const {remote,ipcRenderer}=require("electron");
const groupStore = new Store({"name":"groups"});
var groupList=groupStore.get("groups")||DefaultGroups;
var currentLink=remote.getGlobal('currentApi').currentLink;
console.log("currentLink is ",currentLink);

$(document).ready(function () {
    //加载分组信息
    setInfos();
    //保存
    $(document).on('click','.save-api-info',function () {
        let info={};
        info.title=$(document).find(".api-title").val();
        info.describtion=$(document).find(".api-desc").val();
        info.group_id=$(document).find(".api-group").val();
        ipcRenderer.send("ready-to-save-api",info);

    })
});

function setInfos(){
    $(document).find(".api-title").val(currentLink.title);
    $(document).find(".api-desc").text(currentLink.describtion);
    let node='';
    groupList.map((v,k)=>{
        let checked= (currentLink.groupid==v.id) ? 'checked':'';
        node+=`<option value="`+v.id+`" `+checked+`>`+v.name+` </option>`
    });
    $(".group-list").empty().append(node);
}