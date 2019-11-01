import React, {Component} from 'react'
import axios from "axios";
import {Input, FormGroup} from 'reactstrap'


export default class TaskDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tasks: []
        }

        this.getTasks = this.getTasks.bind(this)
    }

    componentDidMount() {
        if (!this.props.tasks || !this.props.tasks.length) {
            this.getTasks()
        } else {
            this.setState({tasks: this.props.tasks})
        }
    }

    getTasks() {
        axios.get('/api/tasks')
            .then((r) => {
                this.setState({
                    tasks: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    render() {
        let taskList = null
        if (this.state.tasks && !this.state.tasks.length) {
            taskList = <option value="">Loading...</option>
        } else {
            taskList = this.state.tasks.map((task, index) => (
                <option key={index} value={task.id}>{task.title}</option>
            ))
        }

        const name = this.props.name && this.props.name ? this.props.name : 'task_id'

        return (
            <FormGroup className="ml-2">
                <Input value={this.props.customer} onChange={this.props.handleInputChanges} type="select"
                       name={name} id={name}>
                    <option value="">Select Task</option>
                    {taskList}
                </Input>
                {this.props.renderErrorFor('task')}
            </FormGroup>
        )
    }
}
