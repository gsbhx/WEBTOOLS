import React, {useEffect, useState} from 'react'
import Data from '../utils/Data'


const ApiList = ({apis,onLinkOpen, activeId}) => {

    return (
        <ul className="list-group list-group-flush link-list">
            {
                apis&&apis.map(api => (
                    <li
                        className={(activeId === api.id ? "text-danger " : "") + "list-group-item d-flex align-items-center  justify-content-around link-item"}
                        key={Math.random()}
                        onClick={() => {
                            onLinkOpen(api.id)
                        }}
                    >
                       <span
                           className="text-success  font-weight-bold align-text-top border-1"
                       >
                            {api.type}
                       </span>
                        <span
                            className="text-black-60"
                        >
                            {api.title}
                        </span>
                    </li>
                ))
            }
        </ul>
    )
};

export default ApiList