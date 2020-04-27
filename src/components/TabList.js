import React, {useEffect, useState} from 'react'
import classNames from 'classnames'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes,faPlus,faCircle} from '@fortawesome/free-solid-svg-icons'
import './TabList.scss'
import Data from "../utils/Data";
import defaultApiLink from "../utils/defaultApiLink";

const TabList = ({openedIds, onTabClick,onTabClose,currentId}) => {
    const [tabs, setTabs] = useState(null);
    const [reloadTab,setReloadTab]=useState(true);
    useEffect(()=>{
        const getTabs= async ()=>{
            await Data.getAllTabs().then(res=>{
                setTabs(res);
            })
        }
        if(reloadTab===true){
            getTabs();
            setReloadTab(false);
        }
    },[reloadTab]);
    const changeCurrent=(e)=>{
        let tabId=e.currentTarget.getAttribute("data-id");
        onTabClick(parseInt(tabId));

    };

    const addNewApi = () => {
        console.log("adNewApi")
        let lastId = parseInt(tabs[0].id);
        console.log("tabs 0 id",tabs[0],lastId);
        let daf = JSON.parse(JSON.stringify(defaultApiLink));
        console.log("addNewApi,daf.id",daf.id);
        daf.id = lastId + 1;
        Data.insertRowTab(daf).then(res=>{
            console.log("addNewApi,insertRowTab",res);
            console.log("addNewApi,insertRowTab,daf.id",daf.id);
            onTabClick(daf.id);
            setReloadTab(true);
        });
    };
    return (
        <>
            <ul className="nav nav-tabs tablist-component border-bottom border-2 mb-3">
                {tabs && tabs.map(tab => {
                    if(openedIds.includes(tab.id)){
                        const fClassName = classNames({
                            'nav-link': true,
                            'active': tab.id==currentId,
                        });
                        return (
                            <li className="nav-item" key={tab.id}>
                                <a
                                    href="#"
                                    className={fClassName}
                                    data-id={tab.id}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        changeCurrent(e)
                                    }}
                                    style={{fontSize:10}}
                                >
                                    {tab.title}
                                    <span
                                        className="ml-2 close-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onTabClose(tab.id)
                                        }}
                                    >
                                    <FontAwesomeIcon
                                        icon={tab.isUnsaved?faCircle:faTimes}
                                    />
                                </span>
                                </a>
                            </li>
                        )
                    }
                    return true;
                })}
                <li className="nav-item" onClick={(e)=>addNewApi(e)}>
                    <a href="#" className="nav-link active small">
                        <FontAwesomeIcon icon={faPlus} />
                    </a>

                </li>
            </ul>

        </>

    )
};

export default TabList