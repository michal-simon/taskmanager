/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import EditUser from './EditUser'
import AddUser from './AddUser'
import {Button, Form, FormGroup} from 'reactstrap'
import DataTable from '../common/DataTable'
import Avatar from '../common/Avatar'
import CreateEvent from "../calendar/CreateEvent";
import TaskDropdown from "../common/TaskDropdown";
import UserDropdown from "../common/UserDropdown";
import CustomerDropdown from "../common/CustomerDropdown";
import EventTypeDropdown from "../common/EventTypeDropdown";
import DepartmentDropdown from "../common/DepartmentDropdown";
import RoleDropdown from "../common/RoleDropdown";

export default class UserList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            users: [],
            departments: [],
            error: '',
            filters: [],
        }

        this.cachedResults = []
        this.addUserToState = this.addUserToState.bind(this)
        this.userList = this.userList.bind(this)
        this.filterUsers = this.filterUsers.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.ignoredColumns = ['department']
    }

    componentDidMount () {
        this.getDepartments()
    }

    filterUsers(event) {

        const column = event.target.id
        const value = event.target.value

        if (value === 'all') {
            const updatedRowState = this.state.filters.filter(filter => filter.column !== column)
            this.setState({filters: updatedRowState})
            return true
        }

        this.setState(prevState => ({
            filters: {
                ...prevState.filters,
                [column]: value,
            },
        }));

        return true
    }

    handleSubmit(event) {
        event.preventDefault()

        axios.post('/api/users/filterUsers',
            this.state.filters)
            .then((response) => {
                this.setState({users: response.data})
            })
            .catch((error) => {
                alert(error)
            })
    }

    renderErrorFor () {

    }

    resetFilters() {
        this.props.reset()
    }

    getFilters() {
        return (
            <Form inline className="pull-right" onSubmit={this.handleSubmit}>

                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <AddUser departments={this.state.departments} users={this.state.users} action={this.addUserToState}/>
                </FormGroup>

                <DepartmentDropdown
                    name="department_user.department_id"
                    renderErrorFor={this.renderErrorFor}
                    handleInputChanges={this.filterUsers}
                    departments={this.state.departments}
                />

                <RoleDropdown
                    name="role_user.role_id"
                    renderErrorFor={this.renderErrorFor}
                    handleInputChanges={this.filterUsers}
                    name="role_user.role_id"
                />

                <button className="mr-2 ml-2 btn btn-success">Submit</button>
                <button onClick={this.resetFilters} className="btn btn-primary">Reset</button>
            </Form>
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

                    if (this.ignoredColumns && !this.ignoredColumns.includes(key)) {
                        return <td className="align-middle" key={key}>{user[key]}</td>
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
                self.setState(
                    {
                        error: error.response.data
                    }
                )
            })
    }

    render () {
        const fetchUrl = '/api/users/'
        const filters = this.getFilters()
         const {error} = this.state

        return (
            <div className="data-table m-md-3 m-0">
            
            {error && <div className="alert alert-danger" role="alert">
                          {error}
                        </div>}

                {filters}

               <DataTable
                    disableSorting={['id']}
                    defaultColumn='last_name'
                    ignore={this.ignoredColumns}
                    userList={this.userList}
                    fetchUrl={fetchUrl}
                    updateState={this.addUserToState}
               />

            </div>
        )
    }
}
