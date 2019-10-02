/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import Story from './Story'
import KanbanFilter from './KanbanFilter'

class Kanban extends Component {
    constructor (props, context) {
        super(props, context)
        this.state = {
            open: false,
            show: true,
            tasks: [],
            users: [],
            customers: [],
            stories: [],
            err: '',
            err2: '',
            loading: true,
            loadingStory: true
        }
        this.project_id = this.props.project_id
        this.updateTasks = this.updateTasks.bind(this)
        this.addProject = this.addProject.bind(this)
        this.resetFilters = this.resetFilters.bind(this)
        this.getTaskUrl = this.getTaskUrl.bind(this)
        this.getUsers = this.getUsers.bind(this)
        this.getCustomers = this.getCustomers.bind(this)
        this.cachedTasks = []
    }

    componentDidMount () {
        this.getTasks()
        this.getUsers()
        this.getCustomers()
    }

    getCustomers () {
        axios.get('/api/customers')
            .then((r) => {
                this.setState({
                    customers: r.data
                })
            })
            .catch((e) => {
                this.setState({
                    loading: false,
                    err: e
                })
            })
    }

    getUsers () {
        axios.get('api/users')
            .then((r) => {
                this.setState({
                    users: r.data
                })
            })
            .catch((e) => {
                this.setState({
                    loading: false,
                    err: e
                })
            })
    }

    getTaskUrl () {
        switch (true) {
            case (typeof this.props.task_id !== 'undefined' && this.props.task_id !== null):
                return `/api/tasks/subtasks/${this.props.task_id}`

            case this.props.task_type === 2:
                return '/api/leads'

            case this.props.task_type === 3:
                return '/api/deals'

            default:
                return `/api/tasks/getTasksForProject/${this.project_id}`
        }
    }

    getTasks () {
        const url = this.getTaskUrl()

        axios.get(url)
            .then((r) => {
                this.setState({
                    tasks: r.data,
                    err: '',
                    loading: false
                })
                this.cachedTasks = r.data
            })
            .catch((e) => {
                this.setState({
                    loading: false,
                    err: e
                })
            })
    }

    updateTasks (tasks) {
        this.setState({
            tasks: tasks
        })
    }

    resetFilters () {
        this.setState({
            tasks: this.cachedTasks
        })
    }

    /**
     * Add new comment
     * @param {Object} comment
     */
    addProject (project) {
        this.setState({
            stories: [project, ...this.state.stories]
        })
    }

    hideMenu () {
        const body = document.body
        body.classList.add('open')
        document.getElementsByClassName('navbar-toggler')[0].style.display = 'block'
    }

    render () {
        const divStyle = this.props.task_type === 2 || this.props.task_type === 3 ? {
            left: 0,
            width: '100%'
        } : {}

        this.hideMenu()

        return (
            <React.Fragment>
                <KanbanFilter
                    customers={this.state.customers}
                    users={this.state.users}
                    reset={this.resetFilters}
                    action={this.updateTasks}
                    task_type={this.props.task_type}
                    addProject={this.addProject}
                    project_id={this.props.project_id}
                />

                <div id="board" className="board">

                    <div style={divStyle}>
                        <aside>
                            <Story
                                customers={this.state.customers}
                                users={this.state.users}
                                tasks={this.state.tasks}
                                action={this.updateTasks}
                                storyName={this.state.stories.filter(i => i.id === parseInt(this.project_id))}
                                storyType={this.project_id}
                                loading={this.state.loading}
                                task_type={this.props.task_type}
                                project_id={this.props.project_id}
                            />
                        </aside>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Kanban
