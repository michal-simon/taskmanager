import React, { Component } from 'react'
import {
    Card, CardImg, CardText, CardBody,
    CardHeader,
    CardTitle, CardSubtitle, Button
} from 'reactstrap'

export class Tasks extends Component {
    render () {
        return (
            <Card style={{height: '410px'}}>
                <CardHeader style={{backgroundColor: '#FFF'}} className='no-border'>
                    <CardTitle>
                        Deals
                        <span className="text-muted text-bold-400">
                            - Won 5
                        </span>
                    </CardTitle>

                    <a className="heading-elements-toggle">
                        <i className="ft-more-horizontal font-medium-3"></i>
                    </a>
                    
                    <div className="heading-elements">
                        <ul className="list-inline mb-0">
                            <li><a data-action="reload"><i className="ft-rotate-cw"></i></a></li>
                        </ul>
                    </div>
                </CardHeader>
                <div className="card-content">
                    <div id="deals-list-scroll" className="card-body height-350 position-relative ps-container ps-theme-default" data-ps-id="6205b797-6d0d-611f-25fd-16195eadda29">
                    <div className="media">
                        <div className="media-left pr-2">
                            <img className="media-object avatar avatar-md rounded-circle" src="../../../app-assets/images/portrait/small/avatar-s-4.png" alt="Generic placeholder image"/>
                        </div>
                        <div className="media-body">
                            <p className="text-bold-600 m-0">ABC Inc. deal title <span className="float-right badge badge-success">Won</span></p>
                            <p className="font-small-2 text-muted m-0">$122,000.88<i className="ft-calendar pl-1"></i> Yesterday</p>
                        </div>
                    </div>
                    <div className="media mt-1">
                        <div className="media-left pr-2">
                        <img className="media-object avatar avatar-md rounded-circle" src="../../../app-assets/images/portrait/small/avatar-s-5.png" alt="Generic placeholder image" />
                        </div>
                        <div className="media-body">
                            <p className="text-bold-600 m-0">Donec ac condimentum massa <span className="float-right badge badge-primary">Opened</span></p>
                            <p className="font-small-2 text-muted m-0">$80,000.52<i className="ft-calendar pl-1"></i> 2 Weeks ago</p>
                        </div>
                    </div>
                    
                <div className="ps-scrollbar-x-rail" style={{left: '0px', bottom: '3px'}}>
                    <div className="ps-scrollbar-x" tabIndex="0" style={{left: '0px', width: '0px'}}></div></div>
                        <div className="ps-scrollbar-y-rail" style={{top: '0px', right: '3px'}}>
                            <div className="ps-scrollbar-y" tabIndex="0" style={{top: '0px', height: '0px'}}></div></div></div>
                </div>

            </Card>
        )
    }
}

export default Tasks