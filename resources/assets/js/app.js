import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard'
import UserList from './components/UserList'
import Invoice from './components/invoice/Invoice'

import {Router,browserHistory} from 'react-router'
import routes from './routes'

if (window.location.pathname.indexOf("invoice") >= 0) {
    ReactDOM.render(<Invoice customer_id="1"/>, document.getElementById('app'));

} else if (window.location.pathname.indexOf("users/dashboard") >= 0) {
     ReactDOM.render(<UserList project_id="2"/>, document.getElementById('app'));
} else {
    ReactDOM.render(<Dashboard project_id="2"/>, document.getElementById('app'));
}
