/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Form } from 'reactstrap'
import axios from 'axios'

class EditCustomer extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            id: this.props.id,
            customer: {},
            values: [],
            loading: false,
            submitSuccess: false,
            errors: []
        }
        this.toggle = this.toggle.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.setValues = this.setValues.bind(this)
        this.buildForm = this.buildForm.bind(this)
    }

    componentDidMount () {
        axios.get(`/api/customers/${this.state.id}`).then(data => {
            const customerData = { ...data.data, ...data.data.addresses[0] }
            delete customerData.addresses
            this.setState({ customer: customerData })
        })
    }

    hasErrorFor (field) {
        return !!this.state.errors[field]
    }

    handleInputChanges (e) {
        this.setValues({ [e.currentTarget.id]: e.currentTarget.value })
    }

    setValues (values) {
        this.setState({ customer: { ...this.state.customer, ...values } })
        console.log(this.state.customer)
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

        axios.put(`/api/customers/${this.state.id}`, this.state.customer).then(response => {
            this.toggle()

            if (this.props.action) {
                this.props.action(response.data)
            }

            this.setState({ submitSuccess: true, loading: false })
        })
            .catch((error) => {
                alert(error)
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

    buildForm () {
        return (
            <Form id={'create-post-form'} onSubmit={this.processFormSubmission} noValidate={true}>
                <FormGroup>
                    <Label for="first_name"> First Name </Label>
                    <Input className={this.hasErrorFor('first_name') ? 'is-invalid' : ''} type="text"
                        id="first_name" defaultValue={this.state.customer.first_name}
                        onChange={this.handleInputChanges.bind(this)} name="first_name"
                        placeholder="Enter customer's first name"/>
                    {this.renderErrorFor('first_name')}
                </FormGroup>

                <FormGroup>
                    <Label for="last_name"> Last Name </Label>
                    <Input className={this.hasErrorFor('last_name') ? 'is-invalid' : ''} type="text"
                        id="last_name" defaultValue={this.state.customer.last_name}
                        onChange={this.handleInputChanges.bind(this)} name="last_name"
                        placeholder="Enter customer's last name"/>
                    {this.renderErrorFor('last_name')}
                </FormGroup>

                <FormGroup>
                    <Label for="email"> Email </Label>
                    <Input className={this.hasErrorFor('email') ? 'is-invalid' : ''} type="email" id="email"
                        defaultValue={this.state.customer.email}
                        onChange={this.handleInputChanges.bind(this)} name="email"
                        placeholder="Enter customer's email address"/>
                    {this.renderErrorFor('email')}
                </FormGroup>

                <FormGroup>
                    <Label for="phone"> Phone </Label>
                    <Input className={this.hasErrorFor('phone') ? 'is-invalid' : ''} type="text" id="phone"
                        defaultValue={this.state.customer.phone}
                        onChange={this.handleInputChanges.bind(this)} name="phone"
                        placeholder="Enter customer's phone number"/>
                    {this.renderErrorFor('phone')}
                </FormGroup>

                <FormGroup>
                    <Label for="address"> Address 1 </Label>
                    <Input className={this.hasErrorFor('address_1') ? 'is-invalid' : ''} type="text"
                        id="address_1" defaultValue={this.state.customer.address_1}
                        onChange={this.handleInputChanges.bind(this)} name="address_1"
                        placeholder="Enter customer's address"/>
                    {this.renderErrorFor('address_1')}
                </FormGroup>

                <FormGroup>
                    <Label for="address"> Address 2 </Label>
                    <Input className={this.hasErrorFor('address_2') ? 'is-invalid' : ''} type="text"
                        id="address_2" defaultValue={this.state.customer.address_2}
                        onChange={this.handleInputChanges.bind(this)} name="address_2"
                        placeholder="Enter customer's address"/>
                    {this.renderErrorFor('address_2')}
                </FormGroup>

                <FormGroup>
                    <Label for="postcode"> Postcode </Label>
                    <Input className={this.hasErrorFor('zip') ? 'is-invalid' : ''} type="text" id="zip"
                        defaultValue={this.state.customer.zip}
                        onChange={this.handleInputChanges.bind(this)} name="zip"
                        placeholder="Enter customer's postcode"/>
                    {this.renderErrorFor('zip')}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="city"> City </Label>
                    <Input className={this.hasErrorFor('city') ? 'is-invalid' : ''} type="text" id="city"
                        defaultValue={this.state.customer.city}
                        onChange={this.handleInputChanges.bind(this)} name="city"
                        placeholder="Enter customer's city"/>
                    {this.renderErrorFor('city')}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="company_name"> Company Name </Label>
                    <Input className={this.hasErrorFor('company_name') ? 'is-invalid' : ''} type="text" id="company_name"
                        defaultValue={this.state.customer.company_name}
                        onChange={this.handleInputChanges.bind(this)} name="company_name"
                        placeholder="Enter Company Name"/>
                    {this.renderErrorFor('company_name')}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="job_title"> Job Title </Label>
                    <Input className={this.hasErrorFor('job_title') ? 'is-invalid' : ''} type="text" id="job_title"
                        defaultValue={this.state.customer.job_title}
                        onChange={this.handleInputChanges.bind(this)} name="job_title"
                        placeholder="Enter Job Title"/>
                    {this.renderErrorFor('job_title')}
                </FormGroup>
            </Form>
        )
    }

    render () {
        const { submitSuccess, loading } = this.state
        const form = this.buildForm()
        const updateButton = <Button color="primary" onClick={this.handleClick.bind(this)}>Update</Button>

        if (this.props.modal) {
            return (
                <div>
                    <Button color="primary" onClick={this.toggle}>Edit</Button>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>
                            Edit Customer
                        </ModalHeader>

                        <ModalBody>
                            {submitSuccess && (
                                <div className="alert alert-info" role="alert">
                                    Customer's details has been edited successfully </div>
                            )}

                            {form}

                        </ModalBody>
                        <ModalFooter>
                            {updateButton}
                            <Button color="secondary" onClick={this.toggle}>Close</Button>
                            {loading &&
                            <span className="fa fa-circle-o-notch fa-spin"/>
                            }
                        </ModalFooter>
                    </Modal>
                </div>
            )
        }

        return (
            <div>
                {form}
                {updateButton}
            </div>
        )
    }
}

export default EditCustomer
