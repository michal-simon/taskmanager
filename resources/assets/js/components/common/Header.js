import React,{Component} from 'react'
import {Link} from 'react-router'
import AddUser from '../forms/AddUser'


class Header extends Component{

    render(){
        return(
                <header>
                  <div className="container containerDashboard">
                    <div className="mainMenu">
                      <ul>
                      {/* <a href="/story/1" activeClassName="active"><li><i className="fas fa-folder-open"></i><span className="mainMenuText">Projects</span></li></a>
                      <a href="/about" activeClassName="active"><li><i className="fas fa-thumbs-up"/><span className="mainMenuText">About</span></li></a>
                      <a rel="noopener noreferrer" target="_blank" href="https://github.com/mreorhan/Scrum-Task-Management-with-ReactJS-Express-Server"><li><i className="fas fa-code-branch"/><span className="mainMenuText">Fork Me on Github</span></li></a> */}
                      </ul>
                    </div>
                    <div className="profilewidget">
                    </div>
                  </div>
                </header>
        )
    }
}
export default Header