import React, {Component} from 'react'
import axios from "axios";
import {Input, FormGroup, Label, Form} from 'reactstrap'


export default class EventTypeDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            eventTypes: []
        }

        this.getEventTypes = this.getEventTypes.bind(this)
    }

    componentDidMount() {
        if (!this.props.eventTypes || !this.props.eventTypes.length) {
            this.getEventTypes()
        }
    }

    getEventTypes() {
        axios.get('/api/event-types')
            .then((r) => {
                this.setState({
                    eventTypes: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    render() {
        let eventTypeList = null
        if (!this.state.eventTypes.length) {
            eventTypeList = <option value="">Loading...</option>
        } else {
            eventTypeList = this.state.eventTypes.map((eventType, index) => (
                <option key={index} value={eventType.id}>{eventType.name}</option>
            ))
        }

        return (
            <FormGroup>
                <Label for="event_type">Event Type</Label>
                <Input value={this.props.event_type} onChange={this.props.handleInputChanges} type="select"
                       name="event_type" id="event_type">
                    <option value="">Select Event Type</option>
                    {eventTypeList}
                </Input>
                {this.props.renderErrorFor('event_type')}
            </FormGroup>
        )
    }
}