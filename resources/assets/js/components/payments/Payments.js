import React, { Component } from 'react'
import DataTable from '../common/DataTable'
import Avatar from "../common/Avatar";
import EditCustomer from "../customers/EditCustomer";
import {Button} from "reactstrap";
import axios from "axios";

export default class Payments extends Component {
    constructor (props) {
        super(props)
        this.state = {
            per_page: 5,
            payments: [],
            filters: [],
        }

        this.ignoredColumns = [
            'first_name',
            'last_name',
            'company',
            'customer_type',
            'company_id',
            'customer_type'
        ]

        this.updateCustomers = this.updateCustomers.bind(this)
        this.customerList = this.customerList.bind(this)
    }

    updateCustomers (payments) {
        this.setState({ payments: payments })
    }

    customerList () {
        if (this.state.payments && this.state.payments.length) {
            return this.state.payments.map(payment => {
                const test = Object.keys(payment).map((index, element) => {
                    if(this.ignoredColumns && !this.ignoredColumns.includes(index)) {
                        return (
                            <td>{payment[index]}</td>
                        )
                    }
                })
                return (
                    <tr key={payment.id}>
                        {test}
                    </tr>
                )
            })
        } else {
            return <tr>
                <td className="text-center">No Records Found.</td>
            </tr>
        }
    }

    render () {
        const fetchUrl = '/api/payments/'

        return (
            <div className="data-table m-md-3 m-0">

                <DataTable
                    disableSorting={['id']}
                    defaultColumn='invoice_id'
                    userList={this.customerList}
                    ignore={this.ignoredColumns}
                    fetchUrl={fetchUrl}
                    updateState={this.updateCustomers}
                />
            </div>
        )
    }
}
