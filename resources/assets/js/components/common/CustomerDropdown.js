import React, {Component} from 'react'
import axios from "axios";
import {Input, FormGroup, Label, Form} from 'reactstrap'


export default class CustomerDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            customers: []
        }

        this.getCustomers = this.getCustomers.bind(this)
    }

    componentDidMount() {
        if (!this.props.customers || !this.props.customers.length) {
            this.getCustomers()
        } else {
            this.setState({customers: this.props.customers})
        }
    }

    getCustomers() {
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

    render() {
        let customerList = null
        if (this.state.customers && !this.state.customers.length) {
            customerList = <option value="">Loading...</option>
        } else {
            customerList = this.state.customers.map((customer, index) => (
                <option key={index} value={customer.id}>{customer.name}</option>
            ))
        }

        return (
            <FormGroup className="ml-2">
                <Input value={this.props.customer} onChange={this.props.handleInputChanges} type="select"
                       name="customer_id" id="customer_id">
                    <option value="">Select Customer</option>
                    {customerList}
                </Input>
                {this.props.renderErrorFor('customer_id')}
            </FormGroup>
        )
    }
}
