import React from 'react'

const UrlPanel = ({currentLink, onSaveClick,onSendClick}) => {
    const methodTypes = ['GET', 'POST', 'PUT', 'DELETE'];
    return (
        <div className="input-group mb-2" key={currentLink.id}>
            <div className="input-group-prepend">
                <select className="custom-select bg-light" name="method" defaultValue={currentLink.type}
                        onChange={(e) => {
                            onSaveClick("",e.target.value,"");
                        }}>
                    {
                        methodTypes.map((v, k) => {
                            return (
                                <option key={k} value={v}>{v}</option>
                            )
                        })
                    }
                </select>
            </div>
            <input
                type="text"
                name="linkurl"
                className="form-control"
                defaultValue={currentLink.url}
                onChange={(e) => onSaveClick(e.target.value,"","")}
            />
            <div className="input-group-append mr-3">
                <button className="btn btn-outline-secondary btn-primary text-white" type="button"
                        onClick={onSendClick}>发送
                </button>
            </div>
        </div>
    )

};
UrlPanel.defaultProps = {
    currentLink:{
        id:0,
        type:"GET",
        params:[],
        headers:[],
        url:"",
    }
};
export default UrlPanel;
