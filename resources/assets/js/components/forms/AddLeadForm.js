/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Form } from 'reactstrap'
import axios from 'axios'

class AddLeadForm extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            address_1: '',
            address_2: '',
            job_title: '',
            company_name: '',
            zip: '',
            city: '',
            title: '',
            valued_at: '',
            contributors: '',
            source_type: '',
            values: [],
            loading: false,
            submitSuccess: false,
            count: 2,
            errors: [],
            users: [],
            sourceTypes: []
        }
        this.toggle = this.toggle.bind(this)
        this.handleInputChanges = this.handleInputChanges.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.buildUserOptions = this.buildUserOptions.bind(this)
        this.buildSourceTypeOptions = this.buildSourceTypeOptions.bind(this)
        this.getUsers = this.getUsers.bind(this)
    }

    componentDidMount () {
        this.getUsers()
        this.getSourceTypes()
    }

    hasErrorFor (field) {
        return !!this.state.errors[field]
    }

    handleInputChanges (e) {
        e.preventDefault()
        this.setState({
            [e.currentTarget.name]: e.currentTarget.value
        })
    }

    renderErrorFor (field) {
        if (this.hasErrorFor(field)) {
            return (
                <span className='invalid-feedback'>
                    <strong>{this.state.errors[field][0]}</strong>
                </span>
            )
        }
    }

    handleClick (event) {
        this.setState({ loading: true })
        const formData = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            phone: this.state.phone,
            address_1: this.state.address_1,
            address_2: this.state.address_2,
            zip: this.state.zip,
            city: this.state.city,
            job_title: this.state.job_title,
            company_name: this.state.company_name,
            description: this.state.description,
            customer_type: this.props.customer_type,
            title: this.state.title,
            valued_at: this.state.valued_at,
            contributors: this.state.contributors,
            source_type: this.state.source_type,
            task_type: this.props.task_type,
            task_status: this.props.status
        }
        this.setState({ submitSuccess: true, values: [...this.state.values, formData], loading: false })
        axios.post('/api/tasks/deal', formData)
            .then((response) => {
                this.toggle()
                this.setState({
                    title: null,
                    content: null,
                    contributors: null,
                    source_type: null,
                    due_date: null,
                    loading: false
                })
                const firstTask = response.data
                this.props.tasks.push(firstTask)
                this.props.action(this.props.tasks)
            })
            .catch((error) => {
                this.setState({
                    errors: error.response.data.errors
                })
            })
    }

    buildSourceTypeOptions () {
        let sourceTypeContent
        if (!this.state.sourceTypes.length) {
            sourceTypeContent = <option value="">Loading...</option>
        } else {
            sourceTypeContent = this.state.sourceTypes.map((user, index) => (
                <option key={index} value={user.id}>{user.name}</option>
            ))
        }

        return (
            <FormGroup>
                <Label for="contributors">Source Type:</Label>
                <Input className={this.hasErrorFor('source_type') ? 'is-invalid' : ''} type="select"
                       name="source_type" id="source_type" onChange={this.handleInputChanges.bind(this)}>
                    <option value="">Choose:</option>
                    {sourceTypeContent}
                </Input>
                {this.renderErrorFor('source_type')}
            </FormGroup>
        )
    }

    buildUserOptions () {
        let userContent
        if (!this.state.users.length) {
            userContent = <option value="">Loading...</option>
        } else {
            userContent = this.state.users.map((user, index) => (
                <option key={index} value={user.id}>{user.first_name + ' ' + user.last_name}</option>
            ))
        }

        return (
            <FormGroup>
                <Label for="contributors">Assign to:</Label>
                <Input className={this.hasErrorFor('contributors') ? 'is-invalid' : ''} type="select"
                       name="contributors" id="contributors" onChange={this.handleInputChanges.bind(this)}>
                    <option value="">Choose:</option>
                    {userContent}
                </Input>
                {this.renderErrorFor('contributors')}
            </FormGroup>
        )
    }

    toggle () {
        this.setState({
            modal: !this.state.modal
        })
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
                console.log(this.state.users)
            })
            .catch((e) => {
                console.error(e)
                this.setState({
                    err: e
                })
            })
    }

    getSourceTypes () {
        axios.get('/api/tasks/source-types')
            .then((r) => {
                this.setState({
                    sourceTypes: r.data,
                    err: ''
                })
            })
            .then((r) => {
                console.warn(this.state.users)
            })
            .catch((e) => {
                console.error(e)
                this.setState({
                    err: e
                })
            })
    }

    render () {
        const { submitSuccess, loading } = this.state
        const userOptions = this.buildUserOptions()
        const sourceTypeOptions = this.buildSourceTypeOptions()

        return (
            <React.Fragment>
                <Button color="success" onClick={this.toggle}>+</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Add Lead
                    </ModalHeader>

                    <ModalBody>

                        {!submitSuccess && (
                            <div className="alert alert-info" role="alert">
                                Fill the form below to create a new post
                            </div>
                        )}

                        {submitSuccess && (
                            <div className="alert alert-info" role="alert">
                                The form was successfully submitted!
                            </div>
                        )}

                        <Form id={'create-post-form'} onSubmit={this.processFormSubmission} noValidate={true}>

                            <FormGroup>
                                <Label for="title"> Title </Label>
                                <Input className={this.hasErrorFor('title') ? 'is-invalid' : ''} type="text"
                                    id="title" onChange={this.handleInputChanges.bind(this)} name="title"
                                    placeholder="Enter title"/>
                                {this.renderErrorFor('first_name')}
                            </FormGroup>

                            <FormGroup>
                                <Label for="description"> Description </Label>
                                <Input className={this.hasErrorFor('description') ? 'is-invalid' : ''} type="textarea"
                                    id="first_name" onChange={this.handleInputChanges.bind(this)} name="description"
                                    placeholder="Description"/>
                                {this.renderErrorFor('description')}
                            </FormGroup>

                            <FormGroup>
                                <Label for="valued_at"> Value </Label>
                                <Input className={this.hasErrorFor('valued_at') ? 'is-invalid' : ''} type="text"
                                    id="valued_at" onChange={this.handleInputChanges.bind(this)} name="valued_at"
                                    placeholder="Value"/>
                                {this.renderErrorFor('valued_at')}
                            </FormGroup>

                            {userOptions}

                            {sourceTypeOptions}

                            <hr />

                            <FormGroup>
                                <Label for="first_name"> First Name </Label>
                                <Input className={this.hasErrorFor('first_name') ? 'is-invalid' : ''} type="text"
                                    id="first_name" onChange={this.handleInputChanges.bind(this)} name="first_name"
                                    placeholder="Enter customer's first name"/>
                                {this.renderErrorFor('first_name')}
                            </FormGroup>

                            <FormGroup>
                                <Label for="last_name"> Last Name </Label>
                                <Input className={this.hasErrorFor('last_name') ? 'is-invalid' : ''} type="text"
                                    id="last_name" onChange={this.handleInputChanges.bind(this)} name="last_name"
                                    placeholder="Enter customer's last name"/>
                                {this.renderErrorFor('last_name')}
                            </FormGroup>

                            <FormGroup>
                                <Label for="email"> Email </Label>
                                <Input className={this.hasErrorFor('email') ? 'is-invalid' : ''} type="email" id="email"
                                    onChange={this.handleInputChanges.bind(this)} name="email"
                                    placeholder="Enter customer's email address"/>
                                {this.renderErrorFor('email')}
                            </FormGroup>

                            <FormGroup>
                                <Label for="phone"> Phone </Label>
                                <Input className={this.hasErrorFor('phone') ? 'is-invalid' : ''} type="text" id="phone"
                                    onChange={this.handleInputChanges.bind(this)} name="phone"
                                    placeholder="Enter customer's phone number"/>
                                {this.renderErrorFor('phone')}
                            </FormGroup>

                            <FormGroup>
                                <Label for="address"> Address 1 </Label>
                                <Input className={this.hasErrorFor('address_1') ? 'is-invalid' : ''} type="text"
                                    id="address_1" onChange={this.handleInputChanges.bind(this)} name="address_1"
                                    placeholder="Enter customer's address"/>
                                {this.renderErrorFor('address_1')}
                            </FormGroup>

                            <FormGroup>
                                <Label for="address"> Address 2 </Label>
                                <Input className={this.hasErrorFor('address_2') ? 'is-invalid' : ''} type="text"
                                    id="address_2" onChange={this.handleInputChanges.bind(this)} name="address_2"
                                    placeholder="Enter customer's address"/>
                                {this.renderErrorFor('address_2')}
                            </FormGroup>

                            <FormGroup>
                                <Label for="postcode"> Postcode </Label>
                                <Input className={this.hasErrorFor('zip') ? 'is-invalid' : ''} type="text" id="zip"
                                    onChange={this.handleInputChanges.bind(this)} name="zip"
                                    placeholder="Enter customer's postcode"/>
                                {this.renderErrorFor('zip')}
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="city"> City </Label>
                                <Input className={this.hasErrorFor('city') ? 'is-invalid' : ''} type="text" id="city"
                                    onChange={this.handleInputChanges.bind(this)} name="city"
                                    placeholder="Enter customer's city"/>
                                {this.renderErrorFor('city')}
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="company_name"> Company Name </Label>
                                <Input className={this.hasErrorFor('company_name') ? 'is-invalid' : ''}
                                    type="text"
                                    id="company_name"
                                    onChange={this.handleInputChanges.bind(this)}
                                    name="company_name"
                                    placeholder="Company Name"/>
                                {this.renderErrorFor('company_name')}
                            </FormGroup>

                            <FormGroup>
                                <Label htmlFor="job_title"> Job Title </Label>
                                <Input className={this.hasErrorFor('job_title') ? 'is-invalid' : ''}
                                    type="text"
                                    id="job_title"
                                    onChange={this.handleInputChanges.bind(this)}
                                    name="job_title"
                                    placeholder="Job Title"/>
                                {this.renderErrorFor('job_title')}
                            </FormGroup>
                        </Form>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="success" onClick={this.handleClick.bind(this)}>Add</Button>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>

                        {loading &&
                        <span className="fa fa-circle-o-notch fa-spin"/>
                        }
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }
}

export default AddLeadForm
