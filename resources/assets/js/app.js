import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard'
import UserList from './components/UserList'
import Invoice from './components/invoice/Invoice'

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

if (window.location.pathname.indexOf("invoice") >= 0) {
    let invoice_id = getUrlParameter('invoice_id')
    invoice_id = invoice_id ? invoice_id : ''
    ReactDOM.render(<Invoice invoice_id={invoice_id}/>, document.getElementById('app'));

} else if (window.location.pathname.indexOf("users/dashboard") >= 0) {
     ReactDOM.render(<UserList project_id="2"/>, document.getElementById('app'));
} else {
    ReactDOM.render(<Dashboard project_id="2"/>, document.getElementById('app'));
}
