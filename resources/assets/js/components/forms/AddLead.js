/* eslint-disable no-unused-vars */
import React from 'react'
import { Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'

class AddLead extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            rating: '',
            source_type: 0,
            customers: [],
            sourceTypes: [],
            errors: []
        }
        this.hasLeadErrorFor = this.hasLeadErrorFor.bind(this)
        this.renderLeadErrorFor = this.renderLeadErrorFor.bind(this)
        this.updateLeadValue = this.updateLeadValue.bind(this)
        this.buildCustomerList = this.buildCustomerList.bind(this)
    }

    componentDidMount () {
        this.getCustomers()
        this.getSourceTypes()

        this.setState(
            {
                rating: this.props.task.rating,
                valued_at: this.props.task.valued_at,
                source_type: this.props.task.source_type,
                customer_id: this.props.task.customer_id
            }
        )
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

    getSourceTypes () {
        axios.get('/api/tasks/source-types')
            .then((r) => {
                this.setState({
                    sourceTypes: r.data
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

    buildCustomerList() {
        let customerList
        if (!this.state.customers.length) {
            customerList = <option value="">Loading...</option>
        } else {
            customerList = this.state.customers.map((customer, index) => (
                <option key={index} value={customer.id}>{customer.name}</option>
            ))
        }

        const customerId = typeof this.props.task !== 'undefined' ? this.props.task.customer_id : ''
        const disabled = typeof this.props.readOnly !== 'undefined' && this.props.readOnly === true ? 'disabled' : ''

        return (
            <FormGroup>
                <Label for="location">Customer:</Label>
                <Input className={this.hasLeadErrorFor('location') ? 'is-invalid' : ''} type="select"
                       disabled={disabled}
                       name="customer_id"
                       id="customer_id"
                       value={customerId}
                       onChange={this.props.updateValue}>
                    <option>Select Customer</option>
                    {customerList}
                </Input>
                {this.renderLeadErrorFor('customer_id')}
            </FormGroup>
        )
    }

    buildSourceTypeList() {
        let sourceTypeList
        if (!this.state.sourceTypes.length) {
            sourceTypeList = <option value="">Loading...</option>
        } else {
            sourceTypeList = this.state.sourceTypes.map((customer, index) => (
                <option key={index} value={customer.id}>{customer.name}</option>
            ))
        }

        const customerId = typeof this.props.task !== 'undefined' ? this.props.task.source_type : ''
        const disabled = typeof this.props.readOnly !== 'undefined' && this.props.readOnly === true ? 'disabled' : ''

        return (
            <FormGroup>
                <Label for="source_type">Source Type:</Label>
                <Input className={this.hasLeadErrorFor('source_type') ? 'is-invalid' : ''} type="select"
                       disabled={disabled}
                       name="source_type"
                       id="source_type"
                       value={customerId}
                       onChange={this.props.updateValue}>
                    <option>Select Source Type</option>
                    {sourceTypeList}
                </Input>
                {this.renderLeadErrorFor('source_type')}
            </FormGroup>
        )
    }

    render () {

        const customerList = this.buildCustomerList()
        const sourceTypeList = this.buildSourceTypeList()
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
                    <Label for="valued_at">Value:</Label>
                    <Input className={this.hasLeadErrorFor('valued_at') ? 'is-invalid' : ''} type="text"
                           disabled={disabled}
                           name="valued_at"
                           id="valued_at"
                           value={this.state.valued_at}
                           onChange={this.updateLeadValue}/>
                    {this.renderLeadErrorFor('updateValue')}
                </FormGroup>

                {customerList}
                {sourceTypeList}
            </div>
        )
    }
}

export default AddLead
