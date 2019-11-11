import React, {Component} from 'react'
import Address from './Address'
import LineItemEditor from './LineItemEditor'
import axios from 'axios'
import {Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap'
import CustomerDropdown from "../common/CustomerDropdown";
import 'react-dates/lib/css/_datepicker.css';
import { SingleDatePicker } from 'react-dates';
import moment from "moment";
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class EditInvoice extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            due_date: this.props.invoice && this.props.invoice.due_date && this.props.invoice.due_date.length ? moment(this.props.invoice.due_date).format('DD-MM-YYYY') :  moment(new Date()).format('DD-MM-YYYY'),
            quantity: '',
            finance_type: this.props.finance_type ? this.props.finance_type : 1,
            invoice_id: this.props.invoice_id,
            lines: [],
            address: {},
            customerName: '',
            customer_id: this.props.invoice && this.props.invoice.customer_id ? this.props.invoice.customer_id : 0,
            invoice_status: this.props.invoice && this.props.invoice.invoice_status ? this.props.invoice.invoice_status : 1,
            customers: this.props.customers,
            tasks: [],
            errors: [],
            total: this.props.invoice && this.props.invoice.total ? this.props.invoice.total : 0,
            discount_total: this.props.invoice && this.props.invoice.discount_total ? this.props.invoice.discount_total : 0,
            tax_total: this.props.invoice && this.props.invoice.tax_total ? this.props.invoice.tax_total : 0,
            sub_total: this.props.invoice && this.props.invoice.sub_total ? this.props.invoice.sub_total : 0,
            data: [],
            success: false
        }

        this.updateData = this.updateData.bind(this)
        this.saveData = this.saveData.bind(this)
        this.setTotal = this.setTotal.bind(this)
        this.toggle = this.toggle.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.changeStatus = this.changeStatus.bind(this)
        this.handleTaskChange = this.handleTaskChange.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.buildForm = this.buildForm.bind(this)
        this.createInvoice = this.createInvoice.bind(this)
        this.handleInput = this.handleInput.bind(this)
        this.handleAddFiled = this.handleAddFiled.bind(this)
        this.handleFieldChange = this.handleFieldChange.bind(this)
        this.updatePriceData = this.updatePriceData.bind(this)
        this.calculateTotals = this.calculateTotals.bind(this)
        this.handleConvert = this.handleConvert.bind(this)
        this.handleApprove = this.handleApprove.bind(this)

        this.total = 0
    }

    componentDidMount() {
        if (this.props.task_id || this.props.invoice_id) {
            this.loadInvoice()
        }
    }

    renderErrorFor(field) {
        if (this.hasErrorFor(field)) {
            return (
                <span className='invalid-feedback'>
                    <strong>{this.state.errors[field][0]}</strong>
                </span>
            )
        }
    }

    handleInput(e) {
        if (e.target.name === 'customer_id') {
            const index = this.state.customers.findIndex(customer => customer.id === parseInt(e.target.value))
            const customer = this.state.customers[index]
            this.setState({customerName: customer.name})

            if (customer.address) {
                const address = customer.address
                const objAddress = {
                    line1: address.address_1,
                    town: address.address_2,
                    county: address.city,
                    country: 'United Kingdom'
                }
                this.setState({address: objAddress})
            }
        }

        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleTaskChange(e) {
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
                            unit_discount: product.unit_discount,
                            unit_tax: product.unit_tax
                        }

                        total += parseFloat(product.price)
                        arrLines.push(objLine)
                    })
                }

                this.setState({data: arrLines, total: total})
            })
            .catch((e) => {
                console.warn(e)
            })
    }

    hasErrorFor(field) {
        return !!this.state.errors[field]
    }

    loadInvoice() {
        const url = this.props.task_id ? `/api/invoice/task/${this.props.task_id}/${this.state.finance_type}` : `/api/invoice/${this.state.invoice_id}`

        axios.get(url)
            .then((r) => {
                if (r.data.invoice) {
                    this.setState({
                        data: r.data.lines,
                        due_date: r.data.invoice.due_date,
                        invoice_id: r.data.invoice.id,
                        invoice_status: r.data.invoice.invoice_status
                    })
                }
            })
            .catch((e) => {
                console.warn(e)
            })
    }

    changeStatus(status, doSend = false) {
        if (!this.state.invoice_id) {
            return false
        }

        axios.put(`/api/invoice/${this.state.invoice_id}`, {
            invoice_status: status,
            send_to_customer: doSend,
            create_payment: doSend === false
        })
            .then((response) => {
                this.setState({invoice_status: status})
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

    updateData (rowData) {
        this.setState(prevState => ({
            data: [...prevState.data, rowData]
        }))
    }

    calculateTotals () {
        let total = 0
        let discount_total = 0
        let tax_total = 0
        let sub_total= 0

        this.state.data.map((product) => {
            const quantity = product.quantity === 0 ? 1 : product.quantity

            const line_total = product.unit_price * quantity
            total += line_total
            sub_total += line_total

            if(product.unit_discount > 0) {
                const n = parseFloat(total);
                const percentage = n * product.unit_discount /100
                discount_total += percentage
                total -= percentage
            }

            if(product.unit_tax > 0) {
                const n = parseFloat(total);
                const tax_percentage = n * product.unit_tax /100
                tax_total += tax_percentage
                total += tax_percentage
            }

            console.log('product', product)
        })

        this.setState({
            total: total,
            discount_total: discount_total,
            tax_total: tax_total,
            sub_total: sub_total
        })
    }

    updatePriceData (index) {
        const data = this.state.data.slice()
        const currentRow = data[index]
        const price = currentRow.unit_price

        if (price < 0) {
            return false
        }

        let total = price;
        const unit_discount = currentRow.unit_discount
        const unit_tax = currentRow.unit_tax
        const quantity = currentRow.quantity

        if (quantity > 0) {
            total = price * quantity
        }

        if (unit_discount > 0) {
            const n = parseFloat(total);

            const percentage = n * unit_discount /100
            total -= percentage
        }

        if (unit_tax > 0) {
            const n = parseFloat(total);

            const tax_percentage = n * unit_tax /100
            currentRow.tax_total = tax_percentage
            total += tax_percentage
        }

        currentRow.sub_total = total

        this.setState({data: data})
    }

    handleFieldChange(name, value, row) {
        const $this = this;
        let index = null;
        const newItemArray = this.state.data.map((item, sidx) => {
            if (row !== sidx) return item
            index = sidx
            return {...item, [name]: value}
        })

        if(index !== null) {
            setTimeout(function () {
                $this.calculateTotals()
                $this.updatePriceData(index)
            }, 1000)
        }

        this.setState((prevState, props) => {
            return {
                data: newItemArray
            }
        })
    }

    handleAddFiled() {
        this.setState((prevState, props) => {
            return {
                data: this.state.data.concat({
                    unit_discount: 0,
                    unit_tax: 0,
                    quantity: 0,
                    unit_price: 0,
                    product_id: 0
                })
            }
        })
    }

    handleDelete(idx) {
        const newTasks = this.state.data.filter((task, tIndex) => {
            return idx !== tIndex
        })

        this.setState({data: newTasks})
    }

    setTotal(total) {
        this.total = total
    }

    saveData() {
        const data = {
            invoice_id: this.state.invoice_id,
            task_id: this.props.task_id,
            due_date: this.state.due_date,
            finance_type: this.state.finance_type,
            customer_id: this.state.customer_id,
            data: JSON.stringify(this.state.data),
            total: this.state.total,
            sub_total: this.state.sub_total,
            tax_total: this.state.tax_total,
            discount_total: this.state.discount_total,
            payment_type: 1
        }

        if (!this.state.invoice_id) {
            return this.createInvoice('/api/invoice', data)
        }

        axios.put(`/api/invoice/${this.state.invoice_id}`, data)
            .then((response) => {
                const firstInvoice = response.data
                const allInvoices = this.props.invoices
                allInvoices.push(firstInvoice)
                this.setState({success: true})
                this.props.action(allInvoices)
                toast.success('Invoice updated successfully')
            })
            .catch((error) => {
               toast.error('Unable to update invoice')
                console.warn(error)
            })
    }

    createInvoice(url, data) {
        axios.post(url, data)
            .then((response) => {
                const firstInvoice = response.data
                const allInvoices = this.props.invoices
                allInvoices.push(firstInvoice)
                this.props.action(allInvoices)
                toast.success('invoice updated successfully')
            })
            .catch((error) => {
             toast.error('Unable to update invoice')
                console.warn(error)
            })
    }

    handleConvert () {
        

        axios.get(`/api/quotes/convert/${this.state.invoice_id}`)
            .then((r) => {
                toast.success('Invoice updated successfully')
            })
            .catch((e) => {
               toast.error('Unable to update invoice')
                console.warn(e)
            })
    }

    handleApprove () {
        axios.get(`/api/quotes/approve/${this.state.invoice_id}`)
            .then((r) => {
                toast.success('Invoice updated successfully')
            })
            .catch((e) => {
                toast.error('Unable to update invoice')
                console.warn(e)
            })
    }

    buildForm() {
        const changeStatusButton = this.state.invoice_status === 1
            ? <Button color="primary" onClick={() => this.changeStatus(2, true).bind(this)}>Send</Button>
            : <Button color="primary" onClick={() => this.changeStatus(3, false).bind(this)}>Paid</Button>

        const approveButton = this.state.invoice_status !== 4 ? <Button className="primary" onClick={this.handleApprove}>Approve</Button> : null

        return (
            <div>

                <ToastContainer/>

                <Button className="primary" onClick={this.handleTaskChange}>Get Products</Button>

                {this.state.finance_type === 2
                ? (
                    <React.Fragment>
                        {approveButton}
                        <Button className="primary" onClick={this.handleConvert}>Convert to Invoice</Button>
                    </React.Fragment>

                    )
                : null}



                <h2>{this.state.customerName}</h2>
                <Address address={this.state.address}/>

                <FormGroup>
                    <Label for="due_date">Due Date(*):</Label>
                    <SingleDatePicker
                        displayFormat="DD-MM-YYYY"
                        numberOfMonths={1}
                        date={moment(this.state.due_date)} // momentPropTypes.momentObj or null
                        onDateChange={due_date => this.setState({ due_date })} // PropTypes.func.isRequired
                        focused={this.state.focused} // PropTypes.bool
                        onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                        id="due_date" // PropTypes.string.isRequired,
                    />
                    {this.renderErrorFor('due_date')}
                </FormGroup>

                <CustomerDropdown
                    renderErrorFor={this.renderErrorFor}sub
                    handleInputChanges={this.handleInput}
                    customer={this.state.customer_id}
                    customers={this.state.customers}
                />

                <LineItemEditor
                    finance_type={this.state.finance_type}
                    total={this.state.total}
                    sub_total={this.state.sub_total}
                    tax_total={this.state.tax_total}
                    discount_total={this.state.discount_total}
                    rows={this.state.data}
                    delete={this.handleDelete}
                    update={this.handleFieldChange}
                    onAddFiled={this.handleAddFiled}
                    setTotal={this.setTotal}/>
                <Button color="success" onClick={this.saveData}>Save</Button>
                {changeStatusButton}
                <br/>
                <br/>
            </div>
        )
    }

    render() {
        const buttonText = !this.props.add ? 'Create Invoice' : 'Update'
        const form = this.buildForm()
        const {success} = this.state

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

                {success && <div className="alert alert-success" role="alert">
                    Products added to task successfully
                </div>}

                {form}
            </div>
        )
    }
}

export default EditInvoice
