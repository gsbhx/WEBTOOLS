import React, {useEffect, useRef, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes, faPlus} from '@fortawesome/free-solid-svg-icons';
import "./ParamPanel.scss"

const ParamsPanel = ({params, onSaveClick}) => {
    const [paramater, setParamater] = useState([]);
    const [refresh,setRefresh] = useState(false);
    let node = useRef(null);

    const appendANewList = (e) => {
        let para = paramater;
        if (para.length === 0) {
            para.push({status:true,values:{key: "", value: "", describtion: ""}});
            setParamater(para);
            return
        }
        if (para[para.length - 1].key==='' || !para[para.length - 1].value==='') {
            return
        }
        para.push({status:true,values:{key: "", value: "", describtion: ""}});
        console.log("param",para);
        setParamater(para);
        setRefresh(true);
    };
    const onCheckBoxValueChange=(e)=>{
        let key=parseInt(e.target.getAttribute("data-key"));
        let para=paramater;
        para[key].status=e.target.checked;
        setParamater(para);
        onSaveClick("","",para);
        setRefresh(true);
    };
    const onInputValueChange = (e) => {
        let key=parseInt(e.target.getAttribute('data-key'));
        let para = paramater;
        para[key]['values'][e.target.name] = e.target.value;
        setParamater(para);
        setRefresh(true);

    };

    const deleteOneRow=(e)=>{
        let key=e.currentTarget.getAttribute('data-key');
        let para=paramater;
        para.splice(key,1);
        console.log(key,para)
        setParamater(para);
        onSaveClick("","",para);
    };
   /* useEffect(()=>{
        refresh &&setTimeout(()=>setRefresh(false));

    },[refresh]);*/
    useEffect(()=>{
        console.log("ParamsPanel useEffect params:",params,typeof params)
        setParamater(params);
    },[params]);
    const onInputBlur=(e)=>{
        onSaveClick("","",paramater);
        console.log("input is blur");
    };
    return (
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
                paramater.map((v, k) => {
                    return (
                        <div className="row mb-1 d-flex align-items-center params-row" ref={node} data-key={k} key={k}>
                            <div className="col-11">
                                <div className="form-row">
                                    <div className="col-1">
                                        <input type="checkbox" data-key={k} checked={v.status} className="form-control" onChange={(e)=>onCheckBoxValueChange(e)} />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            name="key"
                                            data-key={k}
                                            value={v.values.key}
                                            className="form-control "
                                            onChange={onInputValueChange}
                                            onBlur={onInputBlur}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            name="value"
                                            data-key={k}
                                            value={v.values.value}
                                            className="form-control"
                                            onChange={onInputValueChange}
                                            onBlur={onInputBlur}
                                        />
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            name="describtion"
                                            data-key={k}
                                            value={v.values.describtion}
                                            className="form-control"
                                            onChange={onInputValueChange}
                                            onBlur={onInputBlur}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-1">
                                <button  className=" bg-light icon-button params-delete sm" data-key={k} onClick={(e)=>deleteOneRow(e)}>
                                    <FontAwesomeIcon  icon={faTimes}/>
                                </button>
                            </div>
                        </div>
                    )

                })
            }
            <div className="row mb-1" onClick={appendANewList} key={Math.random()}>
                <div className="col-11">
                    <div className="form-row">
                        <div className="col-1"> </div>
                        <div className="col-11 ">
                            <button  className="btn btn-primary form-control" type="button">
                                <FontAwesomeIcon icon={faPlus}/>
                            </button>
                        </div>
                    </div>

                </div>

            </div>

        </form>


    )
};

ParamsPanel.defaultProps = {
    params: [
        {
            "key": "",
            "value": "",
            "describtion": "",
        }
    ],
};
export default ParamsPanel