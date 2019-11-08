/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import { Button, Input } from 'reactstrap'

class LineItem extends Component {
    constructor (props) {
        super(props)
        this.state = Object.assign({}, props.lineItemData)
        this.state.products = []
        this.handleDeleteClick = this.handleDeleteClick.bind(this)
        this.loadProducts = this.loadProducts.bind(this)
        this.buildProductOptions = this.buildProductOptions.bind(this)
    }

    componentDidMount () {
        this.loadProducts()
    }

    loadProducts () {
        axios.get('/api/products').then(data => {
            this.setState({ products: data.data })
        })
    }

    handleDeleteClick () {
        this.props.onDelete(this.props.id)
    }

    buildProductOptions (product_id) {
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
            <Input value={product_id} name="product_id" type='select'
                onChange={this.props.onChange}>
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
                    {this.buildProductOptions(this.props.lineItemData.product_id)}
                </td>

                <td>
                    <Input name="unit_price" data-line={lineId} type='text' data-column="5"
                           value={this.props.lineItemData.unit_price} onChange={this.props.onChange}
                           className='pa2 mr2 f6 form-control'/>
                </td>

                <td>
                    <Input name="quantity" data-line={lineId} type='text' value={this.props.lineItemData.quantity}
                        onChange={this.props.onChange} className='pa2 mr2 f6 form-control'/>
                </td>

                <td>
                    <Input name="unit_discount" data-line={lineId} type='text' value={this.props.lineItemData.unit_discount}
                           onChange={this.props.onChange} className='pa2 mr2 f6 form-control'/>
                </td>

                <td>
                    <Input name="unit_tax" data-line={lineId} type='select' value={this.props.lineItemData.unit_tax}
                        onChange={this.props.onChange} className='pa2 mr2 f6 form-control'>
                        <option value="">Select Tax</option>
                        <option value="17.5">17.5%</option>
                    </Input>
                </td>

                <td>
                    <Input name="tax_total" data-line={lineId} type='text' value={this.props.lineItemData.tax_total}
                           onChange={this.props.onChange} className='pa2 mr2 f6 form-control'/>
                </td>

                <td>
                    <p className='pa2 mr2 f6'>{this.props.lineItemData.sub_total}</p>
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
