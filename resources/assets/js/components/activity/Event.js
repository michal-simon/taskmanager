import * as React from 'react'
import {Card, CardHeader, CardBody, CardFooter, Button, Collapse, ListGroup, ListGroupItem, Media} from 'reactstrap'
import Avatar from '../common/Avatar'
import axios from "axios";
import TimeAgo from "react-timeago/lib";

const messageListCardStyles = ({
    card: {
        width: '100%'
    },
    actions: {
        display: 'flex'
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto'
    },
    expandOpen: {
        transform: 'rotate(180deg)'
    },
    messageText: {
        // Fixes typescript widening issue
        // Read more here, https://github.com/Microsoft/TypeScript/issues/241
        overflowWrap: 'break-word'
    },
    commentText: {
        overflowWrap: 'break-word'
    }
})

class Event extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }

        this.changeEventStatus = this.changeEventStatus.bind(this)
    }

    changeEventStatus(e) {
        const id = e.target.getAttribute('data-id')
        const status = parseInt(e.target.getAttribute('data-status'))

        axios.post(`/api/event/status/${id}`, {
            status: status
        })
            .then((response) => {
                const index = this.props.events.findIndex(event => event.id === this.props.event.id)
                this.props.events[index].status = status
                this.props.action(this.props.events)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {

        const {event} = this.props

        return (
            <div className="col-8 col-md-12">
                <div className="panel panel-white post panel-shadow">
                    <div className="post-heading">
                        <div className="pull-left image">
                            <Avatar className="mr-2" name={`${event.owner.first_name}  ${event.owner.last_name}`} large={false}/>
                            {/*<img src="https://bootdey.com/img/Content/user_1.jpg" className="img-circle avatar"*/}
                            {/*     alt="user profile image"/>*/}
                        </div>
                        <div className="pull-left meta">
                            <div className="title h5">
                                <a href="#">
                                    <b> {`${event.owner.first_name}  ${event.owner.last_name}`} </b>
                                </a>
                                added an event.
                            </div>
                            <h6 className="text-muted time"><TimeAgo date={event.beginDate} /></h6>
                        </div>
                    </div>
                    <div className="post-description">
                        <h3>{event.title}</h3>
                        <br/>Location: {event.location}
                        <p>{event.description}</p>
                        {event.status === 0 && !this.state.hideEventButtons ?
                            (
                                <div className="stats">
                                    <button data-id={event.id} data-status={1} onClick={this.changeEventStatus}
                                            className="btn btn-primary">Accept
                                    </button>
                                    <button data-id={event.id} data-status={2} onClick={this.changeEventStatus}
                                            className="btn btn-danger ml-2">Reject
                                    </button>
                                </div>
                            )
                            : (event.status === 1 ? (<div className="text-success">Accepted</div>) : (<div className="text-danger">Declined</div>))
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Event
