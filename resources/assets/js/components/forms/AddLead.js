/* eslint-disable no-unused-vars */
import React from 'react'
import { Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'

class AddLead extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            rating: '',
            customers: [],
            errors: []
        }
        this.hasLeadErrorFor = this.hasLeadErrorFor.bind(this)
        this.renderLeadErrorFor = this.renderLeadErrorFor.bind(this)
        this.updateLeadValue = this.updateLeadValue.bind(this)
    }

    componentDidMount () {
        this.getCustomers()
    }

    hasLeadErrorFor (field) {
        return !!this.state.errors[field]
    }

    renderLeadErrorFor (field) {
        if (this.hasLeadErrorFor(field)) {
            return (
                <span className='invalid-feedback'>
                    <strong>{this.state.errors[field][0]}</strong>
                </span>
            )
        }
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

    updateLeadValue (e) {
        this.setState({
            [e.target.name]: e.target.value
        })
        this.props.updateValue(e)
    }

    render () {
        let customerList
        if (!this.state.customers.length) {
            customerList = <option value="">Loading...</option>
        } else {
            customerList = this.state.customers.map((customer, index) => (
                <option key={index} value={customer.id}>{customer.first_name + ' ' + customer.last_name}</option>
            ))
        }
        const customerId = typeof this.props.task !== 'undefined' ? this.props.task.customer_id : ''
        const disabled = typeof this.props.readOnly !== 'undefined' && this.props.readOnly === true ? 'disabled' : ''
        return (
            <div>
                <FormGroup>
                    <Label for="rating">Rating:</Label>
                    <Input className={this.hasLeadErrorFor('rating') ? 'is-invalid' : ''} type="text"
                        disabled={disabled}
                        name="rating"
                        id="rating"
                        value={this.state.rating}
                        onChange={this.updateLeadValue}/>
                    {this.renderLeadErrorFor('rating')}
                </FormGroup>

                <FormGroup>
                    <Label for="location">Customer:</Label>
                    <Input className={this.hasLeadErrorFor('location') ? 'is-invalid' : ''} type="select"
                        disabled={disabled}
                        name="customer_id"
                        id="customer_id"
                        defaultValue={customerId}
                        onChange={this.props.updateValue}>
                        <option>Select Customer</option>
                        {customerList}
                    </Input>
                    {this.renderLeadErrorFor('customer_id')}
                </FormGroup>
            </div>
        )
    }
}

export default AddLead
