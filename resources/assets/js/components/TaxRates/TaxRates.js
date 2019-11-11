/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import EditTaxRate from './EditTaxRate'
import AddTaxRate from './AddTaxRate'
import { Button } from 'reactstrap'
import DataTable from '../common/DataTable'

export default class TaxRates extends Component {
    constructor (props) {
        super(props)

        this.state = {
            taxRates: [],
            errors: [],
            error: ''
        }

        this.addUserToState = this.addUserToState.bind(this)
        this.userList = this.userList.bind(this)
    }

    addUserToState (taxRates) {
        this.setState({ taxRates: taxRates })
    }

    userList () {
        if (this.state.taxRates && this.state.taxRates.length) {
            return this.state.taxRates.map(taxRate => {
                const columnList = Object.keys(taxRate).map(key => {
                    return <td key={key}>{taxRate[key]}</td>
                })
                return <tr key={taxRate.id}>

                    {columnList}

                    <td>
                        <Button color="danger" onClick={() => this.deleteTaxRates(taxRate.id)}>Delete</Button>
                        <EditTaxRate taxRate={taxRate} taxRates={this.state.taxRates} action={this.addUserToState}/>
                    </td>
                </tr>
            })
        } else {
            return <tr>
                <td className="text-center">No Records Found.</td>
            </tr>
        }
    }

    deleteTaxRate (id) {
        const self = this
        axios.delete('/api/taxRates/' + id)
            .then(function (response) {
                const arrTaxRates = [...self.state.taxRates]
                const index = arrTaxRates.findIndex(taxRate => taxRate.id === id)
                arrTaxRates.splice(index, 1)
                self.addUserToState(arrTaxRates)
            })
           .catch(function (error) {
                self.setState(
                    {
                        error: error.response.data
                    }
                )
            })
    }

    render () {
        const fetchUrl = '/api/taxRates/'
        const {error} = this.state

        return (
            <div className="data-table m-md-3 m-0">
            
                 {error && <div className="alert alert-danger" role="alert">
                    {error}
                </div>}

                <AddTaxRate taxRates={this.state.taxRates} action={this.addUserToState}/>

                <DataTable
                    disableSorting={['id']}
                    defaultColumn='name'
                    userList={this.userList}
                    fetchUrl={fetchUrl}
                    updateState={this.addUserToState}
                />
            </div>
        )
    }
}
