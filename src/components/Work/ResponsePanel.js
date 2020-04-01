import React, {useState} from "react";
import ReactJson from 'react-json-view'
const ResponsePanel = ({response}) => {
    const [responseType,setResponseType]=useState("text");
    console.log("responseType==============",responseType);
    const getComponentByType=()=>{
        let component;
        switch(responseType){
            case 'json':
                component=<ReactJson src={response}/>;
                break;
            case 'text':
                component=<span>{JSON.stringify(response)}</span>;
                break;
            default:
                component='';

        }
        return component;
    };
    return (
        <>
            <div className="response border-top border-1 border-gray mt-2 ">
                <div className="row">
                    <div className="col-3">
                        <div className="input-group mb-1">
                            <div className="input-group-prepend">
                                <label className="input-group-text" htmlFor="inputGroupSelect01">请求结果</label>
                            </div>
                            <select className="custom-select"  defaultValue="text" onChange={(e)=>setResponseType(e.target.value)}>
                                <option value="text">TEXT</option>
                                <option value="json">JSON</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border border-3 border-gary response-area mt-2">

                <div className="border border-3 border-gary overflow-auto">
                    {
                        getComponentByType()
                    }
                </div>
            </div>
        </>
    )
};
export default ResponsePanel