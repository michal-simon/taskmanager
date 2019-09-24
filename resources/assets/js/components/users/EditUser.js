/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'
import PropTypes from 'prop-types'

class EditUser extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            loading: false,
            errors: [],
            user: [],
            roles: [],
            selectedRoles: []
        }
        this.toggle = this.toggle.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.handleMultiSelect = this.handleMultiSelect.bind(this)
    }

    componentDidMount () {
        this.getUser()
    }

    getUser () {
        axios.get(`/api/users/edit/${this.props.user_id}`)
            .then((r) => {
                this.setState({
                    roles: r.data.roles,
                    user: r.data.user,
                    selectedRoles: r.data.selectedIds
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    handleClick () {
        axios.put(`/api/users/${this.state.user.id}`, {
            username: this.state.user.username,
            email: this.state.user.email,
            first_name: this.state.user.first_name,
            last_name: this.state.user.last_name,
            profile_photo: this.state.user.profile_photo,
            password: this.state.user.password,
            role: this.state.selectedRoles
        })
            .then((response) => {
                const index = this.props.users.findIndex(user => parseInt(user.id) === this.props.user_id)
                this.props.users[index] = this.state.user
                this.props.action(this.props.users)
                this.toggle()
            })
            .catch((error) => {
                this.setState({
                    errors: error.response.data.errors
                })
            })
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

    hasErrorFor (field) {
        return !!this.state.errors[field]
    }

    setValues (values) {
        this.setState({ user: { ...this.state.user, ...values } })
        console.log(this.state.user)
    }

    handleInput (e) {
        this.setValues({ [e.target.name]: e.target.value })
    }

    handleMultiSelect (e) {
        this.setState({ selectedRoles: Array.from(e.target.selectedOptions, (item) => item.value) })
    }

    toggle () {
        this.setState({
            modal: !this.state.modal
        })
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
                <Button color="success" onClick={this.toggle}>Update</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Edit User
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="username">Username(*):</Label>
                            <Input className={this.hasErrorFor('username') ? 'is-invalid' : ''} type="text"
                                name="username" defaultValue={this.state.user.username}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('username')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="email">Email(*):</Label>
                            <Input className={this.hasErrorFor('email') ? 'is-invalid' : ''} type="email" name="email"
                                defaultValue={this.state.user.email} onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('email')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="first_name">Name(*):</Label>
                            <Input className={this.hasErrorFor('first_name') ? 'is-invalid' : ''} type="text"
                                name="first_name" defaultValue={this.state.user.first_name}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('first_name')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="last_name">Last Name(*):</Label>
                            <Input className={this.hasErrorFor('last_name') ? 'is-invalid' : ''} type="text"
                                name="last_name" defaultValue={this.state.user.last_name}
                                onChange={this.handleInput.bind(this)}/>
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
                                name="password" defaultValue={this.state.user.password}
                                onChange={this.handleInput.bind(this)}/>
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
                        <Button color="primary" onClick={this.handleClick.bind(this)}>Update</Button>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }
}

export default EditUser

EditUser.propTypes = {
    user: PropTypes.object,
    users: PropTypes.array,
    action: PropTypes.func
}
