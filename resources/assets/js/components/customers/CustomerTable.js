/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import AddCustomer from './AddCustomer'
import EditCustomer from './EditCustomer'
import { Button } from 'reactstrap'
import DataTable from '../common/DataTable'
import Avatar from '../common/Avatar'

export default class Customers extends Component {
    constructor (props) {
        super(props)
        this.state = {
            per_page: 5,
            customers: []
        }

        this.updateCustomers = this.updateCustomers.bind(this)
        this.customerList = this.customerList.bind(this)
    }

    updateCustomers (customers) {
        this.setState({ customers: customers })
    }

    customerList () {
        if (this.state.customers && this.state.customers.length) {
            return this.state.customers.map(customer => {
                console.log('columns', Object.keys(customer))
                const test = Object.keys(customer).map((index, element) => {
                    if (index === 'address') {
                        return (
                            <React.Fragment>
                                {this.displayCustomerAddress(customer[index])}
                            </React.Fragment>
                        )
                    } else if (index === 'id') {
                        return <td><Avatar name={customer.name}/></td>
                    } else {
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
                                id={customer.id}
                                action={this.updateCustomers}
                                customers={this.state.customers}
                                modal={true}
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

    displayCustomerPhone (address) {
        if (!address) {
            return (<span>&nbsp</span>)
        }
        const phone = address.map(function (address) {
            return (<span key={address.id}>{address.phone}</span>)
        })
        return (
            <td>{phone}</td>
        )
    }

    render () {
        const fetchUrl = '/api/customers/'

        return (
            <div className="data-table m-md-3 m-0">

                <AddCustomer
                    customer_type={this.props.customer_type}
                    action={this.updateCustomers}
                    customers={this.state.customers}
                />

                <DataTable
                    userList={this.customerList}
                    fetchUrl={fetchUrl}
                    updateState={this.updateCustomers}
                />
            </div>
        )
    }
}