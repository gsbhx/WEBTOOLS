import React, {useEffect, useState} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css';
import ApiSearch from "./components/ApiSearch";
import ApiList from "./components/ApiList";
import TabList from "./components/TabList";
import ResponsePanel from "./components/Work/ResponsePanel";
import Data from "./utils/Data";
import ParamsPaneNew from "./components/Work/ParamsPanelNew";

const {ipcRenderer, remote} = window.require("electron");

function App() {
    const [openedIds, setOpenedIds] = useState([]);
    const [currentId,setCurrentId]=useState(0);
    const [response, setResponse] = useState({});
    const [currentConfigNeedUpdate, setCurrentConfigNeedUpdate] = useState(false); //焦点数据是否需要更新的状态
    const [refresh,setRefresh]=useState(false);
    /**
     * 点击列表中的某个api
     * @param id
     */
    const onTabClick = (id) => {
        setCurrentId(id);
        if (!openedIds.includes(id)) {
            setOpenedIds([...openedIds, id])
        }
        setCurrentConfigNeedUpdate(true);

    };


    const tabClose = (id) => {
        const tabsWithout = openedIds.filter(tabId => tabId !== id)
        setOpenedIds(tabsWithout);
        if (tabsWithout.length > 0) {
            setCurrentId(tabsWithout[0])
        } else {
            setCurrentId('')
        }
        setCurrentConfigNeedUpdate(true);
    };
    /**
     * 需要更新currentConfig
     */
    useEffect(() => {
        console.log("正在更新currentConfig");
        const getCurrentConfig = async () => {
            await Data.getCurrentConfig().then(configs => {
                console.log("await current configs", configs);
                setOpenedIds(configs.openedIds);
                setCurrentId(configs.currentId);
                setCurrentConfigNeedUpdate(false);
            })
        };
        getCurrentConfig();
    }, []);


    /**
     * 更新当前的配置
     */
    useEffect(() => {
        console.log("正在保存CurrentConfig");
        const saveCurrentConfig = async () => {
            setGlobalVariables();
            let configObj = {
                openedIds: openedIds,
                currentId:currentId,
            };
            await Data.saveCurrentConfig(configObj).then(res => {
            })
        };
        if (currentConfigNeedUpdate === true) {
            saveCurrentConfig()
            setCurrentConfigNeedUpdate(false);
        }

    }, [currentConfigNeedUpdate]);
    /**
     * 数据更改后重新渲染页面
     */
    useEffect(() => {
        refresh && setTimeout(() => setRefresh(false));

    }, [refresh]);
    /**
     * 将当前焦点数据保存到全局变量
     */
    const setGlobalVariables = () => {
        remote.getGlobal('currentApi').currentId = currentId;
    };
    return (
        <div className="row" style={{height: "100%"}}>
            <div className="col-4 border-right">
                <ApiSearch
                    title="请输入要搜索的内容..."
                />
                <ApiList
                    onTabClick={onTabClick}
                    currentId={currentId}
                />
            </div>
            <div className="col-8 border-left">
                <TabList
                    openedIds={openedIds}
                    onTabClick={onTabClick}
                    onTabClose={tabClose}
                    currentId={currentId}
                />
                <ParamsPaneNew
                    id={currentId}
                    setResponse={setResponse}
                />
                <ResponsePanel
                    response={response}
                />

            </div>
        </div>
    );
}

export default App;
