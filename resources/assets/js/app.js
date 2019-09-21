import React from 'react';
import App from './components/App'
import ReactDOM from 'react-dom';

//https://pixinvent.com/bootstrap-admin-template/robust/html/ltr/vertical-multi-level-menu-template/

alert(window.location.href)

if (window.location.href.indexOf("dashboard") > -1) {
    alert('Mike')
} else {
    ReactDOM.render(<App />, document.getElementById('app'));
}



