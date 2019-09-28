/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import Story from './Story'
import KanbanFilter from './KanbanFilter'
import AddStory from './forms/AddStory'

class Kanban extends Component {
    constructor (props, context) {
        super(props, context)
        this.state = {
            open: false,
            show: true,
            tasks: [],
            stories: [],
            err: '',
            err2: '',
            loading: true,
            loadingStory: true
        }
        this.handleChange = this.handleChange.bind(this)
        this.project_id = this.props.project_id
        this.updateTasks = this.updateTasks.bind(this)
        this.addProject = this.addProject.bind(this)
        this.resetFilters = this.resetFilters.bind(this)
        this.getTaskUrl = this.getTaskUrl.bind(this)
        this.cachedTasks = []
    }

    componentDidMount () {
        this.getStoryDetails()
        this.getTasks()
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

    getStoryDetails () {
        axios.get('/api/projects')
            .then((r) => {
                this.setState({
                    stories: r.data,
                    err2: '',
                    loadingStory: false
                })
            })
            .catch((e) => {
                this.setState({
                    loadingStory: false,
                    err2: e
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

    handleChange (event) {
        const projectId = event.target.value
        const url = this.props.task_type === 1 ? `?project_id=${projectId}` : `/leads?project_id=${projectId}`
        window.location.href = url
    }

    getStories () {
        const { stories, loadingStory } = this.state
        let storyTable
        if (!loadingStory) {
            storyTable = stories.map((story, index) => {
                return (
                    <option key={story.id} value={story.id}>{story.title}</option>
                )
            })
        }
        return storyTable
    }

    render () {
        let storyTable
        const divStyle = this.props.task_type === 2 || this.props.task_type === 3 ? {
            left: 0,
            width: '100%'
        } : {}
        const body = document.body
        body.classList.add('open')
        document.getElementsByClassName('navbar-toggler')[0].style.display = 'block'
        if (this.props.task_type !== 2 && this.props.task_type !== 3) {
            storyTable = (
                <React.Fragment>
                    <AddStory addProject={this.addProject} />

                    <select className="form-control" onChange={this.handleChange} value={this.props.project_id}>
                        <option>Choose Project</option>
                        {this.getStories()}
                    </select>
                </React.Fragment>
            )
        }
        return (
            <React.Fragment>
                <KanbanFilter
                    reset={this.resetFilters}
                    action={this.updateTasks}
                    task_type={this.props.task_type}
                />

                <div id="board" className="board">

                    {storyTable}

                    <div style={divStyle}>
                        <aside>
                            <Story
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