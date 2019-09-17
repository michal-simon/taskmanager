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
    }

    componentDidMount() {
        this.getCustomers()
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

        return (
            <React.Fragment>
            <FormGroup>
                <Label for="rating">Rating:</Label>
                <Input className={this.hasErrorFor('rating') ? 'is-invalid' : ''} type="text"
                       name="rating"
                       id="rating"
                       onChange={this.props.changeLeadValue.bind(this)}/>
                {this.renderErrorFor('rating')}
            </FormGroup>

            <FormGroup>
                <Label for="location">Customer:</Label>
                <Input className={this.hasErrorFor('location') ? 'is-invalid' : ''} type="select"
                       name="customer_id"
                       id="customer_id"
                       onChange={this.changeLeadValue.bind(this)}>
                   <option>Select Customer</option>
                    {customerList}
                </Input>
                {this.renderErrorFor('customer_id')}
            </FormGroup>
            </React.Fragment>
        )
    }
}

export default AddLead;