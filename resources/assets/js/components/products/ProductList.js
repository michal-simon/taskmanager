/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import EditProduct from './EditProduct'
import AddProduct from './AddProduct'
import DataTable from '../common/DataTable'
import { Button } from 'reactstrap'

export default class ProductList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            per_page: 5,
            products: []
        }

        this.addProductToState = this.addProductToState.bind(this)
        this.userList = this.userList.bind(this)
    }

    addProductToState (products) {
        this.setState({ products: products })
    }

    userList () {

        if(!this.state.products.length) {
            return false
        }

        if (this.state.products && this.state.products.length) {
            return this.state.products.map(product => {
                const columns = Object.keys(this.state.products[0])
                const columnList = columns.map(key => {
                    return <td key={key}>{product[key]}</td>
                })
                return <tr key={product.id}>

                    {columnList}

                    <td>
                        <Button color="danger" onClick={() => this.deleteProduct(product.id)}>Delete</Button>
                        <EditProduct product={product} products={this.state.products} action={this.addProductToState}/>
                    </td>
                </tr>
            })
        } else {
            return <tr>
                <td colSpan={columns.length} className="text-center">No Records Found.</td>
            </tr>
        }
    }

    deleteProduct (id) {
        const self = this
        axios.delete('/api/products/' + id)
            .then(function (response) {
                const arrProducts = [...self.state.products]
                const index = arrProducts.findIndex(product => product.id === id)
                arrProducts.splice(index, 1)
                self.addProductToState(arrProducts)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    render () {

        const fetchUrl = '/api/products/'

        return (
            <div className="data-table m-md-3 m-0">

                <AddProduct products={this.state.products} action={this.addProductToState}/>

                <DataTable
                    userList={this.userList}
                    fetchUrl={fetchUrl}
                    updateState={this.addProductToState}
                />

            </div>
        )
    }
}
