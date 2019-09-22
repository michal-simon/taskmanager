/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'

class AddRole extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            name: '',
            description: '',
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
        axios.post('/api/roles', {
            name: this.state.name,
            description: this.state.description
        })
            .then((response) => {
                this.toggle()
                const newUser = response.data
                this.props.roles.push(newUser)
                this.props.action(this.props.roles)
                this.setState({
                    name: null,
                    description: null
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
            modal: !this.state.modal
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
                            <Label for="email">Description(*):</Label>
                            <Input className={this.hasErrorFor('description') ? 'is-invalid' : ''} type="text"
                                name="description" onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('description')}
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

export default AddRole
