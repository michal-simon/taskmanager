/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Form } from 'reactstrap'
import moment from 'moment'
import axios from 'axios'
import AddLead from './AddLead'

class AddModal extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            title: '',
            rating: '',
            valued_at: '',
            customer_id: null,
            content: '',
            contributors: '',
            created_by: '5af1921c0fe5703dd4a463ec',
            due_date: '',
            task_status: parseInt(this.props.status),
            task_color: '',
            project_id: this.props.storyType ? parseInt(this.props.storyType) : 0,
            loading: false,
            users: [],
            errors: []
        }
        this.toggle = this.toggle.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.buildForm = this.buildForm.bind(this)
        this.buildUserOptions = this.buildUserOptions.bind(this)
        this.getUsers = this.getUsers.bind(this)
    }

    componentDidMount () {
        this.changeColumnTitle()
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

    getUsers () {
        axios.get('/api/users')
            .then((r) => {
                this.setState({
                    users: r.data,
                    err: ''
                })
            })
            .then((r) => {
                console.log(this.state.users)
            })
            .catch((e) => {
                console.error(e)
                this.setState({
                    err: e
                })
            })
    }

    toggle () {
        this.setState({
            modal: !this.state.modal
        })
    }

    changeColumnTitle (number) {
        let newTitle
        if (number === 1) {
            newTitle = 'Backlog'
        } else if (number === 2) {
            newTitle = 'ToDo'
        } else if (number === 3) {
            newTitle = 'In Progress'
        } else {
            newTitle = 'Done'
        }
        return newTitle
    }

    handleClick (event) {
        axios.post('/api/tasks', {
            rating: this.state.rating,
            valued_at: this.state.valued_at,
            customer_id: this.state.customer_id,
            title: this.state.title,
            content: this.state.content,
            task_status: parseInt(this.props.status),
            contributors: this.state.contributors,
            due_date: this.state.due_date,
            task_color: this.state.task_color,
            project_id: parseInt(this.props.project_id),
            created_by: this.state.created_by,
            task_type: this.props.task_type,
            parent_id: this.props.task_id ? this.props.task_id : 0
        })
            .then((response) => {
                this.toggle()
                this.setState({
                    title: null,
                    content: null,
                    contributors: null,
                    due_date: null,
                    loading: false
                })
                if(this.props.action) {
                    const firstTask = response.data
                    this.props.tasks.push(firstTask)
                    this.props.action(this.props.tasks)
                }
            })
            .catch((error) => {
                this.setState({
                    errors: error.response.data.errors
                })
            })
    }

    getFormForLead () {
        return (
            <React.Fragment>
                <AddLead updateValue={this.handleInput}/>
            </React.Fragment>
        )
    }

    buildForm () {

        const userOptions = this.buildUserOptions()

        return (
            <Form>
                <FormGroup>
                    <Label for="title">Task Title(*):</Label>
                    <Input className={this.hasErrorFor('title') ? 'is-invalid' : ''} type="text" name="title"
                        id="taskTitle" onChange={this.handleInput.bind(this)}/>
                    {this.renderErrorFor('title')}
                </FormGroup>

                <FormGroup>
                    <Label for="content">Task Details:</Label>
                    <Input className={this.hasErrorFor('content') ? 'is-invalid' : ''} type="textarea"
                        name="content" id="content" onChange={this.handleInput.bind(this)}/>
                    {this.renderErrorFor('content')}
                </FormGroup>

                {userOptions}

                <FormGroup>
                    <Label for="task_color">Task Color:</Label>
                    <Input className={this.hasErrorFor('task_color') ? 'is-invalid' : ''} type="select"
                        name="task_color" id="task_color" onChange={this.handleInput.bind(this)}>
                        <option value="">Choose:</option>
                        <option value="colorBlue">Red</option>
                        <option value="colorGreen">Green</option>
                        <option value="colorGrey">Grey</option>
                    </Input>
                    {this.renderErrorFor('task_color')}
                </FormGroup>

                <hr/>
                <i className="fa fa-calendar-alt" /> Created Date: {moment().format('L, h:mm:ss')} <br/>
                <i className="fa fa-clock" />Due Date:
                <Input className={this.hasErrorFor('due_date') ? 'is-invalid' : ''} type="datetime-local"
                    name="due_date" id="due_date" onChange={this.handleInput.bind(this)}/>
                {this.renderErrorFor('due_date')}
            </Form>
        )
    }

    buildUserOptions () {
        let userContent
        if (!this.state.users.length) {
            userContent = <option value="">Loading...</option>
        } else {
            userContent = this.state.users.map((user, index) => (
                <option key={index} value={user.id}>{user.first_name + ' ' + user.last_name}</option>
            ))
        }

        return (
            <FormGroup>
                <Label for="contributors">Assign to:</Label>
                <Input className={this.hasErrorFor('contributors') ? 'is-invalid' : ''} type="select"
                       name="contributors" id="contributors" onChange={this.handleInput.bind(this)}>
                    <option value="">Choose:</option>
                    {userContent}
                </Input>
                {this.renderErrorFor('contributors')}
            </FormGroup>
        )
    }

    render () {
        const leadForm = this.props.task_type === 2 || this.props.task_type === 3 ? this.getFormForLead() : ''
        const form = this.buildForm()
        const saveButton = <Button color="primary" onClick={this.handleClick.bind(this)}> Add</Button>

        if(this.props.modal) {
            return (
                <div>
                    <Button color="success" className="customAddTask"
                            title="Add task" onClick={this.toggle}>+</Button>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>
                            Create a New Task to {this.changeColumnTitle(this.props.status)}
                        </ModalHeader>

                        <ModalBody>
                            {form}
                            {leadForm}
                        </ModalBody>

                        <ModalFooter>
                            {saveButton}
                            <Button color="secondary" onClick={this.toggle}>Close</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            )
        }

        return (
            <div>
                {form}
                {leadForm}
                {saveButton}
            </div>
        )
    }
}

export default AddModal
