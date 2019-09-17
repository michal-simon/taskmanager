import React, { Component } from 'react';
import axios from "axios";
import {Button} from "reactstrap";


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
    }

    updateLine(e) {
        const parent = e.target.parentNode.parentNode
        const lineId = e.target.parentNode.parentNode.getAttribute('data-id')

        if(!lineId) {
            return false
        }

        let inputs = parent.querySelectorAll('input'), i

        const obj = {}

        for (i = 0; i < inputs.length; ++i) {

                obj[inputs[i].getAttribute("name")] =  inputs[i].value
        }

        axios.put(`/api/invoice/line/${lineId}`, obj)
            .then((response) => {
            })
            .catch((error) => {
                alert(error)
            });
    }

    render() {
        const { line_id } = this.props.lineItemData;

        const button = this.props.canUpdate ? <Button color="danger" onClick={this.handleDeleteClick}>Delete</Button> :  <Button color="danger" onClick={() => this.deleteFromDatabase(line_id)} className='f6 link dim ph3 pv1 mb2 dib white bg-dark-red bn'>Delete</Button>

        return (
            <tr data-id={line_id} key={line_id}>
                <td>
                    <input name="quantity" data-line={line_id} type='text' value={this.state.quantity} onChange={this.handleQuantityChange} className='pa2 mr2 f6 form-control'></input>
                </td>
                <td>
                    <input name="description" data-line={line_id} type='text' value={this.state.description} onChange={this.handleDescriptionChange} className='pa2 mr2 f6 form-control'></input>
                </td>
                <td>
                    <input name="unit_price" data-line={line_id} type='text' data-column="5" value={this.state.unit_price} onChange={this.handlePriceChange} className='pa2 mr2 f6 form-control'></input>
                </td>
                <td>
                    <p className='pa2 mr2 f6'>{this.state.quantity * this.state.unit_price}</p>
                </td>
                <td>
                    {button}
                    <Button color="primary" onClick={this.updateLine}>Update</Button>
                </td>
            </tr>
        );
    }

    handleQuantityChange(e) {

        if(this.isExistingLine(e)) {
            this.setState({ quantity: e.target.value });
            return false;
        }

        this.setState({ quantity: e.target.value }, this.pushToCaller);
    }

    handleDescriptionChange(e) {

        if(this.isExistingLine(e)) {
            this.setState({ description: e.target.value });
            return false
        }

        this.setState({ description: e.target.value }, this.pushToCaller);
    }

    isExistingLine(e) {
        const lineId = e.target.parentNode.parentNode.getAttribute('data-id')

        if(lineId) {
            return true
        }

        return false
    }

    handlePriceChange(e) {

        if(this.isExistingLine(e)) {
            this.setState({ unit_price: e.target.value });
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