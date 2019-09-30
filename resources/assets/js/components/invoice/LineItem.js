/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import { Button, Input } from 'reactstrap'

class LineItem extends Component {
    constructor (props) {
        super(props)

        this.state = Object.assign({}, props.lineItemData)
        this.state.products = []
        this.handleQuantityChange = this.handleQuantityChange.bind(this)
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this)
        this.handlePriceChange = this.handlePriceChange.bind(this)
        this.handleProductChange = this.handleProductChange.bind(this)
        this.handleDeleteClick = this.handleDeleteClick.bind(this)
        this.pushToCaller = this.pushToCaller.bind(this)
        this.loadProducts = this.loadProducts.bind(this)
        this.buildProductOptions = this.buildProductOptions.bind(this)
        this.setIndex = this.setIndex.bind(this)
        this.index = 0
    }

    componentDidMount () {
        this.loadProducts()
    }

    loadProducts () {
        axios.get('/api/products').then(data => {
            this.setState({ products: data.data })
        })
    }

    setIndex (e) {
        const parent = e.target.parentNode.parentNode
        this.index = [...parent.parentNode.children].indexOf(parent)
    }

    handleQuantityChange (e) {
        if (this.isExistingLine(e)) {
            this.setState({ quantity: e.target.value })
            return false
        }

        this.setIndex(e)
        this.setState({ quantity: e.target.value }, this.pushToCaller)
    }

    handleDescriptionChange (e) {
        if (this.isExistingLine(e)) {
            this.setState({ description: e.target.value })
            return false
        }

        this.setIndex(e)
        this.setState({ description: e.target.value }, this.pushToCaller)
    }

    isExistingLine (e) {
        const lineId = e.target.parentNode.parentNode.getAttribute('data-id')

        if (!lineId) {
            return false
        }

        return false
    }

    handlePriceChange (e) {
        if (this.isExistingLine(e)) {
            this.setState({ unit_price: e.target.value })
            return false
        }

        this.setIndex(e)
        this.setState({ unit_price: e.target.value }, this.pushToCaller)
    }

    pushToCaller () {
        this.props.onChange(this.index, {
            quantity: parseInt(this.state.quantity, 10),
            description: this.state.description,
            unit_price: parseFloat(this.state.unit_price),
            product_id: parseInt(this.state.product_id)
        })
    }

    handleDeleteClick () {
        this.props.onDelete(this.props.id)
    }

    handleProductChange (e) {
        const price = e.target[e.target.selectedIndex].getAttribute('data-price')
        const productId = e.target.value
        const priceField = e.target.parentNode.nextSibling.firstElementChild
        priceField.value = price
        const lineId = priceField.parentNode.parentNode.getAttribute('data-id')

        if (lineId) {
            this.setState({ unit_price: price, product_id: productId })
            return false
        } else {
            this.setIndex(e)
            this.setState({ unit_price: price, product_id: productId }, this.pushToCaller)
        }
    }

    buildProductOptions () {
        let productList = null
        if (!this.state.products.length) {
            productList = <option value="">Loading...</option>
        } else {
            productList = this.state.products.map((product, index) => {
                return <option key={index} data-price={product.price}
                    value={product.id}>{product.name}</option>
            })
        }
        return (
            <Input value={this.state.product_id} name="product" type='select'
                onChange={this.handleProductChange}>
                <option value="">Select Product</option>
                {productList}
            </Input>
        )
    }

    render () {
        const lineId = this.props.lineItemData && this.props.lineItemData.lineId ? this.props.lineItemData.lineId : ''

        const button = <Button color="danger" onClick={(event) => {
                this.props.onDelete(lineId, event)
            }}>Delete</Button>

        const lineForm = (
            <tr data-id={lineId} key={lineId}>
                <td>
                    <Input name="quantity" data-line={lineId} type='text' value={this.state.quantity}
                        onChange={this.handleQuantityChange} className='pa2 mr2 f6 form-control'/>
                </td>
                <td>
                    <Input name="description" data-line={lineId} type='text' value={this.state.description}
                        onChange={this.handleDescriptionChange} className='pa2 mr2 f6 form-control'/>
                </td>

                <td>
                    {this.buildProductOptions()}
                </td>
                <td>
                    <Input name="unit_price" data-line={lineId} type='text' data-column="5"
                        value={this.state.unit_price} onChange={this.handlePriceChange}
                        className='pa2 mr2 f6 form-control'/>
                </td>
                <td>
                    <p className='pa2 mr2 f6'>{this.state.quantity * this.state.unit_price}</p>
                </td>
                <td>
                    {button}
                </td>
            </tr>
        )
        return lineForm
    }
}

export default LineItem
