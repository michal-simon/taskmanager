/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import axios from 'axios'
import EditInvoice from './EditInvoice'
import {Form, FormGroup, Input, Label, Table} from 'reactstrap'
import Loader from '../Loader'
import DataTable from '../common/DataTable'
import AddProduct from "../products/AddProduct";
import CompanyDropdown from "../common/CompanyDropdown";
import CategoryDropdown from "../common/CategoryDropdown";
import CustomerDropdown from "../common/CustomerDropdown";

export default class Invoice extends Component {
    constructor (props) {
        super(props)
        this.state = {
            per_page: 5,
            invoices: [],
            customers: [],
            filters: [],
            columns: ['Customer', 'Due Date', 'Total', 'Status', 'Payment Type']
        }

        this.ignore = []

        this.updateInvoice = this.updateInvoice.bind(this)
        this.userList = this.userList.bind(this)
        this.filterInvoices = this.filterInvoices.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentDidMount() {
        this.getCustomers()
    }

    updateInvoice (invoices) {
        this.setState({ invoices: invoices })
    }

    filterInvoices(event) {

        const column = event.target.id
        const value = event.target.value

        if (value === 'all') {
            const updatedRowState = this.state.filters.filter(filter => filter.column !== column)
            this.setState({filters: updatedRowState})
            return true
        }

        this.setState(prevState => ({
            filters: {
                ...prevState.filters,
                [column]: value,
            },
        }));

        return true
    }

    userList () {
        if (this.state.invoices && this.state.invoices.length) {
            return this.state.invoices.map(user => {
                return (
                    <tr key={user.id}>
                        <td>{user.first_name + ' ' + user.last_name}</td>
                        <td>{user.due_date}</td>
                        <td>{user.total}</td>
                        <td>{user.invoice_status}</td>
                        <td>{user.payment_type}</td>
                        <td><EditInvoice
                            customers={this.state.customers}
                            modal={true}
                            add={true}
                            invoice={user}
                            invoice_id={user.id}
                            action={this.updateInvoice}
                            invoices={this.state.invoices}
                        /></td>
                    </tr>
                )
            })
        } else {
            return <tr>
                <td className="text-center">No Records Found.</td>
            </tr>
        }
    }

    deleteCustomer (id) {
        const self = this
        axios.delete(`/api/customers/${id}`).then(data => {
            const index = self.state.invoices.findIndex(user => user.id === id)
            const users = self.state.invoices.splice(index, 1)
            self.updateInvoice(users)
        })
    }

    renderErrorFor () {

    }

    resetFilters() {
        this.props.reset()
    }

    handleSubmit(event) {
        event.preventDefault()

        axios.post('/api/invoice/filterInvoices',
            this.state.filters)
            .then((response) => {
                this.setState({invoices: response.data})
            })
            .catch((error) => {
                alert(error)
            })
    }

    getFilters() {
        return (
            <Form inline className="pull-right" onSubmit={this.handleSubmit}>

                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <EditInvoice
                        customers={this.state.customers}
                        invoice={{}}
                        add={false}
                        action={this.updateInvoice}
                        invoices={this.state.invoices}
                        modal={true}
                    />
                </FormGroup>

                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Input type="select" id="finance_type" name="finance_type" onChange={this.filterInvoices}>
                        <option value="">Select Finance Type </option>
                        <option value="1">Invoices</option>
                        <option value="2">Quotes</option>
                        <option value="3">Orders</option>
                    </Input>
                </FormGroup>

                <CustomerDropdown
                    renderErrorFor={this.renderErrorFor}
                    handleInputChanges={this.filterInvoices}
                    customers={this.state.customers}
                    name="customer_id"
                />

                <button className="mr-2 ml-2 btn btn-success">Submit</button>
                <button onClick={this.resetFilters} className="btn btn-primary">Reset</button>
            </Form>
        )
    }

    getCustomers () {
        axios.get('/api/customers')
            .then((r) => {
                this.setState({
                    customers: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    render () {
        const fetchUrl = '/api/invoice/'
        const filters = this.state.customers.length ?  this.getFilters() : 'Loading filters'

        return (
            <div className="data-table m-md-3 m-0">

                <div>
                    {filters}
                </div>

                <DataTable
                    columns={this.state.columns}
                    disableSorting={['id']}
                    defaultColumn='total'
                    userList={this.userList}
                    fetchUrl={fetchUrl}
                    updateState={this.updateInvoice}
                />

            </div>
        )
    }
}
