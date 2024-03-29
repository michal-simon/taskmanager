/* eslint-disable no-unused-vars */
import React from 'react'

export default function FileUpload (props) {
    const file = props.file
    const arrImages = ['gif', 'png', 'jpg', 'jpeg']
    const extension = file.filename.substr(-3)
    const thumbnail = arrImages.includes(extension) ? `/storage/${file.file_path}` : 'https://source.unsplash.com/pWkk7iiCoDM/400x300'
    const link = `/storage/${file.file_path}`

    return (
        <div className="col-lg-5 col-md-6 col-8">
            <a href={link} className="d-block" download>
                <img className="img-fluid img-thumbnail" src={thumbnail}
                    alt="" />
            </a>
            {file.filename}<br />
            {`${file.user.first_name} ${file.user.last_name}`}
            <br /><button className="btn btn-danger" onClick={() => props.delete(file.id)}>Delete</button>
        </div>
    )
}
