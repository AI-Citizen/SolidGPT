import React from 'react';
import './FileList.css';
import { DeleteOutlined } from '@ant-design/icons';

const FileList = ({files, setFiles}) => {
    const removeFile = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    };

    return (
        <div className="file-list-container">
            <div className="file-row">
                <div className="file-scroll">
                    {files.map((file, index) => (
                        <div key={index} className="file-item">
                            {file}
                            <button className="remove-button" onClick={() => removeFile(index)}><DeleteOutlined /> </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FileList;
