/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, Form } from 'reactstrap'
import axios from 'axios'
import CompanyDropdown from '../common/CompanyDropdown'
import CustomerTypeDropdown from '../common/CustomerTypeDropdown'

class EditCustomer extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            modal: false,
            id: this.props.customer.id,
            first_name: this.props.customer.name.split(' ').slice(0, -1).join(' '),
            last_name: this.props.customer.name.split(' ').slice(-1).join(' '),
            email: this.props.customer.email,
            job_title: this.props.customer.job_title,
            company_id: this.props.customer.company_id,
            customer_type: this.props.customer.customer_type,
            address_1: this.props.customer.address.address_1,
            address_2: this.props.customer.address.address_2,
            zip: this.props.customer.address.zip,
            city: this.props.customer.address.city,
            phone: this.props.customer.phone,
            values: [],
            loading: false,
            submitSuccess: false,
            errors: [],
            companies: []
            
        }
        this.toggle = this.toggle.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.buildForm = this.buildForm.bind(this)
        this.handleInputChanges = this.handleInputChanges.bind(this)
    }

    hasErrorFor (field) {
        return !!this.state.errors[field]
    }

    handleInputChanges (e) {
        this.setState({ [e.currentTarget.id]: e.currentTarget.value })
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
        this.setState({ loading: true, submitSuccess: false })
                
        const customerObj = {
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            email: this.state.email,
            job_title: this.state.job_title,
            company_id: this.state.company_id,
            customer_type: this.state.customer_type,
            address_1: this.state.address_1,
            address_2: this.state.address_2,
            zip: this.state.zip,
            city: this.state.city,
            phone: this.state.phone,
        }

        axios.put(`/api/customers/${this.state.id}`, customerObj).then(response => {
            this.toggle()
            if(this.props.customers && this.props.customers.length) {
                const index = this.props.customers.findIndex(customer => parseInt(customer.id) === this.props.customer.id)
                this.props.customers[index] = response.data
                this.props.action(this.props.customers)
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
            modal: !this.state.modal,
            errors: []
        })
    }

    buildForm () {

        return (
            <Form id={'create-post-form'} onSubmit={this.processFormSubmission} noValidate={true}>
                <FormGroup>
                    <Label for="first_name"> First Name </Label>
                    <Input className={this.hasErrorFor('first_name') ? 'is-invalid' : ''} type="text"
                        id="first_name" defaultValue={this.state.first_name}
                        onChange={this.handleInputChanges.bind(this)} name="first_name"
                        placeholder="Enter customer's first name"/>
                    {this.renderErrorFor('first_name')}
                </FormGroup>

                <FormGroup>
                    <Label for="last_name"> Last Name </Label>
                    <Input className={this.hasErrorFor('last_name') ? 'is-invalid' : ''} type="text"
                        id="last_name" defaultValue={this.state.last_name}
                        onChange={this.handleInputChanges.bind(this)} name="last_name"
                        placeholder="Enter customer's last name"/>
                    {this.renderErrorFor('last_name')}
                </FormGroup>

                <FormGroup>
                    <Label for="email"> Email </Label>
                    <Input className={this.hasErrorFor('email') ? 'is-invalid' : ''} type="email" id="email"
                        defaultValue={this.state.email}
                        onChange={this.handleInputChanges.bind(this)} name="email"
                        placeholder="Enter customer's email address"/>
                    {this.renderErrorFor('email')}
                </FormGroup>

                <FormGroup>
                    <Label for="phone"> Phone </Label>
                    <Input className={this.hasErrorFor('phone') ? 'is-invalid' : ''} type="text" id="phone"
                        defaultValue={this.state.phone}
                        onChange={this.handleInputChanges.bind(this)} name="phone"
                        placeholder="Enter customer's phone number"/>
                    {this.renderErrorFor('phone')}
                </FormGroup>

                <FormGroup>
                    <Label for="address"> Address 1 </Label>
                    <Input className={this.hasErrorFor('address_1') ? 'is-invalid' : ''} type="text"
                        id="address_1" defaultValue={this.state.address_1}
                        onChange={this.handleInputChanges.bind(this)} name="address_1"
                        placeholder="Enter customer's address"/>
                    {this.renderErrorFor('address_1')}
                </FormGroup>

                <FormGroup>
                    <Label for="address"> Address 2 </Label>
                    <Input className={this.hasErrorFor('address_2') ? 'is-invalid' : ''} type="text"
                        id="address_2" defaultValue={this.state.address_2}
                        onChange={this.handleInputChanges.bind(this)} name="address_2"
                        placeholder="Enter customer's address"/>
                    {this.renderErrorFor('address_2')}
                </FormGroup>

                <FormGroup>
                    <Label for="postcode"> Postcode </Label>
                    <Input className={this.hasErrorFor('zip') ? 'is-invalid' : ''} type="text" id="zip"
                        defaultValue={this.state.zip}
                        onChange={this.handleInputChanges.bind(this)} name="zip"
                        placeholder="Enter customer's postcode"/>
                    {this.renderErrorFor('zip')}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="city"> City </Label>
                    <Input className={this.hasErrorFor('city') ? 'is-invalid' : ''} type="text" id="city"
                        defaultValue={this.state.city}
                        onChange={this.handleInputChanges.bind(this)} name="city"
                        placeholder="Enter customer's city"/>
                    {this.renderErrorFor('city')}
                </FormGroup>
                
               <CompanyDropdown
                   company_id={this.state.company_id}
                   renderErrorFor={this.renderErrorFor}
                   handleInputChanges={this.handleInputChanges}
               />

                <CustomerTypeDropdown
                    customer_type={this.state.customer_type}
                    renderErrorFor={this.renderErrorFor}
                    handleInputChanges={this.handleInputChanges}
                />

                <FormGroup>
                    <Label htmlFor="job_title"> Job Title </Label>
                    <Input className={this.hasErrorFor('job_title') ? 'is-invalid' : ''} type="text" id="job_title"
                        defaultValue={this.state.job_title}
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
                    <Button className="ml-2" color="primary" onClick={this.toggle}>Edit</Button>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>
                            Update Customer
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
                {submitSuccess && (
                    <div className="mt-3 alert alert-info" role="alert">
                        Customer's details has been edited successfully </div>
                )}
                {form}
                {updateButton}
            </div>
        )
    }
}

export default EditCustomer
