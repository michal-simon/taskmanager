/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'

class EditProject extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            title: '',
            description: '',
            customer_id: '',
            created_by: '',
            count: 2,
            errors: [],
            customers: []
        }
        this.toggle = this.toggle.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.buildCustomerOptions = this.buildCustomerOptions.bind(this)
        this.getProject = this.getProject.bind(this)
    }

    componentDidMount () {
        this.getCustomers()
        this.getProject()
    }

    hasErrorFor (field) {
        return !!this.state.errors[field]
    }

    handleChange (event) {
        this.setState({ name: event.target.value })
    }

    handleInput (e) {
        this.setState({
            [e.target.name]: e.target.value
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
        axios.put(`/api/projects/${this.props.project_id}`, {
            title: this.state.title,
            description: this.state.description,
            customer_id: this.state.customer_id
        })
            .then((response) => {
                this.toggle()

                this.setState({
                    title: null,
                    description: null,
                    customer_id: null,
                    created_by: null,
                    storyId: null,
                    loading: false
                })
            })
            .catch((error) => {
                this.setState({
                    errors: error.response.data.errors
                })
            })
    }

    getCustomers () {
        axios.get('/api/customers')
            .then((r) => {
                this.setState({
                    customers: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    getProject () {
        axios.get(`/api/projects/${this.props.project_id}`)
            .then((r) => {
                if(r.data) {
                    this.setState({
                        title: r.data.title,
                        description: r.data.description,
                        customer_id: r.data.customer_id
                    })
                }
            })
            .catch((e) => {
                console.error(e)
            })
    }

    toggle () {
        this.setState({
            modal: !this.state.modal
        })
    }

    buildCustomerOptions () {
        let customerList
        if (!this.state.customers.length) {
            customerList = <option value="">Loading...</option>
        } else {
            customerList = this.state.customers.map((customer, index) => (
                <option key={index} value={customer.id}>{customer.name}</option>
            ))
        }

        return (
            <FormGroup>
                <Label for="contributors">Customer:</Label>
                <Input className={this.hasErrorFor('customer_id') ? 'is-invalid' : ''}
                    value={this.state.customer_id}
                    type="select"
                    name="customer_id"
                    id="customer_id"
                    onChange={this.handleInput.bind(this)}>
                    <option value="">Choose:</option>
                    {customerList}
                </Input>
                {this.renderErrorFor('contributors')}
            </FormGroup>
        )
    }

    render () {
        const customerList = this.buildCustomerOptions()

        return (
            <div>
                <Button className="mr-2 ml-2" color="primary" onClick={this.toggle}>Edit Project</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Edit Project
                    </ModalHeader>

                    <ModalBody>
                        <FormGroup>
                            <Label for="title">Story Title(*):</Label>
                            <Input className={this.hasErrorFor('description') ? 'is-invalid' : ''}
                                type="text"
                                value={this.state.title}
                                name="title"
                                onChange={this.handleInput.bind(this)}
                            />
                            {this.renderErrorFor('title')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="description">Description(*):</Label>
                            <Input className={this.hasErrorFor('description') ? 'is-invalid' : ''}
                                type="textarea"
                                value={this.state.description}
                                name="description"
                                onChange={this.handleInput.bind(this)}
                            />
                            {this.renderErrorFor('description')}
                        </FormGroup>

                        {customerList}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleClick.bind(this)}>Add</Button>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

export default EditProject
