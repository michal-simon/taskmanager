import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label} from 'reactstrap';
import moment from 'moment'
import axios from 'axios'

class AddModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            title: '',
            content: '',
            contributors: '',
            created_by: '5af1921c0fe5703dd4a463ec',
            due_date: '',
            task_status: parseInt(this.props.status),
            task_color: '',
            project_id: parseInt(this.props.storyType),
            loading: false,
            users: [],
            errors: []
        };

        this.toggle = this.toggle.bind(this);
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
    }

    componentDidMount() {
        moment.locale('tr');
        this.changeColumnTitle()
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

    handleChange(event) {
        this.setState({name: event.target.value});
    }

    handleInput(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    getUsers() {
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

    toggle() {
        this.getUsers();
        this.setState({
            modal: !this.state.modal
        });
    }

    changeColumnTitle(number) {
        let newTitle;
        if (number === 1)
            newTitle = "Backlog"
        else if (number === 2)
            newTitle = "ToDo"
        else if (number === 3)
            newTitle = "In Progress"
        else
            newTitle = "Done"

        return newTitle;
    }

    handleClick(event) {
        axios.post('/api/tasks', {
            title: this.state.title,
            content: this.state.content,
            task_status: parseInt(this.props.status),
            contributors: this.state.contributors,
            due_date: this.state.due_date,
            task_color: this.state.task_color,
            project_id: parseInt(this.state.project_id),
            created_by: this.state.created_by
        })
            .then((response) => {
                if (response.data.message)
                    alert(response.data.message)
                else {
                    this.toggle();
                    this.setState({
                        title: null,
                        content: null,
                        contributors: null,
                        due_date: null,
                        loading: false
                    })

                    const firstTask = response.data
                    this.props.tasks.push(firstTask)
                    this.props.action(this.props.tasks)
                }
            })
            .catch((error) => {
                this.setState({
                    errors: error.response.data.errors
                })
            });
    }

    render() {
        const users = this.state;

        let userContent;

        if (!this.state.users.length) {
            userContent = <option value="">Loading...</option>
        } else {
            userContent = this.state.users.map((user, index) => (
                <option key={index} value={user.id}>{user.first_name + " " + user.last_name}</option>
            ))
        }

        return (
            <div>
                <i className="fas fa-plus-circle customAddTask" onClick={this.toggle}></i>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Create a New Task to {this.changeColumnTitle(this.props.status)}
                    </ModalHeader>

                    <ModalBody>
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

                        <FormGroup>
                            <Label for="contributors">Assign to:</Label>
                            <Input className={this.hasErrorFor('contributors') ? 'is-invalid' : ''} type="select"
                                   name="contributors" id="contributors" onChange={this.handleInput.bind(this)}>
                                <option value="">Choose:</option>
                                {userContent}
                            </Input>
                            {this.renderErrorFor('contributors')}
                        </FormGroup>

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
                        <i className="fas fa-calendar-alt"></i> Created Date: {moment().format('L, h:mm:ss')} <br/>
                        <i className="fas fa-clock"></i> Due Date:
                        <Input className={this.hasErrorFor('due_date') ? 'is-invalid' : ''} type="datetime-local"
                               name="due_date" id="due_date" onChange={this.handleInput.bind(this)}/>
                        {this.renderErrorFor('due_date')}
                    </ModalBody>

                    <ModalFooter>
                        <Button color="primary" onClick={this.handleClick.bind(this)}><i
                            className="fas fa-plus-circle"></i> Add</Button>
                        <Button color="secondary" onClick={this.toggle}><i
                            className="fas fa-times-circle"></i> Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default AddModal;