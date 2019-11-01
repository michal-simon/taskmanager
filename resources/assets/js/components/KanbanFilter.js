import React, {Component} from 'react'
import {Button, Form, Input, Card, CardBody, CardTitle} from 'reactstrap'
import axios from 'axios'
import AddStory from './forms/AddStory'
import EditProject from './forms/EditProject'
import UserDropdown from "./common/UserDropdown";
import CustomerDropdown from "./common/CustomerDropdown";
import TaskStatusDropdown from "./common/TaskStatusDropdown";

export default class KanbanFilter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filters: [],
            stories: []
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleProjectChange = this.handleProjectChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.resetFilters = this.resetFilters.bind(this)
    }

    componentDidMount() {
        this.getStoryDetails()
    }

    getStoryDetails() {
        axios.get('/api/projects')
            .then((r) => {
                this.setState({
                    stories: r.data
                })
            })
            .catch((e) => {
                console.warn(e)
            })
    }

    handleProjectChange(event) {
        const projectId = event.target.value
        this.props.updateProjectId(projectId)
    }

    handleChange(event) {
        const column = event.target.id
        const value = event.target.value
        const project_id = this.props.project_id ? this.props.project_id : 0

        if (value === 'all') {
            const updatedRowState = this.state.filters.filter(filter => filter.column !== column)
            this.setState({filters: updatedRowState})
            return true
        }

        this.setState(prevState => ({
            filters: {
                ...prevState.filters,
                [column]: value,
            },
        }));

        return true
    }

    resetFilters() {
        this.props.reset()
    }

    handleSubmit(event) {
        event.preventDefault()

        axios.post(`/api/tasks/filterTasks/${this.props.task_type}`,
            this.state.filters)
            .then((response) => {
                this.props.action(response.data)
            })
            .catch((error) => {
                alert(error)
            })
    }

    buildProjectOptions() {
        let storyTable = null
        if (this.state.stories && this.state.stories.length) {
            storyTable = this.state.stories.map((story, index) => {
                return (
                    <option key={story.id} value={story.id}>{story.title}</option>
                )
            })
        }

        return (
            <Input type="select" onChange={this.handleProjectChange} value={this.props.project_id}>
                <option>Choose Project</option>
                {storyTable}
            </Input>
        )
    }

    renderErrorFor() {

    }

    render() {
        const projectContent = this.props.task_type !== 2 && this.props.task_type !== 3 ? this.buildProjectOptions() : ''
        const addButton = this.props.task_type !== 2 && this.props.task_type !== 3
            ? <AddStory customers={this.props.customers} addProject={this.props.addProject}/>
            : ''
        const editButton = this.props.project_id ?
            <EditProject customers={this.props.customers} project_id={this.props.project_id}/> : ''

        return (
            <Card className="col-12 p-0">
                <CardBody>
                    <CardTitle>Filter</CardTitle>
                    <Form inline onSubmit={this.handleSubmit}>
                        {addButton}
                        {editButton}
                        {projectContent}

                        <UserDropdown
                            renderErrorFor={this.renderErrorFor}
                            handleInputChanges={this.handleChange}
                            users={this.props.users}
                            name="task_user.user_id"
                        />

                        <CustomerDropdown
                            renderErrorFor={this.renderErrorFor}
                            handleInputChanges={this.handleChange}
                            customers={this.props.customers}
                        />

                        <TaskStatusDropdown
                            task_type={this.props.task_type}
                            renderErrorFor={this.renderErrorFor}
                            handleInputChanges={this.handleChange}
                        />

                        <Button className="mr-2 ml-2" color="success">Submit</Button>
                        <Button onClick={this.resetFilters} color="primary">Reset</Button>
                    </Form>
                </CardBody>
            </Card>
        )
    }
}
