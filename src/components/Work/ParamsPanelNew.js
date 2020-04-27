import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes, faPlus} from '@fortawesome/free-solid-svg-icons';
import "./ParamPanel.scss"
import Data from "../../utils/Data";
import Tools from "../../utils/Tools";

const ParamsPanelNew = ({id,setResponse}) => {
    const methodTypes = ['GET', 'POST', 'PUT', 'DELETE'];
    const [headerStatus,setHeaderStatus]=useState(false);
    const [tab, setTab] = useState(null);
    const [paramName, setParamName] = useState(null);
    const [needTabToSave, setNeedTabToSave] = useState(false);
    /**
     * 初始加载内容
     */
    useEffect(() => {
        const getOneRowById = async () => {
            console.log("ParamsPanelTwo getOneRowById")
            await Data.getTabById(id).then(res => {
                setTab(res);
                headerStatus ? setParamName("headers") : setParamName("params");
            })
        };
        if (id !== 0)
            getOneRowById();
    }, [id, headerStatus]);
    /**
     * 如果内容有变更，保存变更到数据库
     */
    useEffect(() => {
        const saveRowTab = async () => {
            await Data.saveRowTab(tab).then(res => {

            })
        }
        if (needTabToSave === true) {
            saveRowTab();
            setNeedTabToSave(false);
        }
    }, [needTabToSave])


    const appendANewList = (e) => {
        let tabCopy = JSON.parse(JSON.stringify(tab));
        if (tabCopy[paramName].length === 0) {
            tabCopy[paramName].push({status: true, values: {key: "", value: "", describtion: ""}});
            setTab(tabCopy);
            setNeedTabToSave(true);
            return
        }

        if (tabCopy[paramName][tabCopy[paramName].length - 1].key === '' || !tabCopy[paramName][tabCopy[paramName].length - 1].value === '') {
            return
        }
        tabCopy[paramName].push({status: true, values: {key: "", value: "", describtion: ""}});
        setTab(tabCopy);
        setNeedTabToSave(true);
    };
    const onCheckBoxValueChange = (e) => {
        let key = parseInt(e.target.getAttribute('data-key'));
        let tabCopy = JSON.parse(JSON.stringify(tab));
        tabCopy[paramName][key].status = e.target.checked;
        setTab(tabCopy);
        setNeedTabToSave(true);
    };
    const onInputValueChange = (e) => {
        let key = parseInt(e.target.getAttribute('data-key'));
        let tabCopy = JSON.parse(JSON.stringify(tab));
        tabCopy[paramName][key]['values'][e.target.name] = e.target.value;
        setTab(tabCopy);
        setNeedTabToSave(true);
    };
    const deleteOneRow = (e) => {
        let key = parseInt(e.currentTarget.getAttribute('data-key'));
        let tabCopy = JSON.parse(JSON.stringify(tab));
        tabCopy[paramName].splice(key, 1);
        setTab(tabCopy);
        setNeedTabToSave(true);
    };
    const setTabUrlAndMethod=(e)=>{
        let key = e.currentTarget.getAttribute('name');
        let tabCopy = JSON.parse(JSON.stringify(tab));
        tabCopy[key]=e.currentTarget.value;
        setTab(tabCopy);
        setNeedTabToSave(true);
    }
    const getParams = () => {
        let res = tab === null ? [] : (headerStatus ? tab.headers : tab.params);
        console.log("ParamsPanelTwo getParams", res, tab);
        return res;
    }

    //发送Api请求
    const onSearchButtonClick = () => {
        Tools.sendHttpRequest(tab).then((res) => {
            console.log("app,result", res);
            setResponse(res);
        }, err => {
            console.log("app,err", err)
            setResponse(err);
        })
    };
    return (
        <>

            <div className="input-group mb-2" key={tab && tab.id}>
                <div className="input-group-prepend">
                    <select className="custom-select bg-light" name="type" defaultValue={tab && tab.type}
                            onChange={(e) => {
                                setTabUrlAndMethod(e)
                            }}>
                        {
                            methodTypes.map((v, k) => {
                                return (
                                    <option key={k} value={v}>{v}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <input
                    type="text"
                    name="url"
                    className="form-control"
                    defaultValue={tab && tab.url}
                    onChange={(e) => setTabUrlAndMethod(e)}
                />
                <div className="input-group-append mr-3">
                    <button className="btn btn-outline-secondary btn-primary text-white" type="button"
                        onClick={onSearchButtonClick}
                    >发送
                    </button>
                </div>
            </div>
            <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                <span className={(headerStatus ? "active" : "") + " nav-link"} onClick={() => {
                    setHeaderStatus(true)
                }}>Headers</span>
                </li>
                <li className="nav-item">
                <span className={(headerStatus ? "" : "active") + " nav-link"} onClick={() => {
                    setHeaderStatus(false);
                }}>Body</span>
                </li>
            </ul>
            <form id="params">
                <div className="row">
                    <div className="col-11">
                        <div className="form-row mb-3 d-flex align-items-center text-center">
                            <div className="col-1">
                                选择
                            </div>
                            <div className="col">
                                参数名
                            </div>
                            <div className="col">
                                参数值
                            </div>
                            <div className="col">
                                描述
                            </div>
                        </div>
                    </div>
                    <div className="col-1">
                    </div>
                </div>
                {
                    (getParams()).map((v, k) => {
                        return (
                            <div className="row mb-1 d-flex align-items-center params-row" data-key={k} key={k}>
                                <div className="col-11">
                                    <div className="form-row">
                                        <div className="col-1">
                                            <input type="checkbox" data-key={k} checked={v.status}
                                                   className="form-control"
                                                   onChange={e => onCheckBoxValueChange(e)}
                                            />
                                        </div>
                                        <div className="col">
                                            <input
                                                type="text"
                                                name="key"
                                                data-key={k}
                                                value={v.values.key}
                                                className="form-control "
                                                onChange={(e) => onInputValueChange(e)}
                                            />
                                        </div>
                                        <div className="col">
                                            <input
                                                type="text"
                                                name="value"
                                                data-key={k}
                                                value={v.values.value}
                                                className="form-control"
                                                onChange={(e) => onInputValueChange(e)}
                                            />
                                        </div>
                                        <div className="col">
                                            <input
                                                type="text"
                                                name="describtion"
                                                data-key={k}
                                                value={v.values.describtion}
                                                className="form-control"
                                                onChange={(e) => onInputValueChange(e)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-1">
                                    <button type="button" className=" bg-light icon-button params-delete sm"
                                            data-key={k} onClick={(e) => deleteOneRow(e)}>
                                        <FontAwesomeIcon icon={faTimes}/>
                                    </button>
                                </div>
                            </div>
                        )

                    })
                }
                <div className="row mb-1" key={Math.random()}>
                    <div className="col-11">
                        <div className="form-row">
                            <div className="col-1"></div>
                            <div className="col-11 ">
                                <button className="btn btn-primary form-control" type="button"
                                        onClick={e => appendANewList(e)}>
                                    <FontAwesomeIcon icon={faPlus}/>
                                </button>
                            </div>
                        </div>

                    </div>

                </div>

            </form>

        </>
    )
};

export default ParamsPanelNew