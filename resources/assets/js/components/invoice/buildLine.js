import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class buildLine extends Component {

    render() {
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
                    <button onClick={this.handleDeleteClick} className='f6 link dim ph3 pv1 mb2 dib white bg-dark-red bn'>Delete</button>
                </td>
            </tr>
        );
    }
}