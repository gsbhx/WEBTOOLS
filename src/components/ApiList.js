import React, {useEffect, useState} from 'react'
import Data from '../utils/Data'
const ApiList = ({onTabClick, currentId}) => {
    const [tabs, setTabs] = useState(null);
    const [reloadTab, setReloadTab] = useState(true);
    useEffect(() => {
        const getTabs = async () => {
            await Data.getAllTabs().then(res => {
                setTabs(res);
                setReloadTab(false);
            })
        };
        if (reloadTab === true) {
            getTabs();
        }
    }, [reloadTab]);


    useEffect(() => {
        setReloadTab(true);
    }, [currentId]);
    /**
     * 用户点击tab之后，将currentTab 更改为当前的tab
     * @param e
     */
    const changeCurrent = (e) => {
        let tabId = e.currentTarget.getAttribute("data-id");
        onTabClick(parseInt(tabId));
    }
    return (
        <ul className="list-group list-group-flush link-list">
            {tabs && tabs.map(tab => (
                <li
                    className={(tab.id == currentId ? "text-danger " : "") + "list-group-item d-flex align-items-center  justify-content-around link-item"}
                    key={tab.id}
                    data-id={tab.id}
                    onClick={(e) => {
                        changeCurrent(e)
                    }}
                >
                       <span
                           className="text-success  font-weight-bold align-text-top border-1"
                       >
                            {tab.type}
                       </span>
                    <span
                        className="text-black-60"
                    >
                            {tab.id}---{tab.title}
                        </span>
                </li>
            ))
            }
        </ul>
    )
};

export default ApiList