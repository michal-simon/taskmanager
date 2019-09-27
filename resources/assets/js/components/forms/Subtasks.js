/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import ViewTask from './ViewTask'
import axios from 'axios'
import moment from 'moment'

class Subtasks extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            errors: [],
            subtasks: [],
            visible: 'collapse'
        }

        this.getSubtasks = this.getSubtasks.bind(this)
        this.buildSubtaskOptions = this.buildSubtaskOptions.bind(this)
    }

    getSubtasks (e) {
        e.preventDefault()

        this.setState({ visible: this.state.visible === 'collapse' ? 'collapse show' : 'collapse' })

        axios.get(`/api/tasks/subtasks/${this.props.task_id}`).then(data => {
            this.setState({ subtasks: data.data })
        })
    }

    buildSubtaskOptions () {
        const tasks = this.state.subtasks.map((task, index) => {
            return (
                <a key={index} href="#" className="list-group-item list-group-item-action flex-column align-items-start">
                    <div className="d-flex w-100 justify-content-between">
                        <ViewTask
                            task_type={this.props.task_type}
                            allTasks={this.props.tasks}
                            action={this.props.action}
                            task={task}
                        />
                    </div>
                    <h5 className="m-3">{task.valued_at}</h5>
                    <p className="mb-1">{task.content}</p>
                    <div>
                        <span className="task-due">{moment(task.dueDate).format('DD.MM.YYYY')}</span>
                        <span className="task-contributors">{task.name}</span>
                    </div>
                </a>
            )
        })

        return tasks
    }

    render () {
        const tasks = this.state.subtasks.length ? this.buildSubtaskOptions() : ''

        return (
            <React.Fragment>
                <Button color="success" onClick={this.getSubtasks}>{this.state.visible === 'collapse show' ? 'Hide Subtasks' : 'Show Subtasks'}</Button>

                <div className={this.state.visible + ' ' + 'mt-3'}>
                    {tasks}
                </div>
            </React.Fragment>
        )
    }
}

export default Subtasks
