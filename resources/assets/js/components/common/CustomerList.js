/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'

class CustomerList extends Component {
    constructor (props, context) {
        super(props, context)
        this.state = {
            customers: [],
            errors: []
        }
    }

    componentDidMount () {
        this.loadCustomers()
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



    render () {

        let customerContent
        if (!this.state.customers.length) {
            customerContent = <option value="">Loading...</option>
        } else {
            customerContent = this.state.customers.map((customer, index) => (
                <option key={index} value={customer.id}>{customer.name}</option>
            ))
        }

        return customerContent
    }
}

export default CustomerList
