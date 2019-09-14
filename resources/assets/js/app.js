import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard'
import UserList from './components/users/UserList'
import Customers from './components/customers/Customers'

import {Router,browserHistory} from 'react-router'
import routes from './routes'

switch(true) {
    case window.location.pathname.indexOf("users/dashboard") >= 0:
        ReactDOM.render(<UserList/>, document.getElementById('app'));
        break;

        case window.location.pathname.indexOf("customers/dashboard") >= 0:

            ReactDOM.render(<Customers/>, document.getElementById('app'));

        break;

    default:
        ReactDOM.render(<Dashboard project_id="2"/>, document.getElementById('app'));
        break;
}
