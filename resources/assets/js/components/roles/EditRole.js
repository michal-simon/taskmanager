/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, InputGroupAddon, InputGroupText, InputGroup } from 'reactstrap'
import axios from 'axios'

class EditRole extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            loading: false,
            errors: [],
            name: this.props.role.name,
            description: this.props.role.description,
            permissions: [],
            attachedPermissions: [],
            selectedPermissions: [],
            role: []
        }
        this.toggle = this.toggle.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.handleMultiSelect = this.handleMultiSelect.bind(this)
        this.buildPermissionList = this.buildPermissionList.bind(this)
    }

    componentDidMount () {
        this.getRole()
    }

    handleInput (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleMultiSelect (e) {
        this.setState({ attachedPermissions: Array.from(e.target.selectedOptions, (item) => item.value) })
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
        axios.put(`/api/roles/${this.state.role.id}`, {
            name: this.state.name,
            description: this.state.description,
            permissions: this.state.attachedPermissions
        })
            .then((response) => {
                this.toggle()
                const index = this.props.roles.findIndex(role => role.id === this.props.role.id)
                this.props.roles[index].name = this.state.name
                this.props.roles[index].description = this.state.description
                this.props.action(this.props.roles)
            })
            .catch((error) => {
                this.setState({
                    errors: error.response.data.errors
                })
            })
    }

    getRole () {
        axios.get(`/api/roles/${this.props.role.id}`)
            .then((r) => {
                this.setState({
                    permissions: r.data.permissions,
                    attachedPermissions: r.data.attachedPermissions,
                    role: r.data.role
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    toggle () {
        this.setState({
            modal: !this.state.modal,
            errors: []
        })
    }
    
    buildPermissionList () {
        let permissionsList = null
        console.log('state', this.state)
        if (!this.state.permissions.length) {
            permissionsList = <option value="">Loading...</option>
        } else {
            permissionsList = this.state.permissions.map((permission, index) => {
                const selected = this.state.attachedPermissions.indexOf(permission.id) > -1 ? 'selected' : ''
                return (
                    <option selected={selected} key={index} value={permission.id}>{permission.name}</option>
                )
            })
        }
        
        return permissionsList
    }

    render () {
        
        let permissionsList = this.buildPermissionList()
       
        return (
            <React.Fragment>
                <Button className="ml-2" color="success" onClick={this.toggle}>Edit</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Update Role
                    </ModalHeader>
                    <ModalBody>
                         <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="fa fa-user-o"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input className={this.hasErrorFor('name') ? 'is-invalid' : ''} 
                                placeholder="Name"
                                type="text" name="name"
                                value={this.state.name} 
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('name')}
                        </InputGroup>

                       <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="fa fa-user-o"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input className={this.hasErrorFor('description') ? 'is-invalid' : ''} 
                                placeholder="Description"
                                type="text"
                                name="description" 
                                value={this.state.description}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('description')}
                        </InputGroup>

                         <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                                <InputGroupText><i className="fa fa-user-o"></i></InputGroupText>
                            </InputGroupAddon>
                            <Input onChange={this.handleMultiSelect} type="select" multiple>
                                {permissionsList}
                            </Input>
                        </InputGroup>

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

export default EditRole
