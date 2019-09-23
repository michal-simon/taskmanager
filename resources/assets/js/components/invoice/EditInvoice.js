/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import Address from './Address'
import LineItemEditor from './LineItemEditor'
import axios from 'axios'
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

class EditInvoice extends Component {
    constructor (props, context) {
        super(props, context)
        this.state = {
            due_date: '',
            quantity: '',
            lines: [],
            address: {},
            existingLines: [],
            customerName: '',
            customer_id: 1,
            invoice_status: 1,
            customers: [],
            errors: []
        }
        this.updateData = this.updateData.bind(this)
        this.saveData = this.saveData.bind(this)
        this.setTotal = this.setTotal.bind(this)
        this.toggle = this.toggle.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.total = 0
        this.changeStatus = this.changeStatus.bind(this)
    }

    componentDidMount () {
        this.loadInvoice()
        this.loadCustomers()
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

    handleInput (e) {
        if (e.target.name === 'customer_id') {
            const index = this.state.customers.findIndex(customer => customer.id === parseInt(e.target.value))
            const customer = this.state.customers[index]
            this.setState({ customerName: customer.name })

            if (customer.address) {
                const address = customer.address
                const objAddress = {
                    line1: address.address_1,
                    town: address.address_2,
                    county: address.city,
                    country: 'United Kingdom'
                }
                this.setState({ address: objAddress })
            }
        }
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    hasErrorFor (field) {
        return !!this.state.errors[field]
    }

    loadCustomers () {
        axios.get('/api/customers/')
            .then((r) => {
                this.setState({ customers: r.data })
            })
            .catch((e) => {
                alert(e)
            })
    }

    loadInvoice () {
        if (!this.props.add) {
            return false
        }
        axios.get(`/api/invoice/${this.props.invoice_id}`)
            .then((r) => {
                this.setState({
                    existingLines: r.data.lines,
                    due_date: r.data.invoice.due_date,
                    invoice_status: r.data.invoice.invoice_status
                })
            })
            .catch((e) => {
                alert(e)
            })
    }

    changeStatus (status) {
        if (!this.props.invoice_id) {
            return false
        }
        axios.put(`/api/invoice/${this.props.invoice_id}`, {
            invoice_status: status
        })
            .then((response) => {
                this.setState({ invoice_status: status })
            })
            .catch((error) => {
                console.warn(error)
            })
    }

    toggle () {
        this.setState({
            modal: !this.state.modal
        })
    }

    updateData (data) {
        this.setState({ data: data })
    }

    setTotal (total) {
        this.total = total
    }

    saveData () {
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
                const firstInvoice = response.data
                const allInvoices = this.props.invoices
                allInvoices.push(firstInvoice)
                this.props.action(allInvoices)
            })
            .catch((error) => {
                alert(error)
            })
    }

    render () {
        const changeStatusButton = this.state.invoice_status === 1
            ? <Button color="primary" onClick={() => this.changeStatus(2).bind(this)}>Send</Button>
            : <Button color="primary" onClick={() => this.changeStatus(3).bind(this)}>Paid</Button>

        let customerContent
        if (!this.state.customers.length) {
            customerContent = <option value="">Loading...</option>
        } else {
            customerContent = this.state.customers.map((customer, index) => (
                <option key={index} value={customer.id}>{customer.name}</option>
            ))
        }

        const buttonText = !this.props.add ? 'Create Invoice' : 'Update'
        return (
            <React.Fragment>
                <Button color="success" onClick={this.toggle}>{buttonText}</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} size="lg">
                    <ModalHeader toggle={this.toggle}>
                        Invoice
                    </ModalHeader>

                    <ModalBody>
                        <div>
                            <h2>{this.state.customerName}</h2>
                            <Address address={this.state.address}/>

                            <FormGroup>
                                <Label for="due_date">Due Date(*):</Label>
                                <Input className={this.hasErrorFor('due_date') ? 'is-invalid' : ''}
                                    value={this.state.due_date} type="date" name="due_date"
                                    onChange={this.handleInput.bind(this)}/>
                                {this.renderErrorFor('due_date')}
                            </FormGroup>

                            <FormGroup>
                                <Label for="customer">Customer(*):</Label>
                                <Input className={this.hasErrorFor('customer') ? 'is-invalid' : ''} type="select"
                                    name="customer_id" onChange={this.handleInput.bind(this)}>
                                    <option>Choose A customer</option>
                                    {customerContent}
                                </Input>
                                {this.renderErrorFor('customer')}
                            </FormGroup>

                            <LineItemEditor lineItemModel={this.state.existingLines} update={this.updateData}
                                            setTotal={this.setTotal}/>
                            <Button color="success" onClick={this.saveData}>Save</Button>
                            {changeStatusButton}
                            <br/>
                            <br/>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }
}

export default EditInvoice
