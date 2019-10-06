/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import EditProduct from './EditProduct'
import AddProduct from './AddProduct'
import DataTable from '../common/DataTable'
import { Button } from 'reactstrap'
import { Input, FormGroup } from 'reactstrap'

export default class ProductList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            per_page: 5,
            products: [],
            brands: [],
            categories: []
        }

        this.addProductToState = this.addProductToState.bind(this)
        this.userList = this.userList.bind(this)
        this.ignore = [
            'brand_id', 
            'category_ids', 
            'status', 
            'range_from', 
            'range_to', 
            'monthly_price', 
            'full_price', 
            'interest_rate'
        ]
    }

    componentDidMount () {
        this.getBrands()
        this.getCategories()
    }

    addProductToState (products) {
        this.setState({ products: products })
    }

    filter (e) {
        if (!e.target.value) {
            return
        }

        axios.get(`/api/products/filter/${e.target.name}/${e.target.value}`)
            .then((r) => {
                this.setState({
                    products: r.data
                })
            })
            .catch((e) => {
                alert(e)
            })
    }

    buildBrandOptions () {
        let brandList
        if (!this.state.brands.length) {
            brandList = <option value="">Loading...</option>
        } else {
            brandList = this.state.brands.map((brand, index) => (
                <option key={index} value={brand.id}>{brand.name}</option>
            ))
        }

        return (
            <div className="col-4">
                <FormGroup>
                    <Input onChange={this.filter.bind(this)} type="select" name="brand" id="brand">
                        <option value="">Select Brand</option>
                        {brandList}
                    </Input>
                </FormGroup>
            </div>
        )
    }

    buildCategoryOptions () {
        let categoryList
        if (!this.state.categories.length) {
            categoryList = <option value="">Loading...</option>
        } else {
            categoryList = this.state.categories.map((category, index) => (
                <option key={index} value={category.id}>{category.name}</option>
            ))
        }

        return (
            <div className="col-4">
                <FormGroup>
                    <Input onChange={this.filter.bind(this)} type="select" name="category" id="category">
                        <option value="">Select Category</option>
                        {categoryList}
                    </Input>
                </FormGroup>
            </div>
        )
    }

    getBrands () {
        axios.get('/api/brands')
            .then((r) => {
                this.setState({
                    brands: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    getCategories () {
        axios.get('/api/categories')
            .then((r) => {
                this.setState({
                    categories: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    userList () {
        if (!this.state.products.length) {
            return false
        }

        if (this.state.products && this.state.products.length) {
            return this.state.products.map(product => {
                const columns = Object.keys(this.state.products[0])

                const columnList = columns.map(key => {
                    if (this.ignore && !this.ignore.includes(key)) {
                        return <td key={key}>{product[key]}</td>
                    }
                })

                return <tr key={product.id}>

                    {columnList}

                    <td>
                        <Button color="danger" onClick={() => this.deleteProduct(product.id)}>Delete</Button>
                        <EditProduct
                            brands={this.state.brands}
                            categories={this.state.categories}
                            product={product}
                            products={this.state.products}
                            action={this.addProductToState}
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
        const brandOptions = this.buildBrandOptions()
        const categoryOptions = this.buildCategoryOptions()

        return (
            <div className="data-table m-md-3 m-0">

                <AddProduct
                    brands={this.state.brands}
                    categories={this.state.categories}
                    products={this.state.products}
                    action={this.addProductToState}
                />

                {brandOptions}
                {categoryOptions}

                <DataTable
                    ignore={this.ignore}
                    userList={this.userList}
                    fetchUrl={fetchUrl}
                    updateState={this.addProductToState}
                />

            </div>
        )
    }
}
