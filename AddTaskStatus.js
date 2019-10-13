import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'

class AddTaskStatus extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            name: '',
            icon: '',
            task_type: 0,
            color: '',
            loading: false,
            errors: []
        }
        this.toggle = this.toggle.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
    }

    handleChange (event) {
        this.setState({ name: event.target.value })
    }

    handleInput (e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    hasErrorFor (field) {
        return !!this.state.errors[field]
    }

    renderErrorFor (field) {
        if (this.hasErrorFor(field)) {
            return (
                <span className='invalid-feedback'>
                    <strong>{this.state.errors[field][0]}</strong>
                </span>
            )
        }
    }

    handleClick () {
        axios.post('/api/taskStatus', {
            name: this.state.name,
            color: this.state.color,
            task_type: this.state.task_type,
            icon: this.state.icon,
        })
            .then((response) => {
                this.toggle()
                const newUser = response.data
                this.props.statuses.push(newUser)
                this.props.action(this.props.statuses)
                this.setState({
                    name: null,
                    color: null
                })
            })
            .catch((error) => {
                alert(error)
                this.setState({
                    errors: error.response.data.errors
                })
            })
    }

    toggle () {
        this.setState({
            modal: !this.state.modal,
            errors: []
        })
    }

    render () {
        return (
            <React.Fragment>
                <Button color="success" onClick={this.toggle}>Add Role</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Add Role
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="username">Name(*):</Label>
                            <Input className={this.hasErrorFor('name') ? 'is-invalid' : ''} type="text" name="name"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('name')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="email">Color(*):</Label>
                            <Input className={this.hasErrorFor('color') ? 'is-invalid' : ''} type="text"
                                name="color" onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('color')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="icon">Icon(*):</Label>
                            <Input className={this.hasErrorFor('icon') ? 'is-invalid' : ''} type="text"
                                name="color" onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('icon')}
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="primary" onClick={this.handleClick.bind(this)}>Add</Button>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }
}

export default AddTaskStatus
