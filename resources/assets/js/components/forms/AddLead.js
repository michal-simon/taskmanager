import React from 'react';
import {Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label} from 'reactstrap';
import moment from 'moment'
import axios from 'axios'

class AddLead extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            errors: []
        };

        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
    }

    componentDidMount() {
        this.getCustomers()
    }

    hasErrorFor(field) {
        return !!this.state.errors[field]
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

    getCustomers() {
        axios.get('/api/customers')
            .then((r) => {
                this.setState({
                    customers: r.data,
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    render() {

        let customerList;

        if (!this.state.customers.length) {
            customerList = <option value="">Loading...</option>
        } else {
            customerList = this.state.customers.map((customer, index) => (
                <option key={index} value={customer.id}>{customer.first_name + " " + customer.last_name}</option>
            ))
        }

        const customer_id = typeof this.props.task !== 'undefined' ? this.props.task.customer_id : ''
        const rating = typeof this.props.task !== 'undefined' ? this.props.task.rating : ''
        const disabled = typeof this.props.readOnly !== 'undefined' &&  this.props.readOnly === true ? 'disabled' : ''

        return (
            <div>
            <FormGroup>
                <Label for="rating">Rating:</Label>
                <Input className={this.hasErrorFor('rating') ? 'is-invalid' : ''} type="text"
                       disabled={disabled}
                       name="rating"
                       id="rating"
                       value={rating}
                       onChange={this.props.updateValue}/>
                {this.renderErrorFor('rating')}
            </FormGroup>

            <FormGroup>
                <Label for="location">Customer:</Label>
                <Input className={this.hasErrorFor('location') ? 'is-invalid' : ''} type="select"
                       disabled={disabled}
                       name="customer_id"
                       id="customer_id"
                       defaultValue={customer_id}
                       onChange={this.props.updateValue}>
                   <option>Select Customer</option>
                    {customerList}
                </Input>
                {this.renderErrorFor('customer_id')}
            </FormGroup>
            </div>
        )
    }
}

export default AddLead;