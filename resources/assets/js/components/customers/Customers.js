/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import AddCustomer from './AddCustomer'
import EditCustomer from './EditCustomer'
import { Button, Form, FormGroup } from 'reactstrap'
import DataTable from '../common/DataTable'
import Avatar from '../common/Avatar'
import CustomerTypeDropdown from "../common/CustomerTypeDropdown";
import CompanyDropdown from "../common/CompanyDropdown";

export default class Customers extends Component {
    constructor (props) {
        super(props)
        this.state = {
            per_page: 5,
            customers: [],
            companies: [],
            filters: [],
        }

        this.updateCustomers = this.updateCustomers.bind(this)
        this.customerList = this.customerList.bind(this)
        this.getCompanies = this.getCompanies.bind(this)
        this.filterCustomers = this.filterCustomers.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        this.ignoredColumns = [
            'first_name', 
            'last_name',
            'company',
            'customer_type',
            'company_id',
            'customer_type'
        ]
    }

    updateCustomers (customers) {
        this.setState({ customers: customers })
    }

    componentDidMount () {
        this.getCompanies()
    }

    getCompanies () {
        axios.get('/api/brands')
            .then((r) => {
                this.setState({
                    companies: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    handleSubmit(event) {
        event.preventDefault()

        axios.post('/api/customers/filterCustomers',
            this.state.filters)
            .then((response) => {
                this.setState({customers: response.data})
            })
            .catch((error) => {
                alert(error)
            })
    }

    resetFilters() {
        this.props.reset()
    }

    renderErrorFor () {

    }

    filterCustomers(e) {

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

     getFilters() {
        return (
            <Form inline className="pull-right" onSubmit={this.handleSubmit}>

                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <AddCustomer
                        customer_type={this.props.customer_type}
                        action={this.updateCustomers}
                        customers={this.state.customers}
                        companies={this.state.companies}
                    />
                </FormGroup>

              <CompanyDropdown
                  renderErrorFor={this.renderErrorFor}
                  handleInputChanges={this.filterCustomers}
              />
              <CustomerTypeDropdown
                  renderErrorFor={this.renderErrorFor}
                 handleInputChanges={this.filterCustomers}
              />

                <button className="mr-2 ml-2 btn btn-success">Submit</button>
                <button onClick={this.resetFilters} className="btn btn-primary">Reset</button>
            </Form>
        )
    }


    customerList () {
        if (this.state.customers && this.state.customers.length) {
            return this.state.customers.map(customer => {
                const test = Object.keys(customer).map((index, element) => {
                    if (index === 'address') {
                        return (
                            <td>{this.displayCustomerAddress(customer[index])}</td>
                        )
                    } else if (index === 'id') {
                        return <td><Avatar name={customer.name}/></td>
                    } else if(this.ignoredColumns && !this.ignoredColumns.includes(index)) {
                        return (
                            <td>{customer[index]}</td>
                        )
                    }
                })
                return (
                    <tr key={customer.id}>
                        {test}
                        <td>
                            <EditCustomer
                                customer_type={this.props.customer_type}
                                customer={customer}
                                action={this.updateCustomers}
                                customers={this.state.customers}
                                modal={true}
                                companies={this.state.companies}
                            />
                            <Button color="danger" onClick={() => this.deleteCustomer(customer.id)}>Delete</Button>

                        </td>
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
        axios.delete(`/api/customers/${id}`).then(data => {
            const arrCustomers = [...this.state.customers]
            const index = arrCustomers.findIndex(customer => customer.id === id)
            arrCustomers.splice(index, 1)
            this.updateCustomers(arrCustomers)
        })
    }

    displayCustomerAddress (address) {
        if (!address) {
            return ''
        }

        if (address.address_2) {
            return `${address.address_1}, ${address.address_2}, ${address.zip}, ${address.city}`
        }

        return `${address.address_1}, ${address.zip}, ${address.city}`
    }
    
    render () {
        const fetchUrl = '/api/customers/'
        const filters = this.getFilters()

        return (
            <div className="data-table m-md-3 m-0">

                {filters}

                <DataTable
                    disableSorting={['id']}
                    defaultColumn='name'
                    userList={this.customerList}
                    ignore={this.ignoredColumns}
                    fetchUrl={fetchUrl}
                    updateState={this.updateCustomers}
                />
            </div>
        )
    }
}
