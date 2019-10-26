import React, { Suspense, lazy, Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.scss';
import DefaultLayout from "./containers/DefaultLayout";
import Login from "./Login";

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

class App extends Component {
    constructor(props) {

        super(props)
        this.state = {
            authenticated: false
        }
    }

    render() {

        return (
            <HashRouter>
                <React.Suspense fallback={loading()}>
                    <Switch>
                        <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
                        <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
                        <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
                        <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
                        <Route path="/" name="Home" render={props => <DefaultLayout {...props}/>} />
                    </Switch>
                </React.Suspense>
            </HashRouter>
        );
    }
}

export default App;
const axios = require('axios');

if(localStorage.getItem('access_token')) {
    const accessToken = localStorage.getItem('access_token')
    axios.defaults.headers.common = {'Authorization': `Bearer ${accessToken}`}
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}

const UNAUTHORIZED = 401;
axios.interceptors.response.use(
    response => response,
    error => {
        const {status} = error.response;
        if (status === UNAUTHORIZED) {
            userSignOut();
        }
        return Promise.reject(error);
    }
);

function userSignOut() {
    window.location.href = '/Login#/login'
}