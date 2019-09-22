/* eslint-disable no-unused-vars */
import React from 'react'

export default function FileUpload (props) {
    const file = props.file
    return (
        <div className="col-lg-5 col-md-6 col-8">
            <a href="#" className="d-block">
                <img className="img-fluid img-thumbnail" src="https://source.unsplash.com/pWkk7iiCoDM/400x300"
                    alt=""></img>
            </a>
            {file.filename}<br></br>
            {`${file.user.first_name} ${file.user.last_name}`}
        </div>
    )
}
