import React, { Component } from 'react'
import axios from 'axios'
import { Button, Input } from 'reactstrap'
import Select from 'react-select';
import ProductDropdown from "../common/ProductDropdown";

class LineItem extends Component {
    constructor (props) {
        super(props)
        this.state = Object.assign({}, props.lineItemData)
        this.handleDeleteClick = this.handleDeleteClick.bind(this)
    }

    handleDeleteClick () {
        this.props.onDelete(this.props.id)
    }

    renderErrorFor () {

    }

    render () {
        const lineId = this.props.lineItemData && this.props.lineItemData.lineId ? this.props.lineItemData.lineId : ''

        const button = <Button color="danger" onClick={(event) => {
            this.props.onDelete(lineId, event)
        }}>Delete</Button>

        const lineForm = (
            <tr data-id={lineId} key={lineId}>
                <td>
                    <ProductDropdown
                        renderErrorFor={this.renderErrorFor}
                        name="product_id"
                        handleInputChanges={this.props.onChange}
                        products={this.props.products}
                    />
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
