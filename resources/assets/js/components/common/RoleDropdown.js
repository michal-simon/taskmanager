import React, { Component } from 'react'
import axios from "axios";
import { Input, FormGroup, Label, Form } from 'reactstrap'


export default class RoleDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            roles: []
        }

        this.getRoles = this.getRoles.bind(this)
    }

    componentDidMount() {
        if (!this.props.roles || !this.props.roles.length) {
            this.getRoles()
        } else {
            this.setState({roles: this.props.roles})
        }
    }

    getRoles() {
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

    render () {
        let roleList = null
        if (!this.state.roles.length) {
            roleList = <option value="">Loading...</option>
        } else {
            roleList = this.state.roles.map((role, index) => (
                <option key={index} value={role.id}>{role.name}</option>
            ))
        }

        const name = this.props.name && this.props.name ? this.props.name : 'role'

        return (
            <FormGroup>
                <Input value={this.props.role} onChange={this.props.handleInputChanges} type="select"
                    name={name} id={name} 
                    multiple={this.props.multiple && this.props.multiple === true ? 'multiple' : ''}
                >
                    <option value="">Select Role</option>
                    {roleList}
                </Input>
                {this.props.renderErrorFor('role')}
            </FormGroup>
        )
    }
}
