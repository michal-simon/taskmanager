import React, { Component } from 'react';
import Header from './Header';
import EditInvoice from './EditInvoice';
import axios from 'axios'

class Invoice extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            customer: []
        }
    }

    componentDidMount() {

        axios.get(`/api/customers/${this.props.customer_id}`)
            .then((r) => {
                this.setState({
                    customer: r.data,
                })
            })
            .then((r) => {
                console.log(this.state.users)
            })
            .catch((e) => {
                console.error(e)
                this.setState({
                    err: e
                })
            })
    }

    render() {
        return (
            <div className="App">
                <Header />
                <div className="ph5">
                    <EditInvoice customer_id={this.props.customer_id} />
                </div>
            </div>
        );
    }
}

export default Invoice;