/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import EditBrand from './EditBrand'
import AddBrand from './AddBrand'
import { Button } from 'reactstrap'
import DataTable from '../common/DataTable'

export default class Brands extends Component {
    constructor (props) {
        super(props)

        this.state = {
            brands: [],
            errors: [],
            error: ''
        }

        this.addUserToState = this.addUserToState.bind(this)
        this.userList = this.userList.bind(this)
        this.ignoredColumns = ['address_1', 'address_2', 'postcode', 'town', 'city', 'token']
    }

    componentDidMount () {
        this.getUsers()
    }

    addUserToState (brands) {
        this.setState({ brands: brands })
    }

    userList () {
        if (this.state.brands && this.state.brands.length) {
            return this.state.brands.map(brand => {
                const columnList = Object.keys(brand).map(key => {

                    if (this.ignoredColumns && !this.ignoredColumns.includes(key)) {
                        return <td key={key}>{brand[key]}</td>
                    }
                })
                return <tr key={brand.id}>

                    {columnList}

                    <td>
                        <Button color="danger" onClick={() => this.deleteBrand(brand.id)}>Delete</Button>
                        <EditBrand
                            users={this.state.users}
                            brand={brand}
                            brands={this.state.brands}
                            action={this.addUserToState}
                        />
                    </td>
                </tr>
            })
        } else {
            return <tr>
                <td className="text-center">No Records Found.</td>
            </tr>
        }
    }

    deleteBrand (id) {
        const self = this
        axios.delete(`/api/brands/${id}`)
            .then(function (response) {
                const arrBrands = [...self.state.brands]
                const index = arrBrands.findIndex(brand => brand.id === id)
                arrBrands.splice(index, 1)
                self.addUserToState(arrBrands)
            })
            .catch(function (error) {
                self.setState(
                    {
                        error: error.response.data
                    }
                )
            })
    }

    getUsers () {
        axios.get('api/users')
            .then((r) => {
                this.setState({
                    users: r.data
                })
            })
            .catch((e) => {
                this.setState({
                    loading: false,
                    err: e
                })
            })
    }

    render () {
        const fetchUrl = '/api/brands/'
        const {error} = this.state

        return (
            <div className="data-table m-md-3 m-0">
            
             {error && <div className="alert alert-danger" role="alert">
                    {error}
                </div>}

                <AddBrand users={this.state.users} brands={this.state.brands} action={this.addUserToState}/>

                <DataTable
                    disableSorting={['id']}
                    defaultColumn='name'
                    ignore={this.ignoredColumns}
                    userList={this.userList}
                    fetchUrl={fetchUrl}
                    updateState={this.addUserToState}
                />
            </div>
        )
    }
}
