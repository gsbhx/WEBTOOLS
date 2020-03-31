import React from 'react';

const ParamsTitle = ({isHeaderShow, onParamsClick}) => {
    return (
        <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
                <span className={(isHeaderShow ? "active" : "") + " nav-link"} onClick={() => {
                    onParamsClick(true)
                }}>Headers</span>
            </li>
            <li className="nav-item">
                <span className={(isHeaderShow ? "" : "active") + " nav-link"} onClick={() => {
                    onParamsClick(false)
                }}>Body</span>
            </li>
        </ul>

    )
};
export default ParamsTitle