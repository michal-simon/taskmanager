import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard'
import UserList from './components/users/UserList'
//import Customers from './components/customers/Customers'

import {Router,browserHistory} from 'react-router'
import routes from './routes'

const getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

const project_id = getUrlParameter('project_id')

switch(true) {
    case window.location.pathname.indexOf("leads") >= 0:
        ReactDOM.render(<Dashboard task_type="2"/>, document.getElementById('app'));
        break;
    case window.location.href.indexOf("users?view") >= 0:
        ReactDOM.render(<UserList/>, document.getElementById('app'));
        break;

        case window.location.pathname.indexOf("customers/dashboard") >= 0:

            ReactDOM.render(<Customers/>, document.getElementById('app'));

        break;

    default:
        ReactDOM.render(<Dashboard task_type="1" project_id={project_id}/>, document.getElementById('app'));
        break;
}
