import React, { Component } from 'react';
import LineItem from './LineItem';

class LineItemEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: []
        }
        this.handleRowChange = this.handleRowChange.bind(this);
        this.handleRowDelete = this.handleRowDelete.bind(this);
        this.handleRowAdd = this.handleRowAdd.bind(this);
        this.getTotal = this.getTotal.bind(this);
    }

    buildExistingLine(lineItem, index) {

        return (
            <LineItem key={index} id={index} lineItemData={
                {
                    'quantity': lineItem.quantity,
                    'description': lineItem.description,
                    'unit_price': lineItem.unit_price,
                    'line_id': lineItem.id,
                    'change_existing': true
                }

            } canUpdate={false}/>
        )
    }

    render() {
        const lineItemRows = this.state.rowData.map((lineItem, index) =>
            <LineItem key={index} id={index} lineItemData={this.state.rowData[index]} onChange={this.handleRowChange} onDelete={this.handleRowDelete}/>
        );

        const self = this

        const items = this.props.lineItemModel.map(function(item, index){
            return self.buildExistingLine(item, index)
        })

        return (
            <table>
                <thead>
                <tr>
                    <th>Quantity</th>
                    <th>Description</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {items}
                {lineItemRows}

                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td><button onClick={this.handleRowAdd} className='f6 link dim ph3 pv1 mb2 dib white bg-dark-green bn'>Add</button></td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <th></th>
                    <th>Grand total:</th>
                    <th>{this.getTotal()}</th>
                    <th></th>
                </tr>
                </tfoot>
            </table>
        );
    }

    getTotal() {
        let grandTotal = 0;
        const rowTotals = this.state.rowData.map(row => row.quantity * row.unit_price);
        if (rowTotals.length > 0) {
            grandTotal = rowTotals.reduce((acc, val) => acc + val);
        }

        this.props.setTotal(grandTotal)
        return grandTotal;
    }

    handleRowChange(row, data) {
        const rowDataCopy = this.state.rowData.slice(0);
        rowDataCopy[row] = data;
        this.setState({ rowData: rowDataCopy });
        this.props.update(rowDataCopy)
    }

    handleRowDelete(row) {
        const rowDataCopy = this.state.rowData.slice(0);
        rowDataCopy.splice(row, 1);
        this.setState({rowData: rowDataCopy});
        this.props.update(rowDataCopy)
    }

    handleRowAdd() {
        const rowDataCopy = this.state.rowData.slice(0);
        rowDataCopy.push({ quantity: 0, description: '', unit_price: 0 });
        this.setState({rowData: rowDataCopy});
        this.props.update(rowDataCopy)
    }

}

export default LineItemEditor;