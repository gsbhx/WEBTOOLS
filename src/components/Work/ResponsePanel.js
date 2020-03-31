import React from "react";
import ReactJson from 'react-json-view'
const ResponsePanel = ({response}) => {
    return (
        <>
            <div className="response border-top border-bottom border-1 border-gray p-2">
                <span>请求结果</span>
            </div>
            <div className="border border-3 border-gary response-area mt-2">

                <div className="border border-3 border-gary overflow-auto">

                    <ReactJson src={response}/>

                </div>
            </div>
        </>
    )
};
export default ResponsePanel