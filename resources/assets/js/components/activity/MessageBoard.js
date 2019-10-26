import * as React from 'react'
import {Button, Col, Container, Media} from 'reactstrap'
import MessageCard from './MessageCard'

class MessageBoard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            messageText: ''
        }
    }

    render() {
        const {messages, activeUser, deleteMessage, submitMessage, setMode, setActiveMessage, users} = this.props
        return (
            <div style={{'backgroundColor': 'white'}} className="d-flex align-items-center justify-content-center flex-column">
                <h5 style={{marginTop: 16}}>
                    Messages
                </h5>

                {activeUser ? (
                    <Button
                        color="primary"
                        style={{marginTop: 16}}
                        onClick={() => setMode('Create')}
                    >
                        Create New Message
                    </Button>
                ) : (
                    <p>
                        Select a user in the toolbar to create, edit, delete, and comment
                        messages.
                    </p>
                )}

                <Container spacing={16} style={{padding: 16}}>

                        {messages.length ? (
                            <Media list>
                                {messages.map((message) => (
                                    <React.Fragment>
                                        {!message.parent_id ? (
                                                <MessageCard
                                                    setMode={setMode}
                                                    currentMessage={message}
                                                    messages={messages}
                                                    submitMessage={submitMessage}
                                                    deleteMessage={deleteMessage}
                                                    activeUser={activeUser}
                                                    users={users}
                                                    setActiveMessage={setActiveMessage}
                                                />
                                        ) : null}
                                    </React.Fragment>
                                ))}
                            </Media>
                        ) : null}

                </Container>


            </div>
        )
    }
}

export default MessageBoard