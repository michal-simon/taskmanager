import React from "react";
import moment from 'moment'

export default function Comment(props) {
    const { id, task_id, comment, user, created_at } = props.comment;
    const date = new Date(created_at);
    const monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November","December"]
    const formattedDate = `${monthNames[date.getMonth()]} ${date.getDate()}`

    return (
        <li className="media">
            <a href="#" className="pull-left">
                <img src={`/public/img/users/${user.id}.jpg`} alt="" className="img-circle"></img>
            </a>

            <div className="media-body">
                <span className="text-muted pull-right">
                    <small className="text-muted">{formattedDate}</small>
                </span>
                    
                <strong className="text-success">{`${user.first_name} ${user.last_name}`}</strong>
                
                <p>{comment}</p>
            </div>
        </li>
    )
}