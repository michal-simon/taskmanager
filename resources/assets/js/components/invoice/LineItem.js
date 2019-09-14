import React, { Component } from 'react';


class LineItem extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, props.lineItemData);

        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.pushToCaller = this.pushToCaller.bind(this);
    }

    render() {
        const { quantity, description, unit_price } = this.props.lineItemData;

        const button = this.props.canUpdate ? <button onClick={this.handleDeleteClick} className='f6 link dim ph3 pv1 mb2 dib white bg-dark-red bn'>Delete</button> : ''

        return (
            <tr>
                <td>
                    <input type='text' value={quantity} onChange={this.handleQuantityChange} className='pa2 mr2 f6 form-control'></input>
                </td>
                <td>
                    <input type='text' value={description} onChange={this.handleDescriptionChange} className='pa2 mr2 f6 form-control'></input>
                </td>
                <td>
                    <input type='text' data-column="5" value={unit_price} onChange={this.handlePriceChange} className='pa2 mr2 f6 form-control'></input>
                </td>
                <td>
                    <p className='pa2 mr2 f6'>{quantity * unit_price}</p>
                </td>
                <td>
                    {button}
                </td>
            </tr>
        );
    }

    handleQuantityChange(e) {

        if(!e.target.value || isNaN(e.target.value)) {
            return false
        }

        this.setState({ quantity: e.target.value }, this.pushToCaller);
    }

    handleDescriptionChange(e) {
        this.setState({ description: e.target.value }, this.pushToCaller);
    }

    handlePriceChange(e) {

        if(!e.target.value || isNaN(e.target.value)) {
            return false
        }

        this.setState({ unit_price: e.target.value }, this.pushToCaller);
    }

    pushToCaller() {
        this.props.onChange(this.props.id, {
            quantity: parseInt(this.state.quantity, 10),
            description: this.state.description,
            unit_price: parseFloat(this.state.unit_price),
        });
    }

    handleDeleteClick() {
        this.props.onDelete(this.props.id);
    }

}

export default LineItem;