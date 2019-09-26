/*!
=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================
* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { Component } from 'react'
import ChartistGraph from 'react-chartist'
import { Grid, Row, Col } from 'react-bootstrap'
import { CardModule } from './common/Card.jsx'
import ReactEcharts from 'echarts-for-react';
import { StatsCard } from './common/StatsCard.jsx'
import { Tasks } from './common/Tasks.jsx'
import { Weather } from './common/Weather.jsx'
import * as echarts from 'echarts/dist/echarts.js';

import {
    dataPie,
    legendPie,
    dataSales,
    optionsSales,
    responsiveSales,
    legendSales,
    dataBar,
    optionsBar,
    responsiveBar,
    legendBar
} from './common/Variables.jsx'

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.getInitialState = this.getInitialState.bind(this)
        this.state = this.getInitialState();
        this.getOption = this.getOption.bind(this)
    }

    getInitialState ()  {
        return this.getOption()
    }

    createLegend (json) {
        var legend = []
        for (var i = 0; i < json["names"].length; i++) {
            var type = 'fa fa-circle text-' + json['types'][i]
            legend.push(<i className={type} key={i}/>)
            legend.push(' ')
            legend.push(json['names'][i])
        }
        return legend
    }

    getOption () {
        return {
            backgroundColor: '#1b1b1b',
            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b}: {c}%"
                            },
            legend: {
                                orient: 'horizontal',
                                x: 'left',
                                y: 0,
                                data: ['Opened', 'Lost', 'Demo', 'Contacted', 'Won', 'No Show']
                            },
            // Add Custom Colors
                        color: ['#0FB365', '#1EC481', '#28D094', '#48D7A4', '#94E8CA', '#BFF1DF'],

                        // Enable drag recalculate
                        calculable: true,
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            series: [
                            {
                                name: 'Deals',
                                type: 'funnel',
                                funnelAlign: 'left',
                                x: '25%',
                                x2: '25%',
                                y: '17.5%',
                                width: '50%',
                                height: '80%',
                                data: [
                                    {value: 100, name: 'Opened'},
                                    {value: 70, name: 'Lost'},
                                    {value: 60, name: 'Demo'},
                                    {value: 40, name: 'Contacted'},
                                    {value: 20, name: 'Won'},
                                    {value: 10, name: 'No Show'},
                                ]
                            }
                        ]
        };
    };

    render () {
        return (
            <div className="content">
                <div className="content-wrapper">
                    <div className="content-header row"></div>
                    <div className="content-body">
                        <Row>
                            <Col className="col-xl-4" lg={6} md={12}>
                                <CardModule
                                    body={true}
                                    hCenter={true}
                                    header={
                                        <React.Fragment>
                                            <span className="success darken-1">Total Budget</span>
                                            <h3 className="font-large-2 grey darken-1 text-bold-200">$24,879</h3>
                                        </React.Fragment>
                                    }
                                    content={
                                        <React.Fragment>
                                            <input type="text" value="75"
                                                   className="knob hide-value responsive angle-offset"
                                                   data-angleOffset="0" data-thickness=".15"
                                                   data-linecap="round" data-width="150"
                                                   data-height="150" data-inputColor="#e1e1e1"
                                                   data-readOnly="true" data-fgColor="#37BC9B"
                                                   data-knob-icon="ft-trending-up"/>

                                            <ul className="list-inline clearfix mt-2 mb-0">
                                                <li className="border-right-grey border-right-lighten-2 pr-2">
                                                    <h2 className="grey darken-1 text-bold-400">75%</h2>
                                                    <span className="success">Completed</span>
                                                </li>
                                                <li className="pl-2">
                                                    <h2 className="grey darken-1 text-bold-400">25%</h2>
                                                    <span className="danger">Remaining</span>
                                                </li>
                                            </ul>
                                        </React.Fragment>
                                    }
                                />
                            </Col>
                            <Col className="col-xl-4" lg={6} md={12}>
                                <CardModule
                                    body={false}
                                    content={
                                        <div className="earning-chart position-relative">
                                            <div className="chart-title position-absolute mt-2 ml-2">
                                                <h1 className="font-large-2 grey darken-1 text-bold-200">$9,86M</h1>
                                                <span className="text-muted">Total Earning</span>
                                            </div>
                                            <div className="chartjs height-400">
                                                <canvas id="earning-chart" className="height-400 block"></canvas>
                                            </div>
                                            <div
                                                className="chart-stats position-absolute position-bottom-0 position-right-0 mb-2 mr-3">
                                                <a href="#" className="btn bg-info mr-1 white">Statistics <i
                                                    className="ft-bar-chart"></i></a> <span className="text-muted">for the <a
                                                href="#">last year.</a></span>
                                            </div>
                                        </div>
                                    }
                                />
                            </Col>
                            <Col className="col-xl-4" lg={12} md={12}>
                                <CardModule
                                    body={true}
                                    content={
                                        <div>
                                            <div className="media">
                                                <div className="media-body text-left">
                                                    <h3 className="success">2,780</h3>
                                                    <span>Today's Leads</span>
                                                </div>
                                                <div className="media-right media-middle">
                                                    <i className="ft-award success font-large-2 float-right"></i>
                                                </div>
                                            </div>

                                            <div className="progress mt-1 mb-0" style={{ height: '7px' }}>
                                                <div className="progress-bar bg-success" role="progressbar"
                                                     style={{ width: '80%' }} aria-valuenow="80" aria-valuemin="0"
                                                     aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    }
                                />

                                <CardModule
                                    body={true}
                                    content={
                                        <div>
                                            <div className="media">
                                                <div className="media-body text-left">
                                                    <h3 className="deep-orange">2,780</h3>
                                                    <span>New Deal</span>
                                                </div>
                                                <div className="media-right media-middle">
                                                    <i className="ft-package deep-orange font-large-2 float-right"></i>
                                                </div>
                                            </div>

                                            <div className="progress mt-1 mb-0" style={{ height: '7px' }}>
                                                <div className="progress-bar bg-deep-orange" role="progressbar"
                                                     style={{ width: '35%' }} aria-valuenow="35" aria-valuemin="0"
                                                     aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    }
                                />

                                <CardModule
                                    body={true}
                                    content={
                                        <div>
                                            <div className="media">
                                                <div className="media-body text-left">
                                                    <h3 className="info">456</h3>
                                                    <span>New Customers</span>
                                                </div>
                                                <div className="media-right media-middle">
                                                    <i className="ft-users info font-large-2 float-right"></i>
                                                </div>
                                            </div>

                                            <div className="progress mt-1 mb-0" style={{ height: '7px' }}>
                                                <div className="progress-bar bg-success" role="progressbar"
                                                     style={{ width: '35%' }} aria-valuenow="35" aria-valuemin="0"
                                                     aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    }
                                />
                            </Col>
                        </Row>

                        <Row className="match-height">
                            <Col className="col-xl-6" lg={12}>
                                <CardModule
                                    body={true}
                                    header={
                                        <React.Fragment>
                                            <h4 className="card-title">Deals Funnel <span className="text-muted text-bold-400">This Month</span></h4>
                                            <a className="heading-elements-toggle"><i className="ft-more-horizontal font-medium-3"></i></a>
                                            <div className="heading-elements">
                                               <ul className="list-inline mb-0">
                                                   <li><a data-action="reload"><i className="ft-rotate-cw"></i></a></li>
                                               </ul>
                                            </div>
                                </React.Fragment>
                                       
                                    }
                                    content={
                                        <ReactEcharts option={this.getOption()} />
                                    }
                                />

                            </Col>
                            <Col className="col-xl-6" lg={12}>
                                <CardModule
                                    cardHeight='410px'
                                    body={true}
                                    header={
                                        <React.Fragment>
                                            <h4 className="card-title">Deals <span className="text-muted text-bold-400">- Won 5</span></h4>
                                            <a className="heading-elements-toggle"><i className="ft-more-horizontal font-medium-3"></i></a>
                                            <div className="heading-elements">
                                                <ul className="list-inline mb-0">
                                                    <li><a data-action="reload"><i className="ft-rotate-cw"></i></a></li>
                                                </ul>
                                            </div>
                                        </React.Fragment>

                                    }
                                    content={
                                        <div style={{height: '300px', overflowY: 'auto'}} id="deals-list-scroll" className="card-body height-350 position-relative ps-container ps-theme-default" data-ps-id="6205b797-6d0d-611f-25fd-16195eadda29">
                                            <div className="media">
                                                <div className="media-left pr-2">
                                                    <img className="media-object avatar avatar-md rounded-circle" src="/files/avatar-s-4.png" alt="Generic placeholder image" />
                                                </div>
                                                <div className="media-body">
                                                    <p className="text-bold-600 m-0">ABC Inc. deal title <span className="float-right badge badge-success">Won</span></p>
                                                    <p className="font-small-2 text-muted m-0">$122,000.88<i className="ft-calendar pl-1"></i> Yesterday</p>
                                                </div>
                                            </div>
                                            <div className="media mt-1">
                                                <div className="media-left pr-2">
                                                    <img className="media-object avatar avatar-md rounded-circle" src="/files/avatar-s-5.png" alt="Generic placeholder image" />
                                                </div>
                                                <div className="media-body">
                                                    <p className="text-bold-600 m-0">Donec ac condimentum massa <span className="float-right badge badge-primary">Opened</span></p>
                                                    <p className="font-small-2 text-muted m-0">$80,000.52<i className="ft-calendar pl-1"></i> 2 Weeks ago</p>
                                                </div>
                                            </div>
                                            <div className="media mt-1">
                                                <div className="media-left pr-2">
                                                    <img className="media-object avatar avatar-md rounded-circle" src="/files/avatar-s-6.png" alt="Generic placeholder image" />
                                                </div>
                                                <div className="media-body">
                                                    <p className="text-bold-600 m-0">Simply dummy text of the printing <span className="float-right badge badge-danger">Lost</span></p>
                                                    <p className="font-small-2 text-muted m-0">$40,215.28<i className="ft-calendar pl-1"></i> 1 Month ago</p>
                                                </div>
                                            </div>
                                            <div className="media mt-1">
                                                <div className="media-left pr-2">
                                                    <img className="media-object avatar avatar-md rounded-circle" src="/files/avatar-s-7.png" alt="Generic placeholder image" />
                                                </div>
                                                <div className="media-body">
                                                    <p className="text-bold-600 m-0">The generated Lorem or title <span className="float-right badge badge-warning">Demo</span></p>
                                                    <p className="font-small-2 text-muted m-0">$25,215.28<i className="ft-calendar pl-1"></i> 1 Month ago</p>
                                                </div>
                                            </div>
                                            <div className="media mt-1">
                                                <div className="media-left pr-2">
                                                    <img className="media-object avatar avatar-md rounded-circle" src="/files/avatar-s-8.png" alt="Generic placeholder image" />
                                                </div>
                                                <div className="media-body">
                                                    <p className="text-bold-600 m-0">The standard chunk of Lorem <span className="float-right badge badge-info">Contected</span></p>
                                                    <p className="font-small-2 text-muted m-0">$12,215.28<i className="ft-calendar pl-1"></i> 11/11/2016</p>
                                                </div>
                                            </div>
                                            <div className="media mt-1">
                                                <div className="media-left pr-2">
                                                    <img className="media-object avatar avatar-md rounded-circle" src="/files/avatar-s-9.png" alt="Generic placeholder image" />
                                                </div>
                                                <div className="media-body">
                                                    <p className="text-bold-600 m-0">Nam in egestas onsectetur <span className="float-right badge badge-secondary">No Show</span></p>
                                                    <p className="font-small-2 text-muted m-0">$11,215.28<i className="ft-calendar pl-1"></i> 10/10/2016</p>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                />
                            </Col>
                        </Row>

                        <Row className="match-height">
                            <Col className="col-xl-8" lg={12}>
                                <StatsCard />
                            </Col>

                            <Col className="col-xl-4" lg={12}>
                                <Weather />
                            </Col>
                        </Row>

                    </div>

                </div>

            </div>
        )
    }
}

export default Dashboard