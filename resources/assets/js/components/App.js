// resources/assets/js/components/App.js
// https://blog.pusher.com/react-laravel-application/
// https://code.tutsplus.com/tutorials/build-a-react-app-with-laravel-backend-part-2-react--cms-29443

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
// import Header from './Header'
// import NewProject from './NewProject'
// import ProjectList from './ProjectList'
// import SingleProject from './SingleProject'
// import Pagination from './Pagination'

class App extends Component {
  render () {
    alert('Mike')

    return (
        <div className="App">
            <Dashboard/>
        </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))