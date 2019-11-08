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

    handleRowChange (e) {
        const parent = e.target.parentNode.parentNode
        const row = [...parent.parentNode.children].indexOf(parent)

        this.props.update(e.currentTarget.name, e.currentTarget.value, row)

        if (e.currentTarget.name === 'product_id') {
            const price = e.target[e.target.selectedIndex].getAttribute('data-price')

            setTimeout(() => {
                this.props.update('unit_price', price, row)
            })
        }
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
        const lineItemRows = this.props.rows.map((lineItem, index) =>

            <LineItem new={true} key={index} lineItemData={lineItem} onChange={this.handleRowChange}
                handleTaskChange={this.updateTasks} onDelete={this.handleRowDelete} calculateTotal={this.getTotal}/>
        )

        return (
            <React.Fragment>
                <table id='lines-table'>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Discount</th>
                            <th>Tax</th>
                            <th>Tax Total</th>
                            <th>Total</th>
                            <th/>
                        </tr>
                    </thead>
                    <tbody>
                        {lineItemRows}

                    </tbody>
                    <tfoot>
                        <tr>
                            <th/>
                            <th>Grand total:</th>
                            <th>{this.state.total}</th>
                            <th/>
                        </tr>
                    </tfoot>
                </table>

                <Button color="success" onClick={this.handleRowAdd}
                    className='f6 link dim ph3 pv1 mb2 dib white bg-dark-green bn'>Add
                </Button>
            </React.Fragment>
        )
    }
}

export default LineItemEditor
