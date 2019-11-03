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
            categories: [],
            filters: [],
        }

        this.addProductToState = this.addProductToState.bind(this)
        this.userList = this.userList.bind(this)
        this.filterProducts = this.filterProducts.bind(this)

        this.ignore = [
            'brand_id', 
            'category_ids', 
            'status', 
            'range_from', 
            'range_to', 
            'payable_months',
            'minimum_downpayment',
            'number_of_years',
            'interest_rate',
            'price'
        ]
    }

    componentDidMount () {
        this.getBrands()
        this.getCategories()
    }

    addProductToState (products) {
        this.setState({ products: products })
    }

    filterEvents(e) {

        const column = event.target.id
        const value = event.target.value
        const project_id = this.props.project_id ? this.props.project_id : 0

        if (value === 'all') {
            const updatedRowState = this.state.filters.filter(filter => filter.column !== column)
            this.setState({filters: updatedRowState})
            return true
        }

        this.setState(prevState => ({
            filters: {
                ...prevState.filters,
                [column]: value,
            },
        }));

        return true
    }

    handleSubmit(event) {
        event.preventDefault()

        axios.post('/api/products/filterProducts',
            this.state.filters)
            .then((response) => {
                this.setState({products: response.data})
            })
            .catch((error) => {
                alert(error)
            })
    }

    renderErrorFor () {

    }

    resetFilters() {
        this.props.reset()
    }

    getFilters() {
        return (
            <Form inline className="pull-right" onSubmit={this.handleSubmit}>

                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                </FormGroup>

              <CompanyDropdown
                  renderErrorFor={this.renderErrorFor}
                  handleInputChanges={this.filterProducts}
                  companies={this.state.brands}
              />
              <CategoryDropdown
                  renderErrorFor={this.renderErrorFor}
                  handleInputChanges={this.filterEvents}
                  categories={this.state.categories}
              />

                <button className="mr-2 ml-2 btn btn-success">Submit</button>
                <button onClick={this.resetFilters} className="btn btn-primary">Reset</button>
            </Form>
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
        const filters = this.getFilters()
        
        return (
            <div className="data-table m-md-3 m-0">

                <AddProduct
                    brands={this.state.brands}
                    categories={this.state.categories}
                    products={this.state.products}
                    action={this.addProductToState}
                />
                <div>
                {filters}
                </div>

                <DataTable
                    ignore={this.ignore}
                    disableSorting={['id']}
                    defaultColumn='name'
                    userList={this.userList}
                    fetchUrl={fetchUrl}
                    updateState={this.addProductToState}
                />

            </div>
        )
    }
}
