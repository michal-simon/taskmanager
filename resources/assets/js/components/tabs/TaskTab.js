import axios from 'axios'
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Form, Row, Col } from 'reactstrap'
import AddTask from '../forms/AddTask'

class TaskTab extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            tasks: [],
            errors: [],
            visible: 'collapse'
        }

        this.updateTasks = this.updateTasks.bind(this)
        this.handleSlideClick = this.handleSlideClick.bind(this)
    }

    componentDidMount () {
        axios.get(`/api/tasks/subtasks/${this.props.task_id}`).then(data => {
            this.setState({ tasks: data.data })
        })
    }

    handleSlideClick () {
        this.setState({ visible: this.state.visible === 'collapse' ? 'collapse show' : 'collapse' });
    }

    updateTasks (tasks) {
        this.setState({
            tasks: tasks
        })
    }

    formatDate (dateString) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ]
        const d = new Date(dateString)
        const dayName = days[d.getDay()]
        const monthName = monthNames[d.getMonth()]
        const hours = d.getHours()
        const minutes = d.getMinutes()
        const formattedDate = `${dayName} ${d.getDate()} ${monthName} ${d.getFullYear()}`
        return formattedDate
    }

    render () {

        const tasks = this.state.tasks.map((task, index) => {
            return (
                <a href="#"
                   className="list-group-item list-group-item-action flex-column align-items-start">
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{task.title} {task.valued_at}</h5>
                        <small>{this.formatDate(task.due_date)}</small>
                    </div>
                    <p className="mb-1">{task.content}</p>
                </a>
            )
        })

        return (
            <React.Fragment>
                <Button color="success" onClick={this.handleSlideClick}>{this.state.visible === 'collapse show' ? 'Hide Add' : 'Show Add'}</Button>
                <div className={this.state.visible}>
                    <AddTask
                        status={9}
                        modal={false}
                        task_id={this.props.task_id}
                        tasks={this.state.tasks}
                        action={this.updateTasks}
                        task_type={this.props.task_type}
                    />
                </div>

                <div className="viewContainer mt-5">
                    <div className="list-group">
                        {tasks}
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

export default TaskTab