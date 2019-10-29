/* eslint-disable no-unused-vars */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'

const Label2 = styled.span`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  grid-column: ${props => props.col} / span ${props => props.colSpan};
  background: ${props => props.color};
  font-size: 0.8rem;
  line-height: 0.8rem;
  padding: 2px 6px;
  padding: 10px;
    background-color: #4fc3f7;
    color: #FFF;
`
Label2.defaultProps = {
    color: '#ddf'
}

class CalendarEvent extends React.Component {
    constructor (props) {
        super(props)
        const attendees = this.props.event.attendees ? this.props.event.attendees : []
        const arrAttendees = []
        attendees.map((attendee, index) => {
            arrAttendees.push(attendee.id)
        })

        this.state = {
            modal: false,
            title: this.props.event.title,
            beginDate: this.props.event.beginDate,
            endDate: this.props.event.endDate,
            customer_id: this.props.event.customer_id,
            location: this.props.event.location,
            loading: false,
            customers: [],
            users: [],
            errors: [],
            attendees: arrAttendees
        }
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.toggle = this.toggle.bind(this)
        this.handleMultiSelect = this.handleMultiSelect.bind(this)
        this.getUserList = this.getUserList.bind(this)
        this.getCustomerList = this.getCustomerList.bind(this)
    }

    componentDidMount () {
        this.getCustomers()
        this.getUsers()
    }

    hasErrorFor (field) {
        return !!this.state.errors[field]
    }

    renderErrorFor (field) {
        if (this.hasErrorFor(field)) {
            return (
                <span className='invalid-feedback'>
                    <strong>{this.state.errors[field][0]}</strong>
                </span>
            )
        }
    }

    handleInput (e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleClick (event) {
        axios.put(`/api/events/${this.props.event.id}`, {
            customer_id: this.state.customer_id,
            users: this.state.attendees,
            title: this.state.title,
            location: this.state.location,
            beginDate: this.state.beginDate,
            endDate: this.state.endDate
        })
            .then((response) => {
                this.toggle()
                const index = this.props.allEvents.findIndex(event => event.id === parseInt(this.props.event.id))
                const currentObject = this.props.allEvents[index]
                currentObject.title = this.state.title
                currentObject.location = this.state.location
                currentObject.beginDate = this.state.beginDate
                currentObject.endDate = this.state.endDate
                this.props.action(this.props.allEvents)
                // const firstEvent = response.data
                // this.props.events.push(firstEvent)
                // this.props.action(this.props.events)
            })
            .catch((error) => {
                alert(error)
            })
    }

    toggle () {
        this.setState({
            modal: !this.state.modal
        })
    }

    deleteEvent (id) {
        const self = this

        axios.delete('/api/events/' + id)
            .then(function (response) {
                const filteredArray = self.props.allEvents.filter(event => event.id !== parseInt(id))
                self.props.action(filteredArray)
            })
            .catch(function (error) {
                alert(error)
            })
    }

    getCustomers () {
        axios.get('/api/customers')
            .then((r) => {
                this.setState({
                    customers: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    getUsers () {
        axios.get('/api/users')
            .then((r) => {
                this.setState({
                    users: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    convertDate (inputFormat) {
        function pad (s) {
            return (s < 10) ? '0' + s : s
        }
        const d = new Date(inputFormat)
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/')
    }

    handleMultiSelect (e) {
        this.setState({ attendees: Array.from(e.target.selectedOptions, (item) => item.value) })
    }

    getCustomerList () {
        let customerList

        if (!this.state.customers.length) {
            customerList = <option value="">Loading...</option>
        } else {
            customerList = this.state.customers.map((customer, index) => {
                const selected = customer.id === this.state.customer_id ? 'selected' : ''
                return <option selected={selected} key={index} value={customer.id}>{customer.name}</option>
            })
        }

        return (
            <FormGroup>
                <Label for="customer_id">Customer:</Label>
                <Input className={this.hasErrorFor('customer_id') ? 'is-invalid' : ''} type="select"
                    name="customer_id"
                    id="customer_id"
                    onChange={this.handleInput.bind(this)}>
                    <option>Select Customer</option>
                    {customerList}
                </Input>
                {this.renderErrorFor('customer_id')}
            </FormGroup>
        )
    }

    getUserList () {
        let userList
        if (!this.state.users.length) {
            userList = <option value="">Loading...</option>
        } else {
            userList = this.state.users.map((user, index) => (
                <option key={index} value={user.id}>{user.first_name + ' ' + user.last_name}</option>
            ))
        }

        return (
            <FormGroup>
                <Label for="users">Attendees</Label>
                <Input value={this.state.attendees} onChange={this.handleMultiSelect} type="select"
                    name="users" id="users" multiple>
                    {userList}
                </Input>
                {this.renderErrorFor('users')}
            </FormGroup>
        )
    }

    render () {
        const { col, colSpan } = this.props
        const userList = this.getUserList()
        const customerList = this.getCustomerList()

        const beginDate = this.convertDate(this.state.beginDate)
        const endDate = this.convertDate(this.state.endDate)

        const editLabel = this.props.calendar_type === 'day' ?
            <div className="mike" onClick={this.toggle}>{this.state.title}</div> :
            <Label2 col={col} colSpan={colSpan} onClick={this.toggle}>
            {this.state.title}
        </Label2>
        return (
            <React.Fragment>
                {editLabel}

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Update Event
                    </ModalHeader>

                    <ModalBody>
                        <FormGroup>
                            <Label for="title">Title(*):</Label>
                            <Input className={this.hasErrorFor('title') ? 'is-invalid' : ''}
                                value={this.state.title}
                                type="text" name="title"
                                id="taskTitle" onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('title')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="location">Location:</Label>
                            <Input className={this.hasErrorFor('location') ? 'is-invalid' : ''} type="textarea"
                                value={this.state.location}
                                name="location"
                                id="location"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('location')}
                        </FormGroup>

                        {customerList}

                        {userList}

                        <FormGroup>
                            <Label for="beginDate">Begin Date:</Label>
                            <Input defaultValue={beginDate}
                                className={this.hasErrorFor('beginDate') ? 'is-invalid' : ''} type="date"
                                name="beginDate" id="beginDate" onChange={this.handleInput.bind(this)}/>

                            {this.renderErrorFor('beginDate')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="endDate">End Date:</Label>
                            <Input defaultValue={endDate} className={this.hasErrorFor('endDate') ? 'is-invalid' : ''}
                                type="date"
                                name="endDate" id="endDate" onChange={this.handleInput.bind(this)}/>

                            {this.renderErrorFor('endDate')}
                        </FormGroup>

                    </ModalBody>

                    <ModalFooter>
                        <Button color="primary" onClick={this.handleClick.bind(this)}>Update</Button>
                        <Button color="danger" onClick={() => this.deleteEvent(this.props.event.id)}>Delete</Button>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }
}

export default CalendarEvent
