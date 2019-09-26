import React, { Component } from 'react'
import {
    Card, CardImg, CardText, CardBody,
    CardHeader,
    CardTitle, CardSubtitle, Button
} from 'reactstrap'

export class Weather extends Component {
    render () {
        return (
            <div className="card no-border box-shadow-0" style={{height: '479px'}}>
                <div className="card-content">
                    <div className="weather-date position-relative">
                        <div className="date-info position-absolute bg-grey bg-lighten-1 white mt-3 p-1 text-center">
                            <span className="date block">14</span>
                            <span className="month">Nov</span>
                        </div>
                    </div>
                    <div className="card-body bg-grey bg-lighten-2">
                    <ul className="list-inline text-right">
                        <li><a data-action="reload"><i className="ft-rotate-cw font-medium-4 grey"></i></a></li>
                    </ul>
                    <div className="animated-weather-icons text-center">
                        <svg version="1.1" id="cloudHailAlt" className="climacon climacon_cloudHailAlt climacon-grey climacon-darken-2 height-200" viewBox="15 15 70 70">
                            <g className="climacon_iconWrap climacon_iconWrap-cloudHailAlt">
                                <g className="climacon_wrapperComponent climacon_wrapperComponent-hailAlt">
                                    <g className="climacon_component climacon_component-stroke climacon_component-stroke_hailAlt climacon_component-stroke_hailAlt-left">
                                        <circle cx="42" cy="65.498" r="2"></circle>
                                    </g>
                                    <g className="climacon_component climacon_component-stroke climacon_component-stroke_hailAlt climacon_component-stroke_hailAlt-middle">
                                        <circle cx="49.999" cy="65.498" r="2"></circle>
                                    </g>
                                    <g className="climacon_component climacon_component-stroke climacon_component-stroke_hailAlt climacon_component-stroke_hailAlt-right">
                                        <circle cx="57.998" cy="65.498" r="2"></circle>
                                    </g>
                                    <g className="climacon_component climacon_component-stroke climacon_component-stroke_hailAlt climacon_component-stroke_hailAlt-left">
                                        <circle cx="42" cy="65.498" r="2"></circle>
                                    </g>
                                    <g className="climacon_component climacon_component-stroke climacon_component-stroke_hailAlt climacon_component-stroke_hailAlt-middle">
                                        <circle cx="49.999" cy="65.498" r="2"></circle>
                                    </g>
                                    <g className="climacon_component climacon_component-stroke climacon_component-stroke_hailAlt climacon_component-stroke_hailAlt-right">
                                        <circle cx="57.998" cy="65.498" r="2"></circle>
                                    </g>
                                </g>
                                <g className="climacon_wrapperComponent climacon_wrapperComponent-cloud">
                                    <path className="climacon_component climacon_component-stroke climacon_component-stroke_cloud" d="M63.999,64.941v-4.381c2.39-1.384,3.999-3.961,3.999-6.92c0-4.417-3.581-8-7.998-8c-1.602,0-3.084,0.48-4.334,1.291c-1.23-5.317-5.974-9.29-11.665-9.29c-6.626,0-11.998,5.372-11.998,11.998c0,3.549,1.55,6.728,3.999,8.924v4.916c-4.776-2.768-7.998-7.922-7.998-13.84c0-8.835,7.162-15.997,15.997-15.997c6.004,0,11.229,3.311,13.966,8.203c0.663-0.113,1.336-0.205,2.033-0.205c6.626,0,11.998,5.372,11.998,12C71.998,58.863,68.656,63.293,63.999,64.941z"></path>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <div className="weather-details text-center">
                        <span className="mt-2 block grey darken-1">Snow</span>
                        <span className="font-medium-4 text-bold-500 grey darken-4">London, UK</span>
                    </div>
                </div>
                    <div className="card-footer bg-grey bg-darken-3 py-3 no-border">
                        <div className="row">
                            <div className="col-4 text-center display-table-cell">
                                <i className="ft-wind font-large-1 white lighten-3 valign-middle"></i> <span
                                className="white valign-middle">2MPH</span>
                            </div>
                            <div className="col-4 text-center display-table-cell">
                                <i className="ft-sun font-large-1 white lighten-3 valign-middle"></i> <span
                                className="white valign-middle">2%</span>
                            </div>
                            <div className="col-4 text-center display-table-cell">
                                <i className="ft-thermometer font-large-1 white lighten-3 valign-middle"></i> <span
                                className="white valign-middle">13.0°</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Weather

