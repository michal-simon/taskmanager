/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'

class AddDepartment extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            name: '',
            department_manager: '',
            loading: false,
            errors: []
        }

        console.log('props', this.props)

        this.toggle = this.toggle.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.buildUserOptions = this.buildUserOptions.bind(this)
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
        axios.post('/api/departments', {
            name: this.state.name,
            department_manager: this.state.department_manager
        })
            .then((response) => {
                this.toggle()
                const newUser = response.data
                this.props.departments.push(newUser)
                this.props.action(this.props.departments)
                this.setState({
                    name: null,
                    department_manager: null
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

    buildUserOptions () {
        let userContent
        if (!this.props.users.length) {
            userContent = <option value="">Loading...</option>
        } else {
            userContent = this.props.users.map((user, index) => (
                <option key={index} value={user.id}>{user.first_name + ' ' + user.last_name}</option>
            ))
        }

        return (
            <FormGroup>
                <Label for="contributors">Department Manager:</Label>
                <Input className={this.hasErrorFor('department_manager') ? 'is-invalid' : ''}
                       type="select"
                       name="department_manager"
                       id="department_manager"
                       onChange={this.handleInput.bind(this)}>
                    {userContent}
                </Input>
                {this.renderErrorFor('department_manager')}
            </FormGroup>
        )
    }

    render () {

        const userOptions = this.buildUserOptions()

        return (
            <React.Fragment>
                <Button color="success" onClick={this.toggle}>Add Department</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Add Department
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="username">Name(*):</Label>
                            <Input className={this.hasErrorFor('name') ? 'is-invalid' : ''} type="text" name="name"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('name')}
                        </FormGroup>

                        {userOptions}
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

export default AddDepartment
