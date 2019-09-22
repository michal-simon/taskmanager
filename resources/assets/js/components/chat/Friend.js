import React, { Component } from "react";
import { Badge, ListGroupItem } from 'reactstrap';

class Friend extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { customer_id, name, avatar, message, when, toRespond, seen } = this.props.friend
        const active = this.props.selected_friend === customer_id

        return (
            <ListGroupItem
                href="#!"
                className="d-flex justify-content-between p-2 border-light"
                style={{ backgroundColor: active ? "#eeeeee" : "" }}
                onClick={() => this.props.loadMessages(customer_id)}
            >

                <img
                    tag="img"
                    src={avatar}
                    alt="avatar"
                    width="50px"
                    className="mr-2 z-depth-1 rounded-circle"
                />

                <div style={{ fontSize: "0.95rem" }}>
                    <strong>{name}</strong>
                    <p className="text-muted">{message}</p>
                </div>

                <div>
                    <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
                        {when ? this.props.formatDate(when) : ''}
                    </p>
                    {seen ? (
                        <span className="text-muted float-right">
          <i className="fa fa-check" aria-hidden="true" />
        </span>
                    ) : toRespond ? (
                        <Badge color="danger" className="float-right">
                            {toRespond}
                        </Badge>
                    ) : (
                        <span className="text-muted float-right">
          <i icon="reply" aria-hidden="true" />
        </span>
                    )}
                </div>

            </ListGroupItem>
        )
    }
}

export default Friend;