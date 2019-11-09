import React, {Component} from 'react'
import axios from "axios";
import {Input, FormGroup, Label, Form} from 'reactstrap'

export default class ProductDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            products: []
        }

        this.getProducts = this.getProducts.bind(this)
    }

    componentDidMount() {
        if (!this.props.products || !this.props.products.length) {
            this.getProducts()
        } else {
            this.setState({products: this.props.products})
        }
    }

    getProducts() {
        axios.get('/api/products')
            .then((r) => {
                this.setState({
                    products: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    buuildMultiple(name, productList) {
        return (
            <Input value={this.props.product} onChange={this.props.handleInputChanges} type="select" multiple
                   name={name} id={name}>
                {productList}
            </Input>
        )

    }

    buildSingle(name, productList) {
        return (
            <Input value={this.props.product} onChange={this.props.handleInputChanges} type="select"
                   name={name} id={name}>
                <option value="">Select Product</option>
                {productList}
            </Input>
        )
    }

    render() {
        let productList = null
        if (!this.state.products.length) {
            productList = <option value="">Loading...</option>
        } else {
            productList = this.state.products.map((product, index) => (
                <option key={index} value={product.id}>{product.name}</option>
            ))
        }

        const name = this.props.name && this.props.name ? this.props.name : 'product_id'
        const input = this.props.multiple && this.props.multiple === true ? this.buuildMultiple(name, productList) : this.buildSingle(name, productList)

        return (
            <FormGroup>
                {input}
                {this.props.renderErrorFor('product_id')}
            </FormGroup>
        )
    }
}