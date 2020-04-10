import React from 'react'
import classNames from 'classnames'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes,faPlus,faCircle} from '@fortawesome/free-solid-svg-icons'
import './TabList.scss'

const TabList = ({files,openedIds, activeId, onTabClick,onTabClose,onTabAdd}) => {
    return (
        <>
            <ul className="nav nav-tabs tablist-component border-bottom border-2 mb-3">
                {files.map(file => {
                    if(openedIds.includes(file.id)){
                        const fClassName = classNames({
                            'nav-link': true,
                            'active': file.id === activeId,
                        });
                        return (
                            <li className="nav-item" key={file.id}>
                                <a
                                    href="#"
                                    className={fClassName}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onTabClick(file.id)
                                    }}
                                    style={{fontSize:10}}
                                >
                                    {file.title}
                                    <span
                                        className="ml-2 close-icon"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onTabClose(file.id)
                                        }}
                                    >
                                    <FontAwesomeIcon
                                        icon={file.isUnsaved?faCircle:faTimes}
                                    />
                                </span>
                                </a>
                            </li>
                        )
                    }
                    return true;
                })}
                <li className="nav-item" onClick={(e)=>onTabAdd(e)}>
                    <a href="#" className="nav-link active small">
                        <FontAwesomeIcon icon={faPlus} />
                    </a>

                </li>
            </ul>

        </>

    )
};

export default TabList