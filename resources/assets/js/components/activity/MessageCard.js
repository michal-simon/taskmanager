import * as React from 'react'
import {Card, CardHeader, CardBody, CardFooter, Button, Collapse, ListGroup, ListGroupItem } from 'reactstrap'
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
});

class MessageCard extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            expanded: false
        }

        this.handleExpandClick = this.handleExpandClick.bind(this)
    }

    handleExpandClick () {
        this.setState(state => ({ expanded: !state.expanded }));
    };

    render () {
        const {
            activeUser,
            users,
            currentMessage,
            messages,
            setActiveMessage,
            setMode,
            deleteMessage,
        } = this.props;

        const author = users.find(
            (user) => user.id === currentMessage.user_id
        )

        const firstName2 = author ? author.first_name : 'Michael'
        const lastName2 = author ? author.last_name : 'Hampton'

        const childMessages = messages.filter(
            (message) => message.parent_id === currentMessage.id
        )

        return (
            <Card style={messageListCardStyles.card}>
                <CardHeader>
                    <Avatar name={`${firstName2}  ${lastName2}`} />
                    {`${firstName2}  ${lastName2}`}
                </CardHeader>
                <CardBody>
                    <p style={messageListCardStyles.messageText}>
                        {currentMessage.comment}
                    </p>
                </CardBody>

                <CardFooter style={messageListCardStyles.actions}>
                    {activeUser && currentMessage.author === activeUser.id ? (
                        <React.Fragment>
                            <Button
                                aria-label="Edit message"
                                onClick={() => {
                                    setActiveMessage(currentMessage);
                                    setMode('Edit');
                                }}
                            >
                                <i className="fa fa-edit" />
                            </Button>

                            <Button
                                aria-label="Delete message"
                                onClick={() => deleteMessage(currentMessage.id)}
                            >
                                <i className="fa fa-times" />
                            </Button>

                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {activeUser ? (
                                <Button
                                    aria-label="Comment message"
                                    onClick={() => {
                                        setActiveMessage(currentMessage);
                                        setMode('Comment');
                                    }}
                                >
                                    <i className="fa fa-comment" />
                                </Button>
                            ) : null}
                        </React.Fragment>
                    )
                    }
                    {childMessages.length ? (
                        <React.Fragment>
                            <Button
                                className="open"
                                onClick={this.handleExpandClick}
                                aria-expanded={this.state.expanded}
                                aria-label="Display comments"
                            >
                                <i className="fa fa-plus" />
                            </Button>
                        </React.Fragment>
                    ) : null}
                </CardFooter>

                <Collapse
                    isOpen={this.state.expanded}
                    timeout="auto"
                >
                    <CardBody>
                        <h6>Comments</h6>
                        <ListGroup>
                            {childMessages.map((message) => {

                                const author =  users.find(
                                    (user) => user.id === message.user_id
                                );

                                const firstName = author ? author.first_name : 'Michael'
                                const lastName = author ? author.last_name : 'Hampton'

                                return (<ListGroupItem>
                                    <Avatar name={`${firstName}  ${lastName}`} />
                                    {`${firstName}  ${lastName}`}
                                    <p>
                                        {message.comment}
                                    </p>
                                </ListGroupItem>)
                            })}
                        </ListGroup>
                    </CardBody>
                </Collapse>

            </Card>
        )
    }
}

export default MessageCard;