import React, { Component } from 'react';
import Address from './Address';
import LineItemEditor from './LineItemEditor';
import axios from 'axios'
import {Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";

class LineItemModel {
    constructor(id, quantity, description, unit_price) {
        this.id = id;
        this.quantity = quantity;
        this.description = description;
        this.unit_price = unit_price
    }

    get subTotal() {
        return this.quantity * this.unit_price;
    }
}

class EditInvoice extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            due_date: null,
            lines: [],
            existingLines: [],
            customer_id: 1,
            errors: []
        }

        this.updateData = this.updateData.bind(this)
        this.saveData = this.saveData.bind(this)
        this.setTotal = this.setTotal.bind(this)
        this.toggle = this.toggle.bind(this);
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.total = 0


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

    handleInput(e) {

        alert(e.target.name + ' ' + e.target.value)

        this.setState({
            [e.target.name]: e.target.value
        })
    }

    hasErrorFor (field) {
        return !!this.state.errors[field]
    }

    loadInvoice() {

        if(!this.props.add) {
            return false
        }

        axios.get(`/api/invoice/${this.props.invoice_id}`)
            .then((r)=> {
                console.log('invoices', r.data)
                this.setState({existingLines: r.data})
            })
            .catch((e)=>{
              alert(e)
            })
    }


    render() {
        const mockAddress = {
            line1: '16 The Harbor',
            town: 'Newport',
            county: 'Gwent',
            country: 'Wales'
        };

        return (

            <div>
                <Button color="secondary" onClick={this.toggle}><i className="fas fa-plus-circle"/>Edit</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} size="lg">
                    <ModalHeader toggle={this.toggle}>
                       Invoice
                    </ModalHeader>

                    <ModalBody>
                        <div>
                            <Address address={mockAddress} />

                            <FormGroup>
                                <Label for="due_date">Due Date(*):</Label>
                                <Input className={this.hasErrorFor('due_date') ? 'is-invalid' : ''} type="date" name="due_date" onChange={this.handleInput.bind(this)}/>
                                {this.renderErrorFor('due_date')}
                            </FormGroup>

                            <FormGroup>
                                <Label for="customer">Customer(*):</Label>
                                <Input className={this.hasErrorFor('customer') ? 'is-invalid' : ''} type="select" name="customer_id" onChange={this.handleInput.bind(this)}>
                                    <option value="">Choose:</option>
                                    <option value="2">Test Customer</option>
                                </Input>
                                {this.renderErrorFor('customer')}
                            </FormGroup>

                            <LineItemEditor lineItemModel={this.state.existingLines} update={this.updateData} setTotal={this.setTotal} />
                            <button onClick={this.saveData}>Save</button>
                            <br />
                            <br />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}><i className="fas fa-times-circle"></i> Close</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });

        this.loadInvoice()
    }

    updateData(data) {
        this.setState({data: data})
        console.log('data', this.state.data)
    }

    setTotal(total) {
        this.total = total
    }

    saveData() {
        const data = {
            invoice_id: this.props.invoice_id,
            due_date: this.state.due_date,
            customer_id: this.state.customer_id,
            data: JSON.stringify(this.state.data),
            total: this.total,
            payment_type: 1
        }

        axios.post('/api/invoice', data)
            .then((response) => {
                // this.setState({
                //     editMode: false
                // });
            })
            .catch((error) => {
                alert(error)
            });
    }
}

export default EditInvoice;