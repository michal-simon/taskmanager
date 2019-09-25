/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import Task from './task'
import Tooltips from './tooltip'
import axios from 'axios'

export default class Story extends Component {
    constructor (props) {
        super(props)
        this.state = {
            columns: []
        }

        this.buildColumn = this.buildColumn.bind(this)
        this.getColumns = this.getColumns.bind(this)
    }

    componentDidMount () {
        this.getColumns()
    }

    getColumns () {
        axios.get(`/api/status/${this.props.task_type}`)
            .then((r) => {
                this.setState({
                    columns: r.data
                })
            })
            .catch((e) => {
                console.warn(e)
                console.error(e)
            })
    }

    buildColumn (column) {
        return (
            <div data-status={column.id} className={`tasks mcolor${column.id}`}>
                <div className="task-header story">
                    <h3 className="task-title mr-auto"> {column.title} <span className="badge text-muted">(3)</span></h3>

                    <Tooltips
                        tasks={this.props.tasks}
                        id={column.id}
                        content={column.description}
                        action={this.props.action}
                        placement="top"
                        storyType={this.props.storyType}
                        task_type={this.props.task_type}
                        project_id={this.props.project_id}
                    />
                </div>

                <div className="task-body">
                    <Task
                        task_type={this.props.task_type}
                        action={this.props.action}
                        tasks={this.props.tasks}
                        loading={this.props.loading}
                        filter={column.id}
                    />
                </div>
            </div>
        )
    }

    render () {
        const columns = this.state.columns.map((column, index) => {
            return this.buildColumn(column)
        })

        return (
            <div className="">
                <div className="space">
                    <h2 className="story">{this.props.storyName[0] ? this.props.storyName[0].name : 'Loading...'}</h2>
                </div>

                {columns}
            </div>
        )
    }
}
