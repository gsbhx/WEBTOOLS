import React, {useEffect, useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css';
import ApiSearch from "./components/ApiSearch";
// import DefaultLink from './utils/DefaultLink'
import ApiList from "./components/ApiList";
import UrlPanel from "./components/Work/UrlPanel";
import ParamsPanel from "./components/Work/ParamsPanel";
import ParamsTitle from "./components/Work/ParamsTitle";
import TabList from "./components/TabList";
import useIpcRenderer from "./hooks/useIpcRenderer";
import Tools from "./utils/Tools";
import ResponsePanel from "./components/Work/ResponsePanel";
const Store = window.require('electron-store');
const { ipcRenderer,remote }=window.require("electron");
const apiStore = new Store({'name': 'Files Data'});
const configStore = new Store({"name": 'Config Data'});
// apiStore.set("apis", DefaultLink);

function App() {
    const [apis, setApis] = useState(apiStore.get('apis') || {});
    //插入默认的config
    // let configObj = {
    //     currentIndex: 0,
    //     currentLink: apis[0],
    //     currentId: apis[0].id,
    //     openedIds: [],
    //     isHeaderShow: 0,
    // };
    // configStore.set("config", configObj);
    const [refresh,setRefresh] = useState(false);
    var configs = configStore.get('config');
    const [openedIds, setOpenedIds] = useState(configs.openedIds);
    const [isHeaderShow, setIsHeaderShow] = useState(configs.isHeaderShow);
    const [currentId, setCurrentId] = useState(configs.currentId);
    const [currentLink, setCurrentLink] = useState(configs.currentLink);
    const [currentIndex, setCurrentIndex] = useState(configs.currentIndex);
    const [response,setResponse]=useState({});
    const onSearchButtonClick=()=>{
        Tools.sendHttpRequest(currentLink).then((res)=>{
            console.log("app,result",res);
            setResponse(res);
        },err=>{
            console.log("app,err",err)
            setResponse(err);
        })
    };
    const getCurrentIndex = (id) => {
        let index;
        for (let i in apis) {
            if (apis[i].id === id) {
                index = i;
            }
        }
        return index;
    };
    /**
     * 点击列表中的某个api
     * @param id
     */
    const onLinkClick = (id) => {
        // set current active file
        setCurrentId(id);
        let index = getCurrentIndex(id);
        setCurrentIndex(index);
        setCurrentLink(apis[index]);
        if (!openedIds.includes(id)) {
            setOpenedIds([...openedIds, id])
        }
        saveCurrentConfig()
    };

    const tabClick = (id) => {
        setCurrentId(id);
        let index = getCurrentIndex(id);
        setCurrentIndex(index);
        setCurrentLink(apis[index]);
        saveCurrentConfig()
    };

    const saveCurrentConfig = () => {
        setGlobalVariables();
        let configObj = {
            currentIndex: currentIndex,
            currentLink: currentLink,
            currentId: currentId,
            openedIds: openedIds,
            isHeaderShow: isHeaderShow,
        };
        configStore.set("config", configObj);

    };

    const tabClose = (id) => {
        const tabsWithout = openedIds.filter(fileID => fileID !== id)
        setOpenedIds(tabsWithout);
        if (tabsWithout.length > 0) {
            setCurrentId(tabsWithout[0])
        } else {
            setCurrentId('')
        }
        saveCurrentConfig()
    };

    /**
     * 保存Api参数
     * @param url
     * @param method
     * @param params
     * @constructor
     */
    const UpdateThisRow = (url, method, params) => {
        console.log("first current", currentIndex, currentLink, params)
        if (Object.keys(currentLink).length === 0) {
            return false;
        }

        let current = currentLink;
        if (url) {
            current.url = url;
        }
        if (method) {
            current.type = method;
        }
        if (params) {
            if (isHeaderShow) {
                current.headers = params;
            } else {
                current.params = params;
            }
        }
        setCurrentLink(current);
        let allApis = apis;
        allApis[currentIndex] = current;
        setApis(allApis);
        saveToStore();
        setRefresh(true);
        console.log('fileStore.get("files")', apiStore.get("apis"));

    };

    useIpcRenderer({
        'save-current-api': e => saveCurrentApi(e),
        'main-window-will-close': e => mainWindowWillClose(e),
        'ready-to-save-api': (e, data) => readyToSaveApi(e, data)
    });
    const mainWindowWillClose = (e) => {
        let configObj = {
            currentIndex: currentIndex || 0,
            currentLink: currentLink || apis[currentIndex],
            currentId: currentId || currentLink.id,
            openedIds: openedIds || [],
            isHeaderShow: isHeaderShow || 0,
        };
        configStore.set("config", configObj);

    };
    const saveCurrentApi = (e) => {
        ipcRenderer.send("open-save-window");
    };

    const readyToSaveApi = (e, data) => {
        currentLink.title = data.title;
        currentLink.describtion = data.describtion;
        currentLink.group = data.group_id;
        saveToStore();
        ipcRenderer.send("api-save-ok");
    };

    const saveToStore = () => {
        console.log("已保存到store");
        apis[currentIndex] = currentLink;
        apiStore.set("apis", apis);
        setRefresh(true);
    };
    useEffect(()=>{
        refresh &&setTimeout(()=>setRefresh(false));

    },[refresh]);

    const setGlobalVariables=()=> {
        remote.getGlobal('currentApi').currentLink = currentLink;
        remote.getGlobal('currentApi').currentIndex = currentIndex;
        remote.getGlobal('currentApi').currentId = currentId;
    }

    return (
        <div className="row" style={{height: "100%"}}>
            <div className="col-4 border-right">
                <ApiSearch
                    title="请输入要搜索的内容..."
                />
                <ApiList
                    apis={apis}
                    onLinkOpen={onLinkClick}
                    activeId={currentId}
                />
            </div>
            <div className="col-8 border-left">
                <TabList
                    files={apis}
                    openedIds={openedIds}
                    activeId={currentId}
                    onTabClick={tabClick}
                    onTabClose={tabClose}
                />
                <UrlPanel
                    currentLink={currentLink}
                    onSaveClick={UpdateThisRow}
                    onSendClick={onSearchButtonClick}
                />
                <ParamsTitle
                    isHeaderShow={isHeaderShow}
                    onParamsClick={setIsHeaderShow}
                />
                <ParamsPanel
                    isHeaderShow={isHeaderShow}
                    params={(isHeaderShow ? ((currentLink && currentLink.headers) || []) : ((currentLink && currentLink.params)) || [])}
                    onSaveClick={UpdateThisRow}
                />
                <ResponsePanel
                    response={response}
                    responseType="json"
                />
            </div>
        </div>
    );
}

export default App;
