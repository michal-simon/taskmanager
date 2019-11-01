import React, {Component} from 'react'
import axios from "axios";
import {Input, FormGroup, Label, Form} from 'reactstrap'


export default class UserDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            users: []
        }

        this.getUsers = this.getUsers.bind(this)
    }

    componentDidMount() {
        if (!this.props.users || !this.props.users.length) {
            this.getUsers()
        }
    }

    getUsers() {
        axios.get('/api/users')
            .then((r) => {
                this.setState({
                    users: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    render() {
        let userList = null
        if (!this.state.users.length) {
            userList = <option value="">Loading...</option>
        } else {
            userList = this.state.users.map((user, index) => (
                <option key={index} value={user.id}>{user.first_name}</option>
            ))
        }

        return (
            <FormGroup>
                <Label for="user_id">User</Label>
                <Input value={this.props.user} onChange={this.props.handleInputChanges} type="select"
                       name="user_id" id="user_id">
                    <option value="">Select User</option>
                    {userList}
                </Input>
                {this.props.renderErrorFor('user_id')}
            </FormGroup>
        )
    }
}
