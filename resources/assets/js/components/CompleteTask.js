/* eslint-disable no-unused-vars */
import axios from 'axios'
import React, { Component } from 'react'

class CompleteTask extends Component {
    constructor (props) {
        super(props)
    }

    handleMarkTaskAsCompleted (taskId) {
        axios.put(`/api/tasks/${taskId}`).then(response => {
            const tasks = this.props.tasks.filter(task => {
                return task.id !== taskId
            })

            this.props.updateTasksCB(tasks)
        })
    }

    render () {
        return (
            <button
                className='btn btn-primary btn-sm'
                onClick={this.handleMarkTaskAsCompleted.bind(this, this.props.taskId)}
            >
                Mark as completed
            </button>
        )
    }
}

export default CompleteTask
