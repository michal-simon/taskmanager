import * as React from 'react'
import {Card, CardHeader, CardBody, CardFooter, Button, Collapse, ListGroup, ListGroupItem, Media} from 'reactstrap'
import Avatar from '../common/Avatar'
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

class MessageCard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            expanded: false,
            messageText: ''
        }

        this.handleExpandClick = this.handleExpandClick.bind(this)
        this.buildComment = this.buildComment.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.handleCommentChange = this.handleCommentChange.bind(this)
    }

    handleExpandClick() {
        this.setState(state => ({expanded: !state.expanded}))
    }

    handleCommentChange (event) {
        this.setState({
            messageText: event.target.value
        })
    }

    handleKeyPress(event) {
        const { messageText } = this.state

        const {
            currentMessage,
            setActiveMessage,
            submitMessage,
            setMode,
        } = this.props

        if(event.key === 'Enter'){
            setActiveMessage(currentMessage)
            setMode('Comment')

            setTimeout(() => {
                submitMessage(messageText, 'Comment')
                this.setState({messageText: ''})
            }, 2000)

        }
    }

    formatDate(dateString) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
            'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
        ]
        const d = new Date(dateString)
        const dayName = days[d.getDay()]
        const monthName = monthNames[d.getMonth()]
        //const formattedDate = `${dayName} ${d.getDate()} ${monthName} ${d.getFullYear()}`
        //return formattedDate

        return (
            <ul className="media-date text-uppercase reviews list-inline">
                <li className="dd">{d.getDate()}</li>
                <li className="mm">{monthName}</li>
                <li className="aaaa">{d.getFullYear()}</li>
            </ul>
        )
    }

    buildComment(message) {

        const {users} = this.props

        const author = users.find(
            (user) => user.id === message.user_id
        )
        const firstName = author ? author.first_name : 'Michael'
        const lastName = author ? author.last_name : 'Hampton'

        return (
            <li className="comment">
                <a className="pull-left" href="#">
                    <Avatar className="mr-2" name={`${firstName}  ${lastName}`} large={false}/>
                {/*<img className="avatar" src="https://bootdey.com/img/Content/user_1.jpg"*/}
                {/*     alt="avatar"/> */}
            </a>
                <div className="comment-body">
                    <div className="comment-heading">
                        <h4 className="user">{`${firstName}  ${lastName}`}</h4>
                        <h5 className="time"><TimeAgo date={message.created_at} /></h5>
                    </div>

                    <p> {message.comment}</p></div>
            </li>
        )
    }

    render() {
        const {
            activeUser,
            users,
            currentMessage,
            messages,
            setActiveMessage,
            setMode,
            deleteMessage
        } = this.props
        const author = users.find(
            (user) => user.id === currentMessage.user_id
        )
        const firstName2 = author ? author.first_name : 'Michael'
        const lastName2 = author ? author.last_name : 'Hampton'
        const childMessages = messages.filter(
            (message) => message.parent_id === currentMessage.id
        )

        return (
            <div className="col-8 col-md-12">
                <div className="panel panel-white post panel-shadow">
                    <div className="post-heading">
                        <div className="pull-left image">
                            <Avatar className="mr-2" name={`${firstName2}  ${lastName2}`} large={false}/>
                            {/*<img src="https://bootdey.com/img/Content/user_1.jpg"*/}
                            {/*     className="img-circle avatar" alt="user profile image"/>*/}
                        </div>

                        <div className="pull-left meta">
                            <div className="title h5">
                                <a href="#">
                                    <b> {`${firstName2}  ${lastName2}`} </b>
                                </a>
                                made a post.
                            </div>
                            <h6 className="text-muted time"><TimeAgo date={currentMessage.created_at} /></h6></div>
                    </div>
                    <div className="post-description">
                        <p>{currentMessage.comment}</p>
                        <div className="stats">
                            <a href="#" className="btn btn-default stat-item">
                                <i className="fa fa-thumbs-up icon"></i>2
                            </a>

                            <a href="#" className="btn btn-default stat-item">
                                <i className="fa fa-share icon"></i>12
                            </a>

                            {activeUser && currentMessage.author === activeUser.id ? (
                                <Button className="ml-2" color="danger"
                                        aria-label="Delete message"
                                        onClick={() => deleteMessage(currentMessage.id)}
                                >Delete</Button>
                            ) : null}
                        </div>
                    </div>
                    <div className="post-footer">
                        <div className="input-group">
                            <input onChange={this.handleCommentChange} value={this.state.messageText} onKeyPress={this.handleKeyPress} className="form-control" placeholder="Add a comment" type="text"/>

                            <span
                                className="input-group-addon"> <a
                                href="#"><i className="fa fa-edit"></i></a> </span></div>
                        <ul className="comments-list">

                            {childMessages.length ? childMessages.map((message) => {
                                    return this.buildComment(message)
                                })
                                : null}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export default MessageCard
