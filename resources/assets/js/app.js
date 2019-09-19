import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard'
import UserList from './components/users/UserList'
import Invoice from './components/invoice/Invoice'
import Customers from './components/customers/Customers'
import Calendar from './components/calendar/Calendars'
import Roles from './components/roles/Roles'

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

    case window.location.href.indexOf("calendar?view") >= 0:
        ReactDOM.render(<Calendar />, document.getElementById('app'));
        break;

    case window.location.href.indexOf("roles?view") >= 0:
        ReactDOM.render(<Roles/>, document.getElementById('app'));
        break;

    case window.location.href.indexOf("users?view") >= 0:
        ReactDOM.render(<UserList/>, document.getElementById('app'));
        break;
    case window.location.pathname.indexOf("invoice") >= 0:
        let invoice_id = getUrlParameter('invoice_id')
        invoice_id = invoice_id ? invoice_id : ''
        ReactDOM.render(<Invoice invoice_id={invoice_id}/>, document.getElementById('app'));
        break;

        case window.location.href.indexOf("customers?view") >= 0:
            ReactDOM.render(<Customers/>, document.getElementById('app'));
        break;

    default:
        ReactDOM.render(<Dashboard task_type="1" project_id={project_id}/>, document.getElementById('app'));
        break;
}

