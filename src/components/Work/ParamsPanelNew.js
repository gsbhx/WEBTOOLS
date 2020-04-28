import React, {useEffect, useState} from 'react';
import "./ParamPanel.scss"
import Data from "../../utils/Data";
import Tools from "../../utils/Tools";
import ParamsHeaders from "./ParamsHeaders";
import ParamsBodys from "./ParamsBodys";

const ParamsPanelNew = ({id, setResponse}) => {
    const methodTypes = ['GET', 'POST', 'PUT', 'DELETE'];
    const [headerStatus, setHeaderStatus] = useState(false);
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
                headerStatus ? setParamName("headers") : (res.format==0?setParamName("form_params"):setParamName("raw_params"));
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
        let tabCopy = JSON.parse(JSON.stringify(tab));
        if(headerStatus==false && paramName=='raw_params'){
             tabCopy[paramName]=e;
        }else{
            let key = parseInt(e.target.getAttribute('data-key'));
            tabCopy[paramName][key]['values'][e.target.name] = e.target.value;
        }
        setTab(tabCopy);
        setNeedTabToSave(true);
    };
    const deleteOneRow = (e) => {
        let key = parseInt(e.currentTarget.getAttribute('data-key'));
        let tabCopy = JSON.parse(JSON.stringify(tab));
        console.log("deleteOneRow paramsName",paramName)
        tabCopy[paramName].splice(key, 1);
        setTab(tabCopy);
        setNeedTabToSave(true);
    };
    const setTabUrlAndMethod = (e) => {
        let key = e.currentTarget.getAttribute('name');
        let tabCopy = JSON.parse(JSON.stringify(tab));
        tabCopy[key] = e.currentTarget.value;
        setTab(tabCopy);
        setNeedTabToSave(true);
    }
    const getParams = () => {
        let res = tab === null ? [] : (headerStatus ? tab.headers : (tab.format==0? tab.form_params:tab.raw_params));
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

    const onParamsFormatClick=(e)=>{
        let tabCopy = JSON.parse(JSON.stringify(tab));
        tabCopy.format = e.currentTarget.value;
        setTab(tabCopy);
        headerStatus ? setParamName("headers") : (tab &&tab.format==0?setParamName("form_params"):setParamName("raw_params"));
        setNeedTabToSave(true);
    }
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
            <ul className={(headerStatus ? "mb-1 ": "") + "nav nav-tabs"}>
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
            {
                headerStatus===false &&
                <div className="row d-flex justify-content-around align-items-center pt-2 pb-2 border-bottom mb-1">
                    <div className="col-1"> </div>
                    <div className="col-2">
                        <input type="radio" name="params-format" checked={tab &&tab.format==0 ? true:false} value="0" onClick={(e)=>{onParamsFormatClick(e);}}/>FORM-DATA
                    </div>
                    <div className="col-2">
                        <input type="radio" name="params-format" checked={tab && tab.format==1 ? true:false} value="1" onClick={(e)=>onParamsFormatClick(e)}/>RAW
                    </div>
                    <div className="col-7"> </div>
                </div>
            }
            {
                headerStatus ?
                    <ParamsHeaders
                        params={getParams()}
                        onCheckBoxValueChange={onCheckBoxValueChange}
                        onInputValueChange={onInputValueChange}
                        deleteOneRow={deleteOneRow}
                        appendANewList={appendANewList}
                    />
                    :
                    <ParamsBodys
                        format={tab &&tab.format}
                        params={getParams()}
                        onCheckBoxValueChange={onCheckBoxValueChange}
                        onInputValueChange={onInputValueChange}
                        deleteOneRow={deleteOneRow}
                        appendANewList={appendANewList}
                    />
            }




        </>
    )
};

export default ParamsPanelNew