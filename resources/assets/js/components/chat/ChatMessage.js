import React, { Component } from "react";
import {Card, CardBody} from "reactstrap";

class ChatMessage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { author, avatar, when, message } = this.props.message

        return (
            <li className="chat-message d-flex justify-content-between mb-4">
                <img
                    tag="img"
                    src={avatar}
                    alt="avatar"
                    width="50px"
                    className="mr-2 z-depth-1 rounded-circle"
                />

                <Card className="col-12">
                    <CardBody>
                        <div>
                            <strong className="primary-font">{author}</strong>
                            <small className="pull-right text-muted">
                                <i className="far fa-clock" /> {when}
                            </small>
                        </div>
                        <hr />
                        <p className="mb-0">{message}</p>
                    </CardBody>
                </Card>
            </li>
        )
    }
}

export default ChatMessage;