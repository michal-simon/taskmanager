import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label} from 'reactstrap';
import axios from "axios";

class CreateEvent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            modal: false,
            title: '',
            beginDate: '',
            endDate: '',
            customer_id: '',
            location: '',
            loading: false,
            customers: [],
            users: [],
            errors: [],
            selectedUsers: []
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

    handleInput(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleClick(event) {

        console.log('users', this.state.selectedUsers)

        axios.post('/api/events', {
            customer_id: this.state.customer_id,
            users: this.state.selectedUsers,
            title: this.state.title,
            location: this.state.location,
            beginDate: this.state.beginDate,
            endDate: this.state.endDate
        })
            .then((response) => {

                    this.toggle();
                    this.setState({
                        title: null,
                        content: null,
                        contributors: null,
                        due_date: null,
                        loading: false
                    })

                    const firstEvent = response.data
                    this.props.events.push(firstEvent)
                    this.props.action(this.props.events)
            })
            .catch((error) => {
                this.setState({
                    errors: error.response.data.errors
                })
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

    toggle() {
        this.getCustomers()
        this.getUsers()
        this.setState({
            modal: !this.state.modal
        });
    }

    handleMultiSelect(e) {
        this.setState({selectedUsers: Array.from(e.target.selectedOptions, (item) => item.value)});
    }

    render() {

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

        return (
            <React.Fragment>
                <i className="fas fa-plus-circle" onClick={this.toggle}></i>

                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Create a new event
                    </ModalHeader>

                    <ModalBody>
                        <FormGroup>
                            <Label for="title">Title(*):</Label>
                            <Input className={this.hasErrorFor('title') ? 'is-invalid' : ''}
                                   type="text" name="title"
                                   id="taskTitle" onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('title')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="location">Location:</Label>
                            <Input className={this.hasErrorFor('location') ? 'is-invalid' : ''} type="text"
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
                            <Input onChange={this.handleMultiSelect} type="select" name="users" id="users" multiple>
                                {userList}
                            </Input>
                            {this.renderErrorFor('users')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="beginDate">Begin Date:</Label>
                            <Input className={this.hasErrorFor('beginDate') ? 'is-invalid' : ''} type="date"
                                   name="beginDate" id="beginDate" onChange={this.handleInput.bind(this)} />

                            {this.renderErrorFor('beginDate')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="endDate">End Date:</Label>
                            <Input className={this.hasErrorFor('endDate') ? 'is-invalid' : ''} type="date"
                                   name="endDate" id="endDate" onChange={this.handleInput.bind(this)} />

                            {this.renderErrorFor('endDate')}
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="primary" onClick={this.handleClick.bind(this)}><i
                            className="fas fa-plus-circle"></i> Add</Button>
                        <Button color="secondary" onClick={this.toggle}><i
                            className="fas fa-times-circle"></i> Close</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>



        );
    }
}

export default CreateEvent;