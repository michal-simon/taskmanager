import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard'

import {Router,browserHistory} from 'react-router'
import routes from './routes'

const parentClass = ReactDOM.render(<Dashboard project_id="2"/>, document.getElementById('app'));