/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Button, Form, FormGroup, Label, Input, Card, Row, CardBody, Col, ListGroup } from 'reactstrap'

class ChatInput extends Component {
    constructor (props) {
        super(props)
        this.state = {
            message: ''
        }
        this.onSubmit = this.onSubmit.bind(this)
    }

    onSubmit (e) {
        e.preventDefault()
        const messageObj = {
            author: sessionStorage.getItem('username'),
            user_id: this.props.userID,
            message: this.state.message,
            when: new Date(),
            customer_id: this.props.customer_id
        }
        this.props.sendMessage(messageObj)
        this.setState({ message: '' })
    }

    handleInputChanges (e) {
        e.preventDefault()
        this.setState({ message: e.currentTarget.value })
    }

    render () {
        const inputClass = `form-group basic-textarea ${(this.props.display ? 'd-block' : 'd-none')}`

        return (
            <form onSubmit={this.onSubmit}>

                <div className={inputClass}>
                    <textarea
                        className="form-control pl-2 my-0"
                        id="exampleFormControlTextarea2"
                        rows="3"
                        placeholder="Type your message here..."
                        onChange={this.handleInputChanges.bind(this)}
                        value={this.state.message}
                    />
                    <Button
                        color="info"
                        rounded
                        size="sm"
                        className="float-right mt-4"
                    >
                        Send
                    </Button>
                </div>
            </form>
        )
    }
}

export default ChatInput
