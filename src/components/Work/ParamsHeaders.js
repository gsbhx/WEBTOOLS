import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";

const ParamsHeaders=({params,onCheckBoxValueChange,onInputValueChange,deleteOneRow,appendANewList})=>{

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
    )


}

export  default ParamsHeaders;