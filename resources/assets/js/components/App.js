/* eslint no-unused-vars: "React, Switch, Route, BrowserRouter, Dashboard, Login, ReactDOM" */

import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import UserList from './users/UserList'
import Dashboard from './Dashboard'
import Calendar from './calendar/Calendars'
import Roles from './roles/Roles'
import Invoice from './invoice/Invoice'
import Customers from './customers/Customers'
import ChatPage from './chat/ChatPage'
import Login from './Login'

class App extends Component {
    constructor (props, context) {
        super(props, context)

        this.state = {
            authenticated: false
        }

        this.setAuthenticated = this.setAuthenticated.bind(this)
    }

    getQueryVariable (variable) {
        const query = window.location.search.substring(1)
        const vars = query.split('&')
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=')

            if (pair[0] === variable) {
                return pair[1]
            }
        }

        return false
    }

    setAuthenticated (objUser) {
        this.setState({ authenticated: true })
        window.sessionStorage.setItem('authenticated', true)
        window.sessionStorage.setItem('username', objUser.username)
        window.sessionStorage.setItem('user_id', objUser.user_id)
    }

    render () {
        if (!this.state.authenticated && !window.sessionStorage.getItem('authenticated')) {
            return <Login action={this.setAuthenticated}/>
        }

        const projectId = this.getQueryVariable('project_id')

        return (
            <main>
                <BrowserRouter>
                    <Switch>
                        <Route path='/chat' component={ChatPage}/>
                        <Route path='/customers' component={Customers}/>
                        <Route path='/invoice' component={Invoice}/>
                        <Route path='/users' component={UserList}/>
                        <Route path='/calendar' component={Calendar}/>
                        <Route path='/roles' component={Roles}/>
                        <Route
                            path='/leads'
                            render={(props) => <Dashboard {...props} task_type={2} />}
                        />
                        <Route
                            path='/projects'
                            render={(props) => <Dashboard {...props} task_type={1} project_id={projectId} />}
                        />
                    </Switch>
                </BrowserRouter>
            </main>
        )
    }
}
export default App