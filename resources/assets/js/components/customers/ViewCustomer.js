import axios from 'axios'
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
            errors: []
        }
    }

    componentDidMount () {
        axios.get(`/api/customers/${this.state.id}`).then(data => {
            const customerData = { ...data.data, ...data.data.addresses[0] }
            delete customerData.addresses
            this.setState({ customer: customerData })
        })
    }

    render () {
        return (
            <div>

                        <Form>
                            <Form.Group as={Row} controlId="formPlaintextEmail">
                                <Form.Label column sm="2">First Name </Form.Label>

                                <Col sm="10">
                                    <Form.Control plaintext readOnly  defaultValue={this.state.customer.first_name} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formPlaintextEmail">
                                <Form.Label column sm="2"> Last Name </Form.Label>

                                <Col sm="10">
                                    <Form.Control plaintext readOnly  defaultValue={this.state.customer.last_name} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formPlaintextEmail">
                                <Form.Label column sm="2"> Email </Form.Label>

                                <Col sm="10">
                                    <Form.Control plaintext readOnly  defaultValue={this.state.customer.email} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formPlaintextEmail">
                                <Form.Label column sm="2"> Phone </Form.Label>

                                <Col sm="10">
                                    <Form.Control plaintext readOnly  defaultValue={this.state.customer.phone} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formPlaintextEmail">
                                <Form.Label column sm="2"> Address 1 </Form.Label>

                                <Col sm="10">
                                    <Form.Control plaintext readOnly  defaultValue={this.state.customer.address_1} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formPlaintextEmail">
                                <Form.Label column sm="2"> Address 2 </Form.Label>

                                <Col sm="10">
                                    <Form.Control plaintext readOnly  defaultValue={this.state.customer.address_2} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formPlaintextEmail">
                                <Form.Label column sm="2"> Postcode </Form.Label>

                                <Col sm="10">
                                    <Form.Control plaintext readOnly  defaultValue={this.state.customer.zip} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formPlaintextEmail">
                                <Form.Label column sm="2"> City </Form.Label>

                                <Col sm="10">
                                    <Form.Control plaintext readOnly  defaultValue={this.state.customer.city} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formPlaintextEmail">
                                <Form.Label column sm="2"> Company Name </Form.Label>

                                <Col sm="10">
                                    <Form.Control plaintext readOnly  defaultValue={this.state.customer.company_name} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} controlId="formPlaintextEmail">
                                <Form.Label column sm="2"> Job Title </Form.Label>

                                <Col sm="10">
                                    <Form.Control plaintext readOnly  defaultValue={this.state.customer.job_title} />
                                </Col>
                            </Form.Group>
                        </Form>
            </div>
        )
    }
}

export default ViewCustomer