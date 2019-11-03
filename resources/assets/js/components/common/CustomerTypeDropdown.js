import React, {Component} from 'react'
import axios from "axios";
import {Input, FormGroup, Label, Form} from 'reactstrap'


export default class CustomerTypeDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            customerTypes: []
        }

        this.getCustomerTypes = this.getCustomerTypes.bind(this)
    }

    componentDidMount() {
        if (!this.props.customerTypes || !this.props.customerTypes.length) {
            this.getCustomerTypes()
        }
    }

    getCustomerTypes() {
        axios.get('/api/customer-types')
            .then((r) => {
                this.setState({
                    customerTypes: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    render() {
        let customerTypeList = null
        if (!this.state.customerTypes.length) {
            customerTypeList = <option value="">Loading...</option>
        } else {
            customerTypeList = this.state.customerTypes.map((customerType, index) => (
                <option key={index} value={customerType.id}>{customerType.name}</option>
            ))
        }

        return (
            <FormGroup>
                <Input value={this.props.customer_type} onChange={this.props.handleInputChanges} type="select"
                       name="customer_type" id="customer_type">
                    <option value="">Select Customer Type</option>
                    {customerTypeList}
                </Input>
                {this.props.renderErrorFor('customer_type')}
            </FormGroup>
        )
    }
}