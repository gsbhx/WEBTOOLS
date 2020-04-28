import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/zh-cn';

const ParamsBodys = ({format, params, onCheckBoxValueChange, onInputValueChange, deleteOneRow, appendANewList}) => {
    console.log(params);

    const onValueChange = (e) => {
        if(e.jsObject){
            onInputValueChange(e.jsObject);
        }
    }
    return (
        <>
            {
                format == 0
                    ?
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
                            params.map((v, k) => {
                                return (
                                    <div className="row mb-1 d-flex align-items-center params-row" data-key={k} key={k}>
                                        <div className="col-11">
                                            <div className="form-row">
                                                <div className="col-1">
                                                    <input type="checkbox" data-key={k} checked={v.status}
                                                           className="form-control"
                                                           onChange={e => onCheckBoxValueChange(e)}
                                                    />
                                                </div>
                                                <div className="col">
                                                    <input
                                                        type="text"
                                                        name="key"
                                                        data-key={k}
                                                        value={v.values.key}
                                                        className="form-control "
                                                        onChange={(e) => onInputValueChange(e)}
                                                    />
                                                </div>
                                                <div className="col">
                                                    <input
                                                        type="text"
                                                        name="value"
                                                        data-key={k}
                                                        value={v.values.value}
                                                        className="form-control"
                                                        onChange={(e) => onInputValueChange(e)}
                                                    />
                                                </div>
                                                <div className="col">
                                                    <input
                                                        type="text"
                                                        name="describtion"
                                                        data-key={k}
                                                        value={v.values.describtion}
                                                        className="form-control"
                                                        onChange={(e) => onInputValueChange(e)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-1">
                                            <button type="button" className=" bg-light icon-button params-delete sm"
                                                    data-key={k} onClick={(e) => deleteOneRow(e)}>
                                                <FontAwesomeIcon icon={faTimes}/>
                                            </button>
                                        </div>
                                    </div>
                                )

                            })
                        }
                        <div className="row mb-1" key={Math.random()}>
                            <div className="col-11">
                                <div className="form-row">
                                    <div className="col-1"></div>
                                    <div className="col-11 ">
                                        <button className="btn btn-primary form-control" type="button"
                                                onClick={e => appendANewList(e)}>
                                            <FontAwesomeIcon icon={faPlus}/>
                                        </button>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </form>
                    :
                    <form id="params">
                        <JSONInput
                            id='abc'
                            placeholder={params}
                            theme="light_mitsuketa_tribute"
                            colors={{
                                string: "#DAA520",
                                primitive: "#000e1c",
                                keys: "#003bc0",
                                fontSize:"15px",
                            }}
                            locale={locale}
                            height='300px'
                            width='100%'
                            style       = {{
                                errorMessage : {
                                    fontSize    : '20px',
                                    fontWieight : 800
                                },
                                body:{
                                    fontSize: '15px'
                                }
                            }}
                            onChange={e=>onValueChange(e)}
                        />
                    </form>


            }
        </>

    )


}

export default ParamsBodys;