import * as React from 'react'
import { Card, CardHeader, CardBody, CardFooter, Button, Collapse, ListGroup, ListGroupItem, Media } from 'reactstrap'
import Avatar from '../common/Avatar'

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
    constructor (props) {
        super(props)
        this.state = {
            expanded: false
        }
        this.handleExpandClick = this.handleExpandClick.bind(this)
    }

    handleExpandClick () {
        this.setState(state => ({ expanded: !state.expanded }))
    }

    render () {
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
            <Media tag="li">
                <Media href="#" className="pull-left">
                    <Media className="img-circle" object src="https://s3.amazonaws.com/uifaces/faces/twitter/dancounsell/128.jpg" alt="Generic placeholder image" />
                </Media>

                <Media body>
                    <div className="well well-lg ml-4">
                        <Media className="text-uppercase reviews" heading>
                            {`${firstName2}  ${lastName2}`}
                        </Media>

                        <ul className="media-date text-uppercase reviews list-inline">
                            <li className="dd">22</li>
                            <li className="mm">09</li>
                            <li className="aaaa">2014</li>
                        </ul>

                        <p className="mb-2">
                            {currentMessage.comment}
                        </p>

                        {activeUser && currentMessage.author === activeUser.id ? (
                            <React.Fragment>
                                <Button color="success"
                                    aria-label="Edit message"
                                    onClick={() => {
                                        setActiveMessage(currentMessage)
                                        setMode('Edit')
                                    }}
                                >Edit</Button>

                                <Button className="ml-2" color="danger"
                                    aria-label="Delete message"
                                    onClick={() => deleteMessage(currentMessage.id)}
                                >Delete</Button>

                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                {activeUser ? (
                                    <Button color="info"
                                        aria-label="Comment message"
                                        onClick={() => {
                                            setActiveMessage(currentMessage)
                                            setMode('Comment')
                                        }}
                                    >Reply</Button>
                                ) : null}
                            </React.Fragment>
                        )
                        }
                        {childMessages.length ? (
                            <React.Fragment>
                                <Button color="warning"
                                    className="open"
                                    onClick={this.handleExpandClick}
                                    aria-expanded={this.state.expanded}
                                    aria-label="Display comments"
                                > Comments
                                </Button>
                            </React.Fragment>
                        ) : null}

                    </div>
                </Media>

                <Collapse
                    isOpen={this.state.expanded}
                    timeout="auto"
                >
                    {childMessages.map((message) => {
                        const author = users.find(
                            (user) => user.id === message.user_id
                        )
                        const firstName = author ? author.first_name : 'Michael'
                        const lastName = author ? author.last_name : 'Hampton'
                        return (
                            <Media tag="li">
                                <Media href="#" className="pull-left">
                                    <Media className="img-circle" object src="https://s3.amazonaws.com/uifaces/faces/twitter/dancounsell/128.jpg" alt="Generic placeholder image" />
                                </Media>

                                <Media body>
                                    <div className="well well-lg">
                                        <Media className="text-uppercase reviews" heading>
                                            {`${firstName}  ${lastName}`}
                                        </Media>

                                        <ul className="media-date text-uppercase reviews list-inline">
                                            <li className="dd">22</li>
                                            <li className="mm">09</li>
                                            <li className="aaaa">2014</li>
                                        </ul>

                                        <p className="mb-2">
                                            {message.comment}
                                        </p>
                                    </div>
                                </Media>
                            </Media>
                        )
                    })}
                </Collapse>
            </Media>
        )
    }
}

export default MessageCard
