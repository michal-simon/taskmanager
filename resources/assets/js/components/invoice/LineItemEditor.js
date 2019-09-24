/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import LineItem from './LineItem'
import { Button } from 'reactstrap'

class LineItemEditor extends Component {
    constructor (props) {
        super(props)
        this.state = {
            rowData: []
        }
        this.handleRowChange = this.handleRowChange.bind(this)
        this.handleRowDelete = this.handleRowDelete.bind(this)
        this.handleRowAdd = this.handleRowAdd.bind(this)
        this.getTotal = this.getTotal.bind(this)
        this.setTotal = this.setTotal.bind(this)
        const total = 0
    }

    buildExistingLine (lineItem, index) {

        const canUpdate = this.props.hasTasks ? true : false

        return (
            <LineItem key={index} id={index} lineItemData={
                {
                    quantity: lineItem.quantity,
                    description: lineItem.description,
                    unit_price: lineItem.unit_price,
                    lineId: lineItem.id,
                    change_existing: true
                }
            } canUpdate={canUpdate} calculateTotal={this.getTotal} onDelete={this.handleRowDelete}  onChange={this.handleRowChange}/>
        )
    }

    setTotal(total) {
        this.props.setTotal(total)
        this.total = total
    }

    getTotal () {
        let grandTotal = 0
        const all = document.getElementsByName("unit_price");

        for(let i = 0, max = all.length; i < max; i++)
        {
            alert(all[i].value)
            const quantity = all[i].parentNode.parentNode.firstChild.firstElementChild.value
            grandTotal += all[i].value * quantity;
        }

        this.setTotal(grandTotal)

    }

    handleRowChange (row, data) {
        this.props.update(data, row)
    }

    handleRowDelete (e, row) {
        const parent = row.target.parentNode.parentNode
        const index = [...parent.parentNode.children].indexOf(parent);
        this.props.delete(row)
    }

    handleRowAdd () {
        const rowDataCopy = this.state.rowData.slice(0)
        rowDataCopy.push({ quantity: 0, description: '', unit_price: 0 })
        this.setState({ rowData: rowDataCopy })
    }

    render () {
        const currentIndex = this.props.lineItemModel.length
        const lineItemRows = this.state.rowData.map((lineItem, index) =>

            <LineItem key={index} id={currentIndex} lineItemData={this.state.rowData[index]} onChange={this.handleRowChange}
                      handleTaskChange={this.updateTasks} onDelete={this.handleRowDelete} calculateTotal={this.getTotal}/>
        )
        const self = this
        let total = 0

        const items = this.props.lineItemModel.map(function (item, index) {
            total += item.unit_price * item.quantity
            return self.buildExistingLine(item, index)
        })

        this.setTotal(total)

        return (
            <table id='lines-table'>
                <thead>
                    <tr>
                        <th>Quantity</th>
                        <th>Description</th>
                        <th>Product</th>
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
                        <td>
                            <Button color="success" onClick={this.handleRowAdd}
                                className='f6 link dim ph3 pv1 mb2 dib white bg-dark-green bn'>Add</Button></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th></th>
                        <th>Grand total:</th>
                        <th>{this.total}</th>
                        <th></th>
                    </tr>
                </tfoot>
            </table>
        )
    }
}

export default LineItemEditor
