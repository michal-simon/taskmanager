/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Form } from 'reactstrap'
import axios from 'axios'

class AddCustomer extends React.Component {
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
            zip: '',
            city: '',
            description: '',
            values: [],
            loading: false,
            submitSuccess: false,
            count: 2,
            errors: []
        }
        this.toggle = this.toggle.bind(this)
        this.handleInputChanges = this.handleInputChanges.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
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
            description: this.state.description
        }
        this.setState({ submitSuccess: true, values: [...this.state.values, formData], loading: false })
        axios.post('/api/customers', formData)
            .then((response) => {
                this.toggle()
                const newCustomer = response.data
                this.props.customers.push(newCustomer)
                this.props.action(this.props.customers)
                this.setState({
                    first_name: null,
                    last_name: null,
                    email: null,
                    phone: null,
                    address_1: null,
                    address_2: null,
                    zip: null,
                    city: null,
                    description: null
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

    render () {
        const { submitSuccess, loading } = this.state
        return (
            <React.Fragment>
                <Button color="success" onClick={this.toggle}>Add Customer</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Add Customer
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

export default AddCustomer
