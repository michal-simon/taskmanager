/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import EditUser from './EditUser'
import AddUser from './AddUser'
import { Button } from 'reactstrap'
import Directory from '../common/Directory'
import Avatar from '../common/Avatar'

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
        this.setState({ users: users })
    }

    userList () {

        if (this.state.users && this.state.users.length) {

            const list = this.state.users.map(user => {

                return (
                    <li className="list-group-item">
                        <div className="row w-100">
                            <div className="col-12 col-sm-6 col-md-3 px-0">
                                {/*<img src="http://demos.themes.guide/bodeo/assets/images/users/m101.jpg" alt="Mike Anamendolla" className="rounded-circle mx-auto d-block img-fluid" />*/}
                                <Avatar lg={true} name={user.first_name + ' ' + user.last_name} />

                            </div>
                            <div className="col-12 col-sm-6 col-md-9 text-center text-sm-left">
                                <span className="float-right pulse" title="online now">
                                    <Button color="danger" onClick={() => this.deleteUser(user.id)}>Delete</Button>
                                    <EditUser user_id={user.id} users={this.state.users} action={this.addUserToState}/>

                                </span>
                                <label className="name lead">{user.first_name + ' ' + user.last_name}</label>
                                <br />
                                <span className="fa fa-phone fa-fw text-muted" data-toggle="tooltip" title="" data-original-title={this.displayCustomerPhone(customer.address)}></span>
                                <span className="text-muted small">{this.displayCustomerPhone(customer.address)}</span>
                                <br/>
                                <span className="fa fa-envelope fa-fw text-muted" data-toggle="tooltip" data-original-title="" title=""></span>
                                <span className="text-muted small text-truncate">{user.email}</span>
                            </div>
                        </div>
                    </li>
                )

            })


            return (
                <div className="col-12 mt-3">
                    <div className="card card-default" id="card_contacts">
                        <div id="contacts" className="panel-collapse collapse show">
                            <ul className="pull-down list-group" id="contact-list">
                                {list}
                            </ul>
                        </div>
                    </div>
                </div>
            )

        } else {
            return <p className="text-center">No Records Found.</p>
        }


        // if (this.state.users && this.state.users.length) {
        //     return this.state.users.map(user => {
        //         const columnList = Object.keys(user).map(key => {
        //             if (key === 'id') {
        //                 return <td key={key}><Avatar name={user.first_name + ' ' + user.last_name}/></td>
        //             }
        //             return <td key={key}>{user[key]}</td>
        //         })
        //         return <tr key={user.id}>
        //
        //             {columnList}
        //
        //             <td>
        //                 <Button color="danger" onClick={() => this.deleteUser(user.id)}>Delete</Button>
        //                 <EditUser user_id={user.id} users={this.state.users} action={this.addUserToState}/>
        //             </td>
        //         </tr>
        //     })
        // } else {
        //     return <tr>
        //         <td className="text-center">No Records Found.</td>
        //     </tr>
        // }
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

                <Directory
                    userList={this.userList}
                    fetchUrl={fetchUrl}
                    updateState={this.addUserToState}
                />

            </div>
        )
    }
}
