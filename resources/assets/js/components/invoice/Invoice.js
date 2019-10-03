/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import axios from 'axios'
import EditInvoice from './EditInvoice'
import { Input, Label, Table } from 'reactstrap'
import Loader from '../Loader'
import DataTable from '../common/DataTable'

export default class Invoice extends Component {
    constructor (props) {
        super(props)
        this.state = {
            per_page: 5,
            invoices: [],
            columns: ['Customer', 'Due Date', 'Total', 'Status', 'Payment Type']
        }

        this.updateInvoice = this.updateInvoice.bind(this)
        this.userList = this.userList.bind(this)
    }

    updateInvoice (invoices) {
        this.setState({ invoices: invoices })
    }

    userList () {
        if (this.state.invoices && this.state.invoices.length) {
            return this.state.invoices.map(user => {
                return (
                    <tr key={user.id}>
                        <td>{user.first_name + ' ' + user.last_name}</td>
                        <td>{user.due_date}</td>
                        <td>{user.total}</td>
                        <td>{user.invoice_status}</td>
                        <td>{user.payment_type}</td>
                        <td><EditInvoice
                            modal={true}
                            add={true}
                            invoice_id={user.id}
                            action={this.updateInvoice}
                            invoices={this.state.invoices}
                        /></td>
                    </tr>
                )
            })
        } else {
            return <tr>
                <td className="text-center">No Records Found.</td>
            </tr>
        }
    }

    deleteCustomer (id) {
        const self = this
        axios.delete(`/api/customers/${id}`).then(data => {
            const index = self.state.invoices.findIndex(user => user.id === id)
            const users = self.state.invoices.splice(index, 1)
            self.updateInvoice(users)
        })
    }

    render () {
        const fetchUrl = '/api/invoice/'

        return (
            <div className="data-table m-md-3 m-0">

                <EditInvoice
                    add={false}
                    action={this.updateInvoice}
                    invoices={this.state.invoices}
                    modal={true}
                />

                <DataTable
                    columns={this.state.columns}
                    userList={this.userList}
                    fetchUrl={fetchUrl}
                    updateState={this.updateInvoice}
                />
            </div>
        )
    }
}
