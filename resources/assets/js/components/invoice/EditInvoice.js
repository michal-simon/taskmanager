import React, { Component } from 'react';
import Address from './Address';
import LineItemEditor from './LineItemEditor';
import axios from 'axios'

class LineItemModel {
    constructor(id, quantity, description, unit_price) {
        this.id = id;
        this.quantity = quantity;
        this.description = description;
        this.unit_price = unit_price
    }

    get subTotal() {
        return this.quantity * this.unit_price;
    }
}

class EditInvoice extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            lines: [],
            existingLines: [],
            customer_id: 1
        }

        this.updateData = this.updateData.bind(this)
        this.saveData = this.saveData.bind(this)
        this.setTotal = this.setTotal.bind(this)
        this.total = 0

    }

    componentDidMount() {

        if(!this.props.invoice_id.length) {

            return false
        }

        axios.get(`/api/invoice/${this.props.invoice_id}`)
            .then((r)=> {
                console.log('invoices', r.data)
                this.setState({existingLines: r.data})
            })
            .catch((e)=>{
              alert(e)
            })
    }


    render() {
        const mockAddress = {
            line1: '16 The Harbor',
            town: 'Newport',
            county: 'Gwent',
            country: 'Wales'
        };

        return (
            <div>
                <h1 className='pt4 pt5-ns pb4 dark-gray'>Edit Invoice</h1>
                <Address address={mockAddress} />
                <LineItemEditor lineItemModel={this.state.existingLines} update={this.updateData} setTotal={this.setTotal} />
                <button onClick={this.saveData}>Save</button>
                <br />
                <br />
            </div>
        );
    }

    updateData(data) {
        this.setState({data: data})
        console.log('data', this.state.data)
    }

    setTotal(total) {
        this.total = total
    }

    saveData() {
        const data = {
            invoice_id: this.props.invoice_id,
            customer_id: this.state.customer_id,
            data: JSON.stringify(this.state.data),
            total: this.total,
            payment_type: 1
        }

        axios.post('/api/invoice', data)
            .then((response) => {
                // this.setState({
                //     editMode: false
                // });
            })
            .catch((error) => {
                alert(error)
            });
    }
}

export default EditInvoice;