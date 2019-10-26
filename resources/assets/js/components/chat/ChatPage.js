/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input, Card, Row, CardBody, Col, ListGroup } from 'reactstrap'
import Friend from './Friend'
import ChatMessage from './ChatMessage'
import ChatInput from './ChatInput'
import axios from 'axios'

class ChatPage extends Component {
    constructor (props) {
        super(props)
        this.sendMessage = this.sendMessage.bind(this)
        this.loadMessages = this.loadMessages.bind(this)
        this.state = {
            userID: JSON.parse(localStorage.getItem('appState'))['user']['id'],
            friends: [],
            messages: [],
            chatActive: false,
            customer_id: 0
        }
    }

    componentDidMount () {
        this.getCustomers()
    }

    loadMessages (customer_id) {
        axios.get(`/api/messages/${customer_id}`)
            .then((r) => {
                this.setState({
                    customer_id: customer_id,
                    messages: r.data,
                    chatActive: true
                })
            })
            .catch((e) => {
                alert(e)
            })
    }

    getCustomers () {
        axios.get('/api/messages/customers')
            .then((r) => {
                this.setState({
                    friends: r.data
                })
            })
            .catch((e) => {
                alert(e)
            })
    }

    sendMessage (message) {
        axios.post('/api/messages', message)
            .then((r) => {
                // for now this will let us know things work.  `console` will give us a
                // warning though
                this.setState(prevState => ({
                    messages: [...prevState.messages, message]
                }))
            })
            .catch((e) => {
                alert(e)
            })
    }

    formatDate (dateString) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        const d = new Date(dateString)
        const dayName = days[d.getDay()]
        const monthName = monthNames[d.getMonth()]
        const hours = d.getHours()
        const minutes = d.getMinutes()
        const formattedDate = `${dayName} ${d.getDate()} ${monthName} ${d.getFullYear()} ${hours}:${minutes}`
        return formattedDate
    }

    render () {
        return (<Card className="chat-room">
            <CardBody>
                <Row className="px-lg-2 px-2">
                    <Col md="6" xl="4" className="px-0 mb-4 mb-md-0 scrollable-friends-list"
                        style={{ borderRight: '1px solid #CCC' }}>
                        <h6 className="font-weight-bold mb-3 text-lg-left">Member</h6>

                        <div className="overflow-auto">
                            <div className="z-depth-1 p-3">
                                <ListGroup className="friend-list">
                                    {this.state.friends.map(friend => (
                                        <Friend
                                            formatDate={this.formatDate}
                                            selected_friend={this.state.customer_id}
                                            loadMessages={this.loadMessages}
                                            key={friend.name}
                                            friend={friend}/>
                                    ))}
                                </ListGroup>
                            </div>
                        </div>
                    </Col>

                    <Col md="6" xl="8" className="pl-md-3 mt-4 mt-md-0 px-lg-auto">
                        <div className="scrollable-chat">
                            <div className="overflow-auto">
                                <ListGroup className="list-unstyled pl-3 pr-3">
                                    {this.state.messages.map(message => (
                                        <ChatMessage
                                            formatDate={this.formatDate}
                                            key={message.author + message.when}
                                            message={message}
                                        />
                                    ))}
                                </ListGroup>
                            </div>
                        </div>

                        <ChatInput
                            customer_id={this.state.customer_id}
                            display={this.state.chatActive}
                            userID={this.state.userID}
                            sendMessage={this.sendMessage}
                        />

                    </Col>
                </Row>
            </CardBody>
        </Card>)
    }
}

export default ChatPage
