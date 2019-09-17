import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label} from 'reactstrap';
import axios from "axios";


const Label2 = styled.span`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  grid-column: ${props => props.col} / span ${props => props.colSpan};
  background: ${props => props.color};
  font-size: 0.8rem;
  line-height: 0.8rem;
  padding: 2px 6px;
`;
Label2.defaultProps = {
    color: '#ddf',
};

class CalendarEvent extends React.Component {

    constructor(props) {
        super(props);

        const attendees = this.props.event.attendees ?  this.props.event.attendees : []

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
            selectedUsers: [],
            errors: [],
            attendees: attendees
        };

        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.toggle = this.toggle.bind(this);
        this.handleMultiSelect = this.handleMultiSelect.bind(this);

    }

    hasErrorFor(field) {
        return !!this.state.errors[field]
    }

    renderErrorFor(field) {
        if (this.hasErrorFor(field)) {
            return (
                <span className='invalid-feedback'>
                    <strong>{this.state.errors[field][0]}</strong>
                </span>
            )
        }
    }

    componentDidMount() {


    }

    handleInput(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleClick(event) {

        axios.put( `/api/events/${this.props.event.id}`, {
            customer_id: this.state.customer_id,
            users: this.state.selectedUsers,
            title: this.state.title,
            location: this.state.location,
            beginDate: this.state.beginDate,
            endDate: this.state.endDate
        })
            .then((response) => {

                this.toggle();
                let index = this.props.events.findIndex(event => event.id == this.props.event.id)
                const currentObject = this.props.events[index]
                currentObject.title = this.state.title
                currentObject.location = this.state.location
                currentObject.beginDate = this.state.beginDate
                currentObject.endDate = this.state.endDate

                this.props.action(this.props.events)
                    // const firstEvent = response.data
                    // this.props.events.push(firstEvent)
                    // this.props.action(this.props.events)

            })
            .catch((error) => {
               alert(error)
            });
    }

    toggle() {
        this.getCustomers()
        this.getUsers()
        this.setState({
            modal: !this.state.modal
        });
    }

    deleteEvent(id) {

        const self = this;

        axios.delete('/api/events/' + id)
            .then(function (response) {
                let filteredArray = self.props.events.filter(event => event.id !== id)
                self.props.action(filteredArray)
            })
            .catch(function (error) {
               alert(error)
            });
    }

    getCustomers() {
        axios.get('/api/customers')
            .then((r) => {
                console.log('customers', r.data)
                this.setState({
                    customers: r.data,
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    getUsers() {
        axios.get('/api/users')
            .then((r) => {
                console.log('users', r.data)
                this.setState({
                    users: r.data,
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    convertDate(inputFormat) {
        function pad(s) { return (s < 10) ? '0' + s : s; }
        var d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
    }

    handleMultiSelect(e) {
        this.setState({selectedUsers: Array.from(e.target.selectedOptions, (item) => item.value)});
    }

    render() {
        const { col, colSpan } = this.props;

        let arrAttendees = []

        this.state.attendees.map((attendee,index)=>{
            arrAttendees.push(attendee.id)
        })

        let customerList;

        if (!this.state.customers.length) {
            customerList = <option value="">Loading...</option>
        } else {
            customerList = this.state.customers.map((customer, index) => (
                <option key={index} value={customer.id}>{customer.first_name + " " + customer.last_name}</option>
            ))
        }

        let userList;

        if (!this.state.users.length) {
            userList = <option value="">Loading...</option>
        } else {
            userList = this.state.users.map((user, index) => (
                <option key={index} value={user.id}>{user.first_name + " " + user.last_name}</option>
            ))
        }

        const beginDate = this.convertDate(this.state.beginDate)
        const endDate = this.convertDate(this.state.endDate)

        return (
            <React.Fragment>
                <Label2 col={col} colSpan={colSpan} onClick={this.toggle}>
                    {this.state.title}
                </Label2>

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

                        <FormGroup>
                            <Label for="location">Customer:</Label>
                            <Input className={this.hasErrorFor('location') ? 'is-invalid' : ''} type="select"
                                   name="customer_id"
                                   id="customer_id"
                                   onChange={this.handleInput.bind(this)}>
                                <option>Select Customer</option>
                                {customerList}
                            </Input>
                            {this.renderErrorFor('customer_id')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="users">Attendees</Label>
                            <Input defaultValue={arrAttendees} onChange={this.handleMultiSelect} type="select" name="users" id="users" multiple>
                                {userList}
                            </Input>
                            {this.renderErrorFor('users')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="beginDate">Begin Date:</Label>
                            <Input defaultValue={beginDate} className={this.hasErrorFor('beginDate') ? 'is-invalid' : ''} type="date"
                                   name="beginDate" id="beginDate" onChange={this.handleInput.bind(this)} />

                            {this.renderErrorFor('beginDate')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="endDate">End Date:</Label>
                            <Input defaultValue={endDate} className={this.hasErrorFor('endDate') ? 'is-invalid' : ''} type="date"
                                   name="endDate" id="endDate" onChange={this.handleInput.bind(this)} />

                            {this.renderErrorFor('endDate')}
                        </FormGroup>

                    </ModalBody>

                    <ModalFooter>
                        <Button color="primary" onClick={this.handleClick.bind(this)}><i
                            className="fas fa-plus-circle"></i> Update</Button>
                        <Button color="danger" onClick={() => this.deleteEvent(this.props.event.id)}>Delete</Button>
                        <Button color="secondary" onClick={this.toggle}><i
                            className="fas fa-times-circle"></i> Close</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>



        );
    }
}

export default CalendarEvent;