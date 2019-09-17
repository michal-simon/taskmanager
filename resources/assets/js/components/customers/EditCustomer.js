import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,Input,FormGroup,Label, Form } from 'reactstrap';
import axios from 'axios'

class EditCustomer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            id: this.props.id,
            customer: {},
            values: [],
            loading: false,
            submitSuccess: false,
             errors: []
        };

        this.toggle = this.toggle.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.setValues = this.setValues.bind(this)
    }

    componentDidMount() {
        axios.get(`/api/customers/${this.state.id}`).then(data => {
            const customerData = { ...data.data, ...data.data.addresses[0] }; // or { ...response } if you want to clone response as well
            delete customerData['addresses']
            //console.log('customer', customerData)
            this.setState({ customer: customerData });
            console.log('customer', this.state.customer)

        })
    }

    hasErrorFor (field) {
        return !!this.state.errors[field]
    }

    handleInputChanges(e) {
        this.setValues({ [e.currentTarget.id]: e.currentTarget.value })
    }
    
    setValues(values) {
        this.setState({ customer: { ...this.state.customer, ...values } });
        
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

    handleClick(event) {
        
        this.setState({ loading: true });

        //this.getStoryCount()
        axios.put(`/api/customers/${this.state.id}`, this.state.customer).then(response => {
                if(response.data.error)
                    alert(response.data.error)
                else{
                    this.toggle();
                    this.props.action(response.data);
                    this.setState({ submitSuccess: true, loading: false })
                }
            })
            .catch((error)=> {
                alert(error)
                this.setState({
                    errors: error.response.data.errors
                })
            });
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        const { submitSuccess, loading } = this.state;


        return (
            <div>
                <Button color="primary" onClick={this.toggle}>Edit Customer</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Edit Customer
                    </ModalHeader>

                    <ModalBody>
                            {submitSuccess && (
                                <div className="alert alert-info" role="alert">
                                    Customer's details has been edited successfully </div>
                            )}

                            <Form id={"create-post-form"} onSubmit={this.processFormSubmission} noValidate={true}>
                                <FormGroup>
                                    <Label for="first_name"> First Name </Label>
                                    <Input className={this.hasErrorFor('first_name') ? 'is-invalid' : ''} type="text" id="first_name" defaultValue={this.state.customer.first_name} onChange={this.handleInputChanges.bind(this)} name="first_name" placeholder="Enter customer's first name" />
                                    {this.renderErrorFor('first_name')}
                                </FormGroup>

                                <FormGroup>
                                    <Label for="last_name"> Last Name </Label>
                                    <Input className={this.hasErrorFor('last_name') ? 'is-invalid' : ''} type="text" id="last_name" defaultValue={this.state.customer.last_name} onChange={this.handleInputChanges.bind(this)} name="last_name" placeholder="Enter customer's last name" />
                                    {this.renderErrorFor('last_name')}
                                </FormGroup>

                                <FormGroup>
                                    <Label for="email"> Email </Label>
                                    <Input className={this.hasErrorFor('email') ? 'is-invalid' : ''} type="email" id="email" defaultValue={this.state.customer.email} onChange={this.handleInputChanges.bind(this)} name="email" placeholder="Enter customer's email address" />
                                    {this.renderErrorFor('email')}
                                </FormGroup>

                                <FormGroup>
                                   <Label for="phone"> Phone </Label>
                                   <Input className={this.hasErrorFor('phone') ? 'is-invalid' : ''} type="text" id="phone" defaultValue={this.state.customer.phone} onChange={this.handleInputChanges.bind(this)} name="phone" placeholder="Enter customer's phone number" />
                                   {this.renderErrorFor('phone')}
                                </FormGroup>
                                
                                <FormGroup>
                                    <Label for="address"> Address 1 </Label>
                                    <Input className={this.hasErrorFor('address_1') ? 'is-invalid' : ''} type="text" id="address_1" defaultValue={this.state.customer.address_1} onChange={this.handleInputChanges.bind(this)} name="address_1" placeholder="Enter customer's address" />
                                    {this.renderErrorFor('address_1')}
                                </FormGroup>
                                
                                <FormGroup>
                                    <Label for="address"> Address 2 </Label>
                                    <Input className={this.hasErrorFor('address_2') ? 'is-invalid' : ''} type="text" id="address_2" defaultValue={this.state.customer.address_2} onChange={this.handleInputChanges.bind(this)} name="address_2" placeholder="Enter customer's address" />
                                     {this.renderErrorFor('address_2')}
                                </FormGroup>
                                    
                                <FormGroup>
                                    <Label for="postcode"> Postcode </Label>
                                    <Input className={this.hasErrorFor('zip') ? 'is-invalid' : ''} type="text" id="zip" defaultValue={this.state.customer.zip} onChange={this.handleInputChanges.bind(this)} name="zip" placeholder="Enter customer's postcode" />
                                    {this.renderErrorFor('zip')}
                                </FormGroup>
                                    
                                <FormGroup>
                                    <Label htmlFor="city"> City </Label>
                                    <Input className={this.hasErrorFor('city') ? 'is-invalid' : ''} type="text" id="city" defaultValue={this.state.customer.city} onChange={this.handleInputChanges.bind(this)} name="city" placeholder="Enter customer's city" />
                                    {this.renderErrorFor('city')}
                                </FormGroup>
                            </Form>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.handleClick.bind(this)}><i className="fas fa-plus-circle"></i> Add</Button>
                        <Button color="secondary" onClick={this.toggle}><i className="fas fa-times-circle"></i> Close</Button>
                        {loading &&
                            <span className="fa fa-circle-o-notch fa-spin" />
                        }
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default EditCustomer;