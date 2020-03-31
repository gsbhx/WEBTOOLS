import React, {useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSearch} from '@fortawesome/free-solid-svg-icons'

const ApiSearch = ({title}) => {
    const [value, setValue] = useState('')
    const startSearch = () => {
        //,......
    };
    return (
        <div className="alert d-flex justify-content-between align-items-center">
            <>
                <input
                    className="form-control"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value)
                    }}
                    placeholder={title}
                />
            </>
            <>
                <button
                    type="button"
                    className="icon-button"
                    onClick={startSearch}
                >
                    <FontAwesomeIcon
                        title="搜索"
                        size="1x"
                        icon={faSearch}
                    />
                </button>
            </>
        </div>
    )
};
export default ApiSearch
