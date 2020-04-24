import React from 'react';

const ParamsTitle = ({isHeaderShow, onParamsClick,onChangeHeaderStatus}) => {
    return (
        <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
                <span className={(isHeaderShow ? "active" : "") + " nav-link"} onClick={() => {
                    onParamsClick(true);onChangeHeaderStatus(true);
                }}>Headers</span>
            </li>
            <li className="nav-item">
                <span className={(isHeaderShow ? "" : "active") + " nav-link"} onClick={() => {
                    onParamsClick(false);onChangeHeaderStatus(true);
                }}>Body</span>
            </li>
        </ul>

    )
};
export default ParamsTitle