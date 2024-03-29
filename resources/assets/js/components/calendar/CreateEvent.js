import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Form } from 'reactstrap'
import axios from 'axios'
import DateTime from 'react-datetime'
import EventTypeDropdown from '../common/EventTypeDropdown'
import CustomerDropdown from "../common/CustomerDropdown";

class CreateEvent extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            modal: false,
            title: '',
            beginDate: '',
            endDate: '',
            customer_id: this.props.customer_id ? this.props.customer_id : '',
            location: '',
            description: '',
            event_type: '',
            loading: false,
            customers: [],
            users: [],
            errors: [],
            selectedUsers: [],
            submitSuccess: false
        }

        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.toggle = this.toggle.bind(this)
        this.handleMultiSelect = this.handleMultiSelect.bind(this)
        this.getUserList = this.getUserList.bind(this)
        this.buildForm = this.buildForm.bind(this)
        this.handleInput = this.handleInput.bind(this)
    }

    componentDidMount () {
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
        this.setState({ submitSuccess: false, loading: true })
                
        axios.post('/api/events', {
            customer_id: this.state.customer_id,
            users: this.state.selectedUsers,
            title: this.state.title,
            description: this.state.description,
            event_type: this.state.event_type,
            location: this.state.location,
            beginDate: this.state.beginDate,
            endDate: this.state.endDate,
            task_id: this.props.task_id ? this.props.task_id : 0
        })
            .then((response) => {
                this.toggle()
                this.setState({
                    title: null,
                    content: null,
                    contributors: null,
                    due_date: null,
                    loading: false,
                    submitSuccess: true
                })

                if (this.props.action) {
                    const firstEvent = response.data
                    this.props.events.push(firstEvent)
                    this.props.action(this.props.events)
                }
            })
            .catch((error) => {
                this.setState({
                    errors: error.response.data.errors
                })
            })
    }

    getUsers () {
        axios.get('/api/users')
            .then((r) => {
                console.log('users', r.data)
                this.setState({
                    users: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    toggle () {
        this.setState({
            modal: !this.state.modal
        })
    }

    handleMultiSelect (e) {
        this.setState({ selectedUsers: Array.from(e.target.selectedOptions, (item) => item.value) })
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
                <Input onChange={this.handleMultiSelect} type="select" name="users" id="users" multiple>
                    {userList}
                </Input>
                {this.renderErrorFor('users')}
            </FormGroup>
        )
    }

    handleStartDate (date){
        this.setState({beginDate: date._d})
    };

    handleEndDate (date){
        this.setState({endDate: date._d})
    };

    buildForm () {
        const userList = this.getUserList()

        return (
            <Form>
                <FormGroup>
                    <Label for="title">Title(*):</Label>
                    <Input className={this.hasErrorFor('title') ? 'is-invalid' : ''}
                        type="text" name="title"
                        id="taskTitle" onChange={this.handleInput.bind(this)}/>
                    {this.renderErrorFor('title')}
                </FormGroup>

                <FormGroup>
                            <Label for="description">Description(*):</Label>
                            <Input className={this.hasErrorFor('description') ? 'is-invalid' : ''}
                                value={this.state.description}
                                type="text" name="description"
                                id="description" onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('description')}
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
                    <Label for="beginDate">Start Date:</Label>
                    <DateTime dateFormat="YYYY-MM-DD" inputProps={{name:'beginDate'}} className={this.hasErrorFor('beginDate') ? 'is-invalid' : ''} onChange={this.handleStartDate.bind(this)} />
                    {this.renderErrorFor('beginDate')}
                </FormGroup>

                <FormGroup>
                    <Label for="endDate">End Date:</Label>
                    <DateTime dateFormat="YYYY-MM-DD" inputProps={{name:'endDate'}} className={this.hasErrorFor('endDate') ? 'is-invalid' : ''} onChange={this.handleEndDate.bind(this)} />
                    {this.renderErrorFor('endDate')}
                </FormGroup>

                <EventTypeDropdown
                    event_type={this.state.event_type}
                    renderErrorFor={this.renderErrorFor}
                    handleInputChanges={this.handleInput}
                />

               <CustomerDropdown
                   renderErrorFor={this.renderErrorFor}
                   handleInputChanges={this.handleInput}
               />

                {userList}
            </Form>
        )
    }

    render () {
        const form = this.buildForm()
        const saveButton = <Button color="primary" onClick={this.handleClick.bind(this)}>Add</Button>

        if (this.props.modal) {
            return (
                <React.Fragment>
                    <Button color="success" onClick={this.toggle}>Add Event</Button>

                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>
                            Create a new event
                        </ModalHeader>

                        <ModalBody>
                            {form}
                        </ModalBody>

                        <ModalFooter>
                            {saveButton}
                            <Button color="secondary" onClick={this.toggle}>Close</Button>
                        </ModalFooter>
                    </Modal>
                </React.Fragment>
            )
        }

        return (
            <div>
                {this.state.submitSuccess && (
                    <div className="mt-3 alert alert-info" role="alert">
                        The event has been created successfully </div>
                )}
                {form}
                {saveButton}
            </div>
        )
    }
}

export default CreateEvent
