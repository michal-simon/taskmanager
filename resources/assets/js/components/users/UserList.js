/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import EditUser from './EditUser'
import AddUser from './AddUser'
import { Button } from 'reactstrap'
import DataTable from '../common/DataTable'

export default class UserList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            users: [],
            errors: []
        }

        this.addUserToState = this.addUserToState.bind(this)
        this.userList = this.userList.bind(this)
    }

    addUserToState (users) {

        console.log('users', users)

        this.setState({ users: users })
    }

    userList () {
        if (this.state.users && this.state.users.length) {
            return this.state.users.map(user => {
                const columnList = Object.keys(user).map(key => {
                    if (key === 'profile_photo') {
                        return <td key={key}>&nbsp;</td>
                    }
                    return <td key={key}>{user[key]}</td>
                })
                return <tr key={user.id}>

                    {columnList}

                    <td>
                        <Button color="danger" onClick={() => this.deleteUser(user.id)}>Delete</Button>
                        <EditUser user_id={user.id} users={this.state.users} action={this.addUserToState}/>
                    </td>
                </tr>
            })
        } else {
            return <tr>
                <td className="text-center">No Records Found.</td>
            </tr>
        }
    }

    deleteUser (id) {
        const self = this
        axios.delete('/api/users/' + id)
            .then(function (response) {
                const arrUsers = [...self.state.users]
                const index = arrUsers.findIndex(user => user.id === id)
                arrUsers.splice(index, 1)
                self.addUserToState(arrUsers)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    render () {
        const fetchUrl = '/api/users/'

        return (
            <div className="data-table m-md-3 m-0">

                <AddUser users={this.state.users} action={this.addUserToState}/>

                <DataTable
                    userList={this.userList}
                    fetchUrl={fetchUrl}
                    updateState={this.addUserToState}
                />

            </div>
        )
    }
}
