/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'

class EditDepartment extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            loading: false,
            errors: [],
            name: this.props.department.name,
            department_id: this.props.department.id,
            department_manager: this.props.department.department_manager,
            permissions: [],
            attachedPermissions: [],
            selectedPermissions: [],
            department: []
        }
        this.toggle = this.toggle.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.buildUserOptions = this.buildUserOptions.bind(this)
    }

    handleInput (e) {
        this.setState({ [e.target.name]: e.target.value })
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
                    value={this.state.department_manager}
                    name="department_manager"
                    id="department_manager"
                    onChange={this.handleInput.bind(this)}>
                    <option value="">Choose Department Manager</option>
                    {userContent}
                </Input>
                {this.renderErrorFor('department_manager')}
            </FormGroup>
        )
    }

    handleClick () {
        axios.put(`/api/departments/${this.state.department_id}`, {
            name: this.state.name,
            department_manager: this.state.department_manager
        })
            .then((response) => {
                this.toggle()
                const index = this.props.departments.findIndex(department => department.id === this.props.department.id)
                this.props.departments[index].name = this.state.name
                this.props.departments[index].department_manager = this.state.department_manager
                this.props.action(this.props.departments)
            })
            .catch((error) => {
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
        const userOptions = this.buildUserOptions()

        return (
            <React.Fragment>
                <Button color="success" onClick={this.toggle}>Update</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Edit Department
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Name(*):</Label>
                            <Input className={this.hasErrorFor('name') ? 'is-invalid' : ''} type="text" name="name"
                                defaultValue={this.state.name} onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('name')}
                        </FormGroup>

                        {userOptions}

                    </ModalBody>

                    <ModalFooter>
                        <Button color="primary" onClick={this.handleClick.bind(this)}>Update</Button>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }
}

export default EditDepartment
