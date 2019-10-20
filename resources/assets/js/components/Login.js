/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'
import axios from 'axios'

export default class Login extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isLoggedIn: false,
            user: {},
            email: '',
            password: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    validateForm () {
        return this.state.email.length > 0 && this.state.password.length > 0
    }

    handleChange (event) {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    handleSubmit (event) {
        event.preventDefault()

        axios.post('/api/login', { email: this.state.email, password: this.state.password })
            .then((json) => {
                
                if (json.data.success) {
                    alert("Login Successful!");

                    let userData = {
                      name: json.data.data.name,
                      id: json.data.data.id,
                      email: json.data.data.email,
                      auth_token: json.data.data.auth_token,
                      timestamp: new Date().toString()
                    };
                    
                    let appState = {
                        isLoggedIn: true,
                        user: userData
                    };
          
                    window.sessionStorage.setItem('authenticated', true)
          
                    // save app state with user date in local storage
                    localStorage["appState"] = JSON.stringify(appState);
                    this.setState({
                      isLoggedIn: appState.isLoggedIn,
                      user: appState.user
                    });
          
                    this.props.action(json.data.data.auth_token)
          
                } else alert("Login Failed!");
            })
            .catch((e) => {
                alert(e)
            })
    }

    render () {
        return (
            <div className="Login">
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId="email" bsSize="large">
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                            autoFocus
                            type="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            value={this.state.password}
                            onChange={this.handleChange}
                            type="password"
                        />
                    </FormGroup>
                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                    >
                        Login
                    </Button>
                </form>
            </div>
        )
    }
}
