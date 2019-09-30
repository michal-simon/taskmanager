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
            invoice_id: this.props.invoice_id,
            lines: [],
            address: {},
            existingLines: [],
            customerName: '',
            customer_id: this.props.customer_id ? this.props.customer_id : 0,
            invoice_status: 1,
            customers: [],
            tasks: [],
            errors: [],
            total: 0,
            data: []
        }
        this.updateData = this.updateData.bind(this)
        this.saveData = this.saveData.bind(this)
        this.setTotal = this.setTotal.bind(this)
        this.toggle = this.toggle.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.changeStatus = this.changeStatus.bind(this)
        this.buildCustomerOptions = this.buildCustomerOptions.bind(this)
        this.handleTaskChange = this.handleTaskChange.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.buildForm = this.buildForm.bind(this)
        this.createInvoice = this.createInvoice.bind(this)
        this.handleAddFiled = this.handleAddFiled.bind(this)

        this.total = 0
        this.hasTasks = false
        this.hasLines = false
        this.loadedTasks = false
    }

    componentDidMount () {
        if(this.props.task_id) {
            this.handleTaskChange()
        }

        this.loadCustomers()

        if(this.props.task_id || this.props.invoice_id) {
            this.loadInvoice()
        }
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

    handleTaskChange (e) {
        axios.get(`/api/products/tasks/${this.props.task_id}`)
            .then((r) => {
                const arrLines = []
                let total = 0

                if (r.data && r.data.length) {
                    r.data.map((product) => {
                        const objLine = {
                            quantity: 1,
                            product_id: product.id,
                            unit_price: product.price,
                            description: product.name
                        }

                        total += parseFloat(product.price)
                        arrLines.push(objLine)
                    })
                }

                this.hasTasks = true
                this.setState({ data: arrLines, total: total })
            })
            .catch((e) => {
                console.warn(e)
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
                console.warn(e)
            })
    }

    loadInvoice () {
        const url = this.props.task_id ? `/api/invoice/task/${this.props.task_id}` : `/api/invoice/${this.state.invoice_id}`

        axios.get(url)
            .then((r) => {
                if (r.data.invoice) {

                    this.hasLines = !!(r.data.lines && r.data.lines.length)

                    this.setState({
                        data: r.data.lines,
                        due_date: r.data.invoice.due_date,
                        invoice_id: r.data.invoice.id,
                        invoice_status: r.data.invoice.invoice_status
                    })
                }

                this.loadedTasks = true
            })
            .catch((e) => {
                console.warn(e)
            })
    }

    changeStatus (status) {
        if (!this.state.invoice_id) {
            return false
        }
        axios.put(`/api/invoice/${this.state.invoice_id}`, {
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

    updateData (rowData, row) {

        if (this.state.data && this.state.data[row]) {
            this.state.data[row] = rowData
            return
        }

        this.setState(prevState => ({
            data: [...prevState.data, rowData]
        }))
    }

    handleAddFiled () {
        this.setState((prevState, props) => {
            return {
                data: this.state.data.concat({
                    description: '',
                    quantity: 0,
                    unit_price: 0,
                    product_id: 0
                })
            };
        });
    };

    handleDelete (idx) {
        this.setState((prevState, props) => {
            return {
                data: this.state.data.filter((s, sidx) => idx !== sidx)
            };
        });
    }

    setTotal (total) {
        this.total = total
    }

    saveData () {
        const data = {
            invoice_id: this.state.invoice_id,
            task_id: this.props.task_id,
            due_date: this.state.due_date,
            customer_id: this.state.customer_id,
            data: JSON.stringify(this.state.data),
            total: this.total,
            payment_type: 1
        }

        if(!this.state.invoice_id) {

            return this.createInvoice('/api/invoice', data)
        }

        axios.put(`/api/invoice/${this.state.invoice_id}`, data)
            .then((response) => {
                const firstInvoice = response.data
                const allInvoices = this.props.invoices
                allInvoices.push(firstInvoice)
                this.props.action(allInvoices)
            })
            .catch((error) => {
                console.warn(error)
            })

    }

    createInvoice (url, data) {
        axios.post(url, data)
            .then((response) => {
                const firstInvoice = response.data
                const allInvoices = this.props.invoices
                allInvoices.push(firstInvoice)
                this.props.action(allInvoices)
            })
            .catch((error) => {
                console.warn(error)
            })
    }

    buildCustomerOptions () {
        let customerContent
        if (!this.state.customers.length) {
            customerContent = <option value="">Loading...</option>
            return customerContent
        }

        customerContent = this.state.customers.map((customer, index) => (
            <option key={index} value={customer.id}>{customer.name}</option>
        ))

        return (
            <FormGroup>
                <Label for="customer">Customer(*):</Label>
                <Input className={this.hasErrorFor('customer') ? 'is-invalid' : ''} type="select"
                    name="customer_id"
                    onChange={this.handleInput.bind(this)}
                    value={this.state.customer_id}
                >
                    <option>Choose A customer</option>
                    {customerContent}
                </Input>
                {this.renderErrorFor('customer')}
            </FormGroup>
        )
    }

    buildForm () {
        const changeStatusButton = this.state.invoice_status === 1
            ? <Button color="primary" onClick={() => this.changeStatus(2).bind(this)}>Send</Button>
            : <Button color="primary" onClick={() => this.changeStatus(3).bind(this)}>Paid</Button>

        const customerContent = this.buildCustomerOptions()

        return (
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

                {customerContent}

                <LineItemEditor
                    total={this.state.total}
                    hasTasks={this.hasTasks}
                    rows={this.state.data}
                    lineItemModel={this.state.existingLines}
                    delete={this.handleDelete}
                    update={this.updateData}
                    onAddFiled={this.handleAddFiled}
                    setTotal={this.setTotal}/>
                <Button color="success" onClick={this.saveData}>Save</Button>
                {changeStatusButton}
                <br/>
                <br/>
            </div>
        )
    }

    render () {
        const buttonText = !this.props.add ? 'Create Invoice' : 'Update'
        const form = this.buildForm()

        if (this.props.modal) {
            return (
                <React.Fragment>
                    <Button color="success" onClick={this.toggle}>{buttonText}</Button>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className} size="lg">
                        <ModalHeader toggle={this.toggle}>
                            Invoice
                        </ModalHeader>

                        <ModalBody>
                            {form}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={this.toggle}>Close</Button>
                        </ModalFooter>
                    </Modal>
                </React.Fragment>
            )
        }

        return (
            <div>
                {form}
            </div>
        )
    }
}

export default EditInvoice
