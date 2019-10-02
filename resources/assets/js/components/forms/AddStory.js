/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'

class AddStory extends React.Component {
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
        this.getStoryCount = this.getStoryCount.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.buildCustomerOptions = this.buildCustomerOptions.bind(this)
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

    /** To be done */
    getStoryCount () {
        axios.get('/story/count')
            .then((r) => {
                this.setState({
                    count: r.data.count,
                    err: ''
                })
            })
            .catch((e) => {
                this.setState({
                    err: e
                })
            })
    }

    handleClick (event) {
        axios.post('/api/projects', {
            title: this.state.title,
            description: this.state.description,
            customer_id: this.state.customer_id,
            created_by: this.state.created_by,
            storyId: this.state.count
        })
            .then((response) => {
                this.toggle()
                if (response.data) {
                    this.props.addProject(response.data)
                }
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

    toggle () {
        this.setState({
            modal: !this.state.modal
        })
    }

    buildCustomerOptions () {
        let customerList
        if (!this.props.customers) {
            customerList = <option value="">Loading...</option>
        } else {
            customerList = this.props.customers.map((customer, index) => (
                <option key={index} value={customer.id}>{customer.name}</option>
            ))
        }

        return (
            <FormGroup>
                <Label for="contributors">Customer:</Label>
                <Input className={this.hasErrorFor('customer_id') ? 'is-invalid' : ''} type="select"
                    name="customer_id" id="customer_id" onChange={this.handleInput.bind(this)}>
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
                <Button color="success" onClick={this.toggle}><i className="fa fa-plus-circle"/> Add Project</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Add Project
                    </ModalHeader>

                    <ModalBody>
                        <FormGroup>
                            <Label for="title">Story Title(*):</Label>
                            <Input className={this.hasErrorFor('description') ? 'is-invalid' : ''} type="text"
                                name="title" onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('title')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="description">Description(*):</Label>
                            <Input className={this.hasErrorFor('description') ? 'is-invalid' : ''} type="textarea"
                                name="description" onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('description')}
                        </FormGroup>

                        {customerList}

                        <FormGroup>
                            <Label for="created_by">Created by(*):</Label>
                            <Input className={this.hasErrorFor('description') ? 'is-invalid' : ''} type="text"
                                name="created_by" onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('created_by')}
                        </FormGroup>
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

export default AddStory
