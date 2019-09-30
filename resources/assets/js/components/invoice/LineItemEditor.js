/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import LineItem from './LineItem'
import { Button } from 'reactstrap'

class LineItemEditor extends Component {
    constructor (props) {
        super(props)
        this.state = {
            rowData: [],
            total: this.props.total
        }

        this.handleRowChange = this.handleRowChange.bind(this)
        this.handleRowDelete = this.handleRowDelete.bind(this)
        this.handleRowAdd = this.handleRowAdd.bind(this)
        this.getTotal = this.getTotal.bind(this)
        this.setTotal = this.setTotal.bind(this)
    }

    buildExistingLine (lineItem, index) {
        return (
            <LineItem key={index} id={index} lineItemData={
                {
                    quantity: lineItem.quantity,
                    description: lineItem.description,
                    unit_price: lineItem.unit_price,
                    lineId: lineItem.id,
                    change_existing: true
                }
            } calculateTotal={this.getTotal} onDelete={this.handleRowDelete} onChange={this.handleRowChange}/>
        )
    }

    setTotal (total) {
        this.setState({ total: total })
        this.props.setTotal(total)
    }

    getTotal () {
        let grandTotal = 0
        const all = document.getElementsByName('unit_price')

        for (let i = 0, max = all.length; i < max; i++) {
            const quantity = all[i].parentNode.parentNode.firstChild.firstElementChild.value
            grandTotal += all[i].value * quantity
        }

        this.setTotal(grandTotal)
        return grandTotal
    }

    handleRowChange (row, data) {
        this.props.update(data, row)
    }

    handleRowDelete (e, row) {
         const parent = row.target.parentNode.parentNode
         const index = [...parent.parentNode.children].indexOf(parent)
        this.props.delete(index)
    }

    handleRowAdd () {
        this.props.onAddFiled()
    }

    render () {
        let currentIndex = document.querySelectorAll('[name=unit_price]').length
        currentIndex = currentIndex > 0 ? currentIndex - 1 : 0

        const lineItemRows = this.props.rows.map((lineItem, index) =>

            <LineItem new={true} key={index} id={currentIndex} lineItemData={lineItem} onChange={this.handleRowChange}
                handleTaskChange={this.updateTasks} onDelete={this.handleRowDelete} calculateTotal={this.getTotal}/>
        )

        const self = this
        let total = 0

        const items = this.props.lineItemModel.map(function (item, index) {
            total += item.quantity * item.unit_price
            return self.buildExistingLine(item, index)
        })

        return (
            <table id='lines-table'>
                <thead>
                    <tr>
                        <th>Quantity</th>
                        <th>Description</th>
                        <th>Product</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    {items}
                    {lineItemRows}

                </tbody>
                <tfoot>
                    <tr>
                        <th/>
                        <th>Grand total:</th>
                        <th>{this.state.total}</th>
                        <th/>
                    </tr>

                    <Button color="success" onClick={this.handleRowAdd}
                        className='f6 link dim ph3 pv1 mb2 dib white bg-dark-green bn'>Add</Button>

                </tfoot>
            </table>
        )
    }
}

export default LineItemEditor
