import React from "react";
import FileUpload from "./FileUpload";

export default function CommentList(props) {

    return (
       <div className="row text-center text-lg-left">
            
            {props.files.length === 0 && !props.loading ? (
                <div className="alert text-center alert-info">
                Upload a file
                </div>
            ) : null}

            {
                props.files.map((file, index) => (
                    <FileUpload key={index} file={file} />
                ))
            }
        </div>
    );
}