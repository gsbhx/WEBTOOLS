import React, {useEffect, useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css';
import ApiSearch from "./components/ApiSearch";
import ApiList from "./components/ApiList";
import UrlPanel from "./components/Work/UrlPanel";
import ParamsPanel from "./components/Work/ParamsPanel";
import ParamsTitle from "./components/Work/ParamsTitle";
import TabList from "./components/TabList";
import defaultApiLink from "./utils/defaultApiLink";
import useIpcRenderer from "./hooks/useIpcRenderer";
import Tools from "./utils/Tools";
import ResponsePanel from "./components/Work/ResponsePanel";
import Data from "./utils/Data";

const {ipcRenderer, remote} = window.require("electron");

function App() {
    const [apis, setApis] = useState([]);
    const [openedIds, setOpenedIds] = useState([]);
    const [headerStatus, setHeaderStatus] = useState(false);
    const [currentId, setCurrentId] = useState(0);
    const [currentLink, setCurrentLink] = useState({});
    const [currentIndex, setCurrentIndex] = useState(0);
    const [response, setResponse] = useState({});
    const [refresh, setRefresh] = useState(false); //更新数据后重新渲染
    const [tabsNeedUpdate, setTabsNeedUpdate] = useState(true); //tabs表内容更改后重新加载
    const [curNeedUpdate, setCurNeedUpdate] = useState(false); //tabs表内容更改后重新加载
    const [curLinkNeedUpdate, setCurLinkNeedUpdate] = useState(false); //tabs表内容更改后重新加载

    //发送Api请求
    const onSearchButtonClick = () => {
        Tools.sendHttpRequest(currentLink).then((res) => {
            console.log("app,result", res);
            setResponse(res);
        }, err => {
            console.log("app,err", err)
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
        setCurNeedUpdate(true);
    };

    const tabClick = (id) => {
        setCurrentId(id);
        let index = getCurrentIndex(id);
        setCurrentIndex(index);
        setCurrentLink(apis[index]);
        setCurNeedUpdate(true)
    };

    const addNewApi = () => {
        console.log("adNewApi")
        let allApis = apis;
        let lastId = parseInt(allApis[0].id);
        let daf = JSON.parse(JSON.stringify(defaultApiLink));
        daf.id = lastId + 1;
        setCurrentLink(daf);
        console.log("addNewApi defaultApiLink", defaultApiLink, typeof defaultApiLink.headers)
        console.log("addNewApi daf", daf)
        console.log("addNewApi currentLink", currentLink)
        setCurrentIndex(0);
        console.log("addNewApi allApis", allApis)
        setApis(allApis);
        setCurrentId(daf.id);
        setOpenedIds([...openedIds, daf.id]);
        setCurNeedUpdate(true)
        Data.insertRowTab(daf).then(res => {
        });
    };

    const tabClose = (id) => {
        const tabsWithout = openedIds.filter(fileID => fileID !== id)
        setOpenedIds(tabsWithout);
        if (tabsWithout.length > 0) {
            setCurrentId(tabsWithout[0])
        } else {
            setCurrentId('')
        }
        setCurNeedUpdate(true);
    };

    /**
     * 保存Api参数
     * @param url
     * @param method
     * @param params
     * @constructor
     */
    const UpdateThisRow = (url, method, params) => {
        if (Object.keys(currentLink).length === 0) {
            return false;
        }
        let current = currentLink;
        url && (current.url = url);
        method && (current.type = method);
        params && (headerStatus ? current.headers = params : current.params = params)
        setCurrentLink(current);
        let allApis = apis;
        allApis[currentIndex] = current;
        setApis(allApis);
        setCurNeedUpdate(true)
        setCurLinkNeedUpdate(true);

    };
    /**
     * 需要更新currentConfig
     */
    useEffect(() => {
        console.log("正在更新currentConfig");
        const getCurrentConfig = async () => {
            await Data.getCurrentConfig().then(configs => {
                console.log("await current configs", configs);
                setOpenedIds(configs.openedIds)
                setHeaderStatus(configs.headerStatus);
                setCurrentId(configs.currentId);
                setCurrentLink(configs.currentLink);
                setCurrentIndex(configs.currentIndex);
                setCurNeedUpdate(false);
            })
        };
        getCurrentConfig();
    }, []);
    /**
     * 需要更新全局tabs
     */
    useEffect(() => {
        console.log("正在更新allTabs");
        const getAllTabs = async () => {
            await Data.getAllTabs().then(res => {
                setTabsNeedUpdate(false);
                setApis(res)
            });
        }
        if (tabsNeedUpdate === true) {
            getAllTabs();
            setTabsNeedUpdate(false);
        }
    }, [tabsNeedUpdate]);
    useEffect(() => {
        console.log("正在保存CurrentConfig");
        const saveCurrentConfig = async () => {
            setGlobalVariables();
            let configObj = {
                currentIndex: currentIndex,
                currentLink: currentLink,
                currentId: currentId,
                openedIds: openedIds,
                headerStatus: headerStatus,
            };
            await Data.saveCurrentConfig(configObj).then(res => {
            })
        };
        if (curNeedUpdate === true) {
            saveCurrentConfig()
            setCurNeedUpdate(false);
        }

    }, [currentLink, currentId, currentIndex, openedIds, headerStatus]);
    useEffect(() => {
        console.log("正在更新currentLink");
        const currentLinkUpdate = async () => {
            await Data.saveRowTab(currentLink).then(res => {
                setTabsNeedUpdate(true);
            });
        }
        if (curLinkNeedUpdate === true) {
            currentLinkUpdate();
            setCurLinkNeedUpdate(false);
        }
    }, [currentLink])
    /**
     * 数据更改后重新渲染页面
     */
    /*useEffect(() => {
        refresh && setTimeout(() => setRefresh(false));

    }, [refresh]);*/
    /**
     * 将当前焦点数据保存到全局变量
     */
    const setGlobalVariables = () => {
        remote.getGlobal('currentApi').currentLink = currentLink;
        remote.getGlobal('currentApi').currentIndex = currentIndex;
        remote.getGlobal('currentApi').currentId = currentId;
    };
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
                    onTabAdd={addNewApi}
                />
                <UrlPanel
                    currentLink={currentLink}
                    onSaveClick={UpdateThisRow}
                    onSendClick={onSearchButtonClick}
                />
                <ParamsTitle
                    headerStatus={headerStatus}
                    onParamsClick={setHeaderStatus}
                    onChangeHeaderStatus={setCurNeedUpdate}
                />
                <ParamsPanel
                    headerStatus={headerStatus}
                    params={(headerStatus ? ((currentLink && currentLink.headers) || []) : ((currentLink && currentLink.params)) || [])}
                    onSaveClick={UpdateThisRow}
                />
                <ResponsePanel
                    response={response}
                />
            </div>
        </div>
    );
}

export default App;
