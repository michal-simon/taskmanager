import React, { Component } from 'react';
import axios from "axios";


class LineItem extends Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({}, props.lineItemData);

        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.pushToCaller = this.pushToCaller.bind(this);
        this.deleteFromDatabase = this.deleteFromDatabase.bind(this);
        this.changeStatus = this.changeStatus.bind(this);

        this.checkedItems = new Map()
        this.toggleCheckbox = this.toggleCheckbox.bind(this);

    }

    handleCheckboxChange(e) {
        const item = e.target.name;
        const isChecked = e.target.checked;
        this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
    }

    toggleCheckbox(e) {
        const item = e.target.name;
        const isChecked = e.target.checked;
        this.checkedItems[item] = isChecked
    }

    changeStatus(status) {
        alert('change status  ' + status)
        console.log('send checkboxes', this.checkedItems)
    }

    render() {
        const { quantity, description, unit_price, line_id } = this.props.lineItemData;

        const Checkbox = ({ type = 'checkbox', name = line_id, checked = false, onChange }) => (
            <input type={type} name={name} checked={checked} onChange={onChange} />
        );

        const button = this.props.canUpdate ? <button onClick={this.handleDeleteClick} className='f6 link dim ph3 pv1 mb2 dib white bg-dark-red bn'>Delete</button> :  <button onClick={() => this.deleteFromDatabase(line_id)} className='f6 link dim ph3 pv1 mb2 dib white bg-dark-red bn'>Delete</button>
        let changeStatusButton = null;

        if(!this.props.canUpdate) {
            changeStatusButton = (
                <span>
                    <button onClick={() => this.changeStatus(2).bind(this)}>Sent</button>
                    <button onClick={() => this.changeStatus(3).bind(this)}>Paid</button>
                </span>
            )
        }

        return (
            <tr data-id={line_id} key={line_id}>
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
                    <input type="checkbox" name={line_id} onChange={this.toggleCheckbox.bind(this)} />
                    {button}
                    {changeStatusButton}
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

    deleteFromDatabase(line_id) {

        const self = this;

        axios.delete('/api/invoice/line/' + line_id)
            .then(function (response) {
                document.querySelector("tbody tr[data-id='" + line_id +"']").remove()
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    handleDeleteClick() {
        this.props.onDelete(this.props.id);
    }

}

export default LineItem;