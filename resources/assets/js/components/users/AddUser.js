/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'

class AddUser extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            profile_photo: '5af1921c0fe5703dd4a463ec',
            role_id: 0,
            password: '',
            loading: false,
            errors: [],
            roles: [],
            selectedRoles: []
        }
        this.toggle = this.toggle.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.handleMultiSelect = this.handleMultiSelect.bind(this)
    }

    componentDidMount () {
        this.getRoles()
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

    getRoles () {
        axios.get('/api/roles')
            .then((r) => {
                this.setState({
                    roles: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    handleClick () {
        axios.post('/api/users', {
            username: this.state.username,
            email: this.state.email,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            profile_photo: this.state.profile_photo,
            password: this.state.password,
            role: this.state.selectedRoles
        })
            .then((response) => {
                this.toggle()
                const newUser = response.data
                this.props.users.push(newUser)
                this.props.action(this.props.users)
                this.setState({
                    username: null,
                    email: null,
                    first_name: null,
                    last_name: null,
                    profile_photo: null,
                    password: null,
                    role_id: null,
                    loading: false
                })
            })
            .catch((error) => {
                this.setState({
                    errors: error.response.data.errors
                })
            })
    }

    handleInput (e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleChange (event) {
        this.setState({ name: event.target.value })
    }

    toggle () {
        this.setState({
            modal: !this.state.modal
        })
    }

    handleMultiSelect (e) {
        this.setState({ selectedRoles: Array.from(e.target.selectedOptions, (item) => item.value) })
    }

    render () {
        let roleList = null
        if (!this.state.roles.length) {
            roleList = <option value="">Loading...</option>
        } else {
            roleList = this.state.roles.map((role, index) => (
                <option key={index} value={role.id}>{role.name}</option>
            ))
        }
        return (
            <React.Fragment>
                <Button color="success" onClick={this.toggle}>Add User</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                       Add User
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="username">Username(*):</Label>
                            <Input className={this.hasErrorFor('username') ? 'is-invalid' : ''} type="text"
                                name="username" onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('username')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="email">Email(*):</Label>
                            <Input className={this.hasErrorFor('email') ? 'is-invalid' : ''} type="email" name="email"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('email')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="first_name">First Name(*):</Label>
                            <Input className={this.hasErrorFor('first_name') ? 'is-invalid' : ''} type="text"
                                name="first_name" onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('first_name')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="last_name">Last Name(*):</Label>
                            <Input className={this.hasErrorFor('last_name') ? 'is-invalid' : ''} type="text"
                                name="last_name" onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('last_name')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="profile_photo">Profile Photo URL(*):</Label>
                            <Input className={this.hasErrorFor('profile_photo') ? 'is-invalid' : ''} type="text"
                                name="profile_photo" onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('profile_photo')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="password">Password:</Label>
                            <Input className={this.hasErrorFor('password') ? 'is-invalid' : ''} type="password"
                                name="password" onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('password')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="users">Roles</Label>
                            <Input defaultValue={this.state.selectedRoles} onChange={this.handleMultiSelect} type="select"
                                name="role" id="role" multiple>
                                {roleList}
                            </Input>
                            {this.renderErrorFor('users')}
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

export default AddUser
