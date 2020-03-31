import React, {useState} from 'react'

const HistoryAndCollects = () => {
    const [isHistoryActive, setHistoryActive] = useState(true);
    const [isCollectActive, setCollectActive] = useState(false);
    let className = "border-bottom border-1 border-danger text-danger";
    return (
        <div className="alert d-flex justify-content-around align-items-end border-top border-bottom">
            <span
                onClick={()=>{
                    setHistoryActive(true);
                    setCollectActive(false);
                }}
                className={(isHistoryActive ? className : "")+" history"}
            >
                历史记录
            </span>
            <span
                onClick={()=>{
                    setHistoryActive(false);
                    setCollectActive(true);
                }}
                className={(isCollectActive ? className : "")+" collects"}
            >
                我的收藏
            </span>
        </div>
    )
}
export default HistoryAndCollects