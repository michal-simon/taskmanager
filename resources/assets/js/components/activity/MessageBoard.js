import * as React from 'react';
import { Button, Col, Container, ModalBody, ModalFooter, Input, FormGroup, Label, Form } from 'reactstrap'
import MessageCard from './MessageCard'

class MessageBoard extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            messageText: ''
        }
    }

    render() {

        const { messages, activeUser, deleteMessage, submitMessage, setMode, setActiveMessage, users } = this.props

        return (
           <div className="d-flex align-items-center justify-content-center flex-column">
               <h5 style={{ marginTop: 16 }}>
                   Messages
               </h5>

               {activeUser ? (
                   <Button
                       color="primary"
                       style={{ marginTop: 16 }}
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

               {messages.length ? (
                   <Container spacing={16} style={{ padding: 16 }}>
                       {messages.map((message) => (
                           <React.Fragment>
                               {!message.parent_id ? (
                                   <Col key={message.id} xs={12} sm={6} md={3}>
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
                                   </Col>
                               ) : null}
                           </React.Fragment>
                       ))}
                   </Container>
               ) : null}

           </div>
            )



    }
}

export default MessageBoard;