/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import {
    Card, CardBody,
    CardHeader, Label, Input, Button, FormGroup
} from 'reactstrap'
import axios from 'axios'
import AddLead from './AddLead'

class EditTask extends Component {
    constructor (props) {
        super(props)

        this.state = {
            title: this.props.task.title,
            description: this.props.task.content,
            due_date: this.props.task.due_date,
            start_date: this.props.task.start_date,
            contributors: this.props.task.contributors,
            rating: this.props.task.rating,
            source_type: this.props.task.source_type,
            valued_at: this.props.task.valued_at,
            customer_id: this.props.task.customer_id,
            editMode: false,
            err: '',
            users: [],
            selectedUsers: []
        }

        this.oldStartDate = props.task.start_date
        this.oldDueDate = props.task.due_date
        this.oldTitle = props.task.title
        this.oldDescription = props.task.description
        this.oldUser = props.task.contributors
        this.oldSourceType = props.task.source_type
        this.oldRating = props.task.rating
        this.oldValuedAt = props.task.valued_at
        this.oldCustomer = props.task.customer_id
        this.handleEdit = this.handleEdit.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleDoubleClick = this.handleDoubleClick.bind(this)
        this.handleMultiSelect = this.handleMultiSelect.bind(this)
    }

    componentDidMount () {
        this.getUsers()
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
            })
            .catch((e) => {
                console.error(e)
                this.setState({
                    err: e
                })
            })
    }

    handleEdit () {
        this.setState({
            editMode: true
        })
    }

    handleSave () {
        const index = this.props.allTasks.findIndex(task => task.id === this.props.task.id)
        const currentObject = this.props.allTasks[index]

        axios.put(`/api/tasks/${this.props.task.id}`, {
            customer_id: this.state.customer_id,
            rating: this.state.rating,
            source_type: this.state.source_type,
            valued_at: this.state.valued_at,
            title: this.state.title,
            content: this.state.description,
            contributors: this.state.selectedUsers,
            due_date: this.state.due_date,
            start_date: this.state.start_date
        })
            .then((response) => {
                this.setState({
                    editMode: false
                })
                currentObject.title = this.state.title
                currentObject.content = this.state.description
                currentObject.contributors = this.state.contributors
                currentObject.due_date = this.state.due_date
                currentObject.start_date = this.state.start_date
                this.props.action(this.props.allTasks)
            })
            .catch((error) => {
                this.setState({
                    err: error.response.data.errors
                })
            })
    }

    handleCancel () {
        this.setState({
            contributors: this.oldUser,
            title: this.oldTitle,
            start_date: this.oldStartDate,
            due_date: this.oldDueDate,
            description: this.oldDescription,
            customer_id: this.oldCustomer,
            rating: this.oldRating,
            valued_at: this.oldValuedAt,
            source_type: this.oldSourceType,
            editMode: false
        })
    }

    handleDelete () {
        this.setState({
            editMode: false
        })
        if (this.props.onDelete) {
            this.props.onDelete(this.props.task)
        }
    }

    handleChange (e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleDoubleClick (e) {
        this.setState({
            editMode: true
        })
    }

    getFormForLead (readOnly = false) {
        const objValues = {
            rating: this.state.rating,
            source_type: this.state.source_type,
            valued_at: this.state.valued_at,
            customer_id: this.state.customer_id
        }

        return (
            <React.Fragment>
                <AddLead
                    readOnly={readOnly}
                    updateValue={this.handleChange} task={objValues}
                />
            </React.Fragment>
        )
    }

    handleMultiSelect (e) {
        this.setState({ selectedUsers: Array.from(e.target.selectedOptions, (item) => item.value) })
    }

    buildUserOptions () {
        let userContent = null
        if (!this.state.users.length) {
            userContent = <option value="">Loading...</option>
        } else {
            userContent = this.state.users.map((user, index) => (
                <option key={index}
                        value={user.id}>{user.first_name + ' ' + user.last_name}</option>
            ))
        }

        return (
            <FormGroup>
                <Label>Assigned To</Label>
                <Input multiple
                    type="select"
                    value={this.state.selectedUsers}
                    id="contributors"
                    name="contributors"
                    onChange={this.handleMultiSelect}>
                    {userContent}
                </Input>
            </FormGroup>
        )
    }

    render () {
        let panelTitle = null
        const userContent = this.buildUserOptions()

        if (this.state.editMode) {
            panelTitle = (
                <div className="center-block">
                    <Input type="text" name="title" placeholder={this.state.title}
                        className="form-control input-sm taskTitleEditor"
                        value={this.state.title}
                        onChange={this.handleChange}/>
                </div>
            )
        } else {
            const title = this.state.title
            panelTitle = (
                <span onDoubleClick={this.handleDoubleClick}>{title}</span>
            )
        }
        let panelOptions = <div className="pull-right"/>
        if (this.state.editMode === false) {
            panelOptions = (
                <div className="pull-right">
                    <Button className="btn btn-primary btn-xs" onClick={this.handleEdit}>Edit</Button>
                </div>
            )
        }
        const panelHeader = (
            <div>
                {panelTitle}
                {panelOptions}
            </div>
        )
        let panelBody = null
        if (this.state.editMode) {
            const leadForm = parseInt(this.props.task_type) === 2 ? this.getFormForLead() : ''
            panelBody = (
                <form>
                    <FormGroup>
                        <Label>Description</Label>
                        <Input type="textarea" name="description"
                            value={this.state.description}
                            onChange={this.handleChange}/>
                    </FormGroup>

                    <FormGroup>
                        <Label>Start Date</Label>
                        <Input type="text" name="start_date"
                               value={this.state.start_date}
                               onChange={this.handleChange}/>
                    </FormGroup>

                    <FormGroup>
                        <Label>Due Date</Label>
                        <Input type="text" name="due_date"
                            value={this.state.due_date}
                            onChange={this.handleChange}/>
                    </FormGroup>

                    {userContent}
                    {leadForm}

                    <Button className="btn btn-success btn-xs mr-3" onClick={this.handleSave}>Save</Button>
                    <Button className="btn btn-info btn-xs mr-3" onClick={this.handleCancel}>Cancel</Button>
                    <Button className="btn btn-danger btn-xs" onClick={this.handleDelete}>Delete</Button>
                </form>
            )
        } else {
            const leadForm = this.props.task_type === 2 ? this.getFormForLead(true) : ''
            panelBody = (
                <form>
                    <FormGroup>
                        <Label>Description</Label>
                        <Input readOnly type="textarea" name="description" placeholder={this.state.description}
                            value={this.state.description}
                            onDoubleClick={this.handleDoubleClick}/>
                    </FormGroup>

                    <FormGroup>
                        <Label>Start Date</Label>
                        <Input readOnly type="text" name="start_date" placeholder={this.state.start_date}
                               value={this.state.start_date}
                               onDoubleClick={this.handleDoubleClick}/>
                    </FormGroup>

                    <FormGroup>
                        <Label>Due Date</Label>
                        <Input readOnly type="text" name="due_date" placeholder={this.state.due_date}
                            value={this.state.due_date}
                            onDoubleClick={this.handleDoubleClick}/>
                    </FormGroup>

                    {/*<FormGroup>*/}
                    {/*    <Label>User</Label>*/}
                    {/*    <Input disabled value={this.state.contributors} type="select"*/}
                    {/*        className="form-control select-index input-xs" name="contributors"*/}
                    {/*        onChange={this.handleDoubleClick}>*/}
                    {/*        {userContent}*/}
                    {/*    </Input>*/}
                    {/*</FormGroup>*/}

                    {leadForm}
                </form>
            )
        }
        return (
            <Card>
                <CardHeader>
                    {panelHeader}
                </CardHeader>

                <CardBody>
                    {panelBody}
                </CardBody>
            </Card>
        )
    }
}

export default EditTask
