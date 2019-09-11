import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard'
import UserList from './components/UserList'

import {Router,browserHistory} from 'react-router'
import routes from './routes'


if (window.location.pathname.indexOf("users/dashboard") >= 0) {
    const parentClass = ReactDOM.render(<UserList project_id="2"/>, document.getElementById('app'));
} else {
    const parentClass = ReactDOM.render(<Dashboard project_id="2"/>, document.getElementById('app'));
}
