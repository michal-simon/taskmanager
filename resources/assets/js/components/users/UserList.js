/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import EditUser from './EditUser'
import AddUser from './AddUser'
import { Button } from 'reactstrap'
import DataTable from '../common/DataTable'
import Avatar from '../common/Avatar'
import { Input, FormGroup } from 'reactstrap'

export default class UserList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            users: [],
            departments: [],
            errors: []
        }

        this.cachedResults = []
        this.addUserToState = this.addUserToState.bind(this)
        this.userList = this.userList.bind(this)
    }

    componentDidMount () {
        this.getDepartments()
    }

    filterDepartments (e) {

        const deptId = e.target.value

        if(deptId === '') {
            this.setState({ users:cachedResults })
            return
        }

        axios.get(`/api/users/department/${deptId}`)
            .then((r) => {
                this.cachedResults = this.state.users

                this.setState({
                    users: r.data
                })
            })
            .catch((e) => {
                alert(e)
            })
    }

    buildDepartmentOptions () {
        let departmentList
        if (!this.state.departments.length) {
            departmentList = <option value="">Loading...</option>
        } else {
            departmentList = this.state.departments.map((department, index) => (
                <option key={index} value={department.id}>{department.name}</option>
            ))
        }

        return (
            <div className="col-4">
                <FormGroup>
                    <Input onChange={this.filterDepartments.bind(this)} type="select" name="department" id="department">
                        <option value="">Select Department</option>
                        {departmentList}
                    </Input>
                </FormGroup>
            </div>
        )
    }

    getDepartments () {
        axios.get('/api/departments')
            .then((r) => {
                this.setState({
                    departments: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    addUserToState (users) {
        this.setState({ users: users })
    }

    userList () {
        if (this.state.users && this.state.users.length) {
            return this.state.users.map(user => {
                const columnList = Object.keys(user).map(key => {
                    if (key === 'id') {
                        return <td key={key}><Avatar name={user.first_name + ' ' + user.last_name}/></td>
                    }

                    if(key !== 'department') {
                        return <td key={key}>{user[key]}</td>
                    }

                })
                return <tr key={user.id}>

                    {columnList}

                    <td>
                        <Button color="danger" onClick={() => this.deleteUser(user.id)}>Delete</Button>
                        <EditUser departments={this.state.departments} user_id={user.id} users={this.state.users} action={this.addUserToState}/>
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
        const departmentOptions = this.buildDepartmentOptions()

        return (
            <div className="data-table m-md-3 m-0">

                <AddUser departments={this.state.departments} users={this.state.users} action={this.addUserToState}/>

                {departmentOptions}

                <DataTable
                    ignore={['department']}
                    userList={this.userList}
                    fetchUrl={fetchUrl}
                    updateState={this.addUserToState}
                />

            </div>
        )
    }
}