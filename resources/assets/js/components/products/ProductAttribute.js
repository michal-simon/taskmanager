/* eslint-disable no-unused-vars */
import React from 'react'
import { Input, FormGroup, Label } from 'reactstrap'

class ProductAttribute extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            range_from: 0,
            range_to: 0,
            monthly_price: 0,
            full_price: 0,
            interest_rate: 0,
            loading: false,
            errors: []
        }
        
        this.state = {...this.state, ...this.props.values }        
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
    }

    hasErrorFor (field) {
        return !!this.state.errors[field]
    }

    renderErrorFor (field) {
        if (this.hasErrorFor(field)) {
            return (
                <span className='invalid-feedback'>
                    <strong>{this.state.errors[field][0]}</strong>
                </span>
            )
        }
    }

    handleInput (e) {
        this.setState({
            [e.target.name]: e.target.value
        })

        this.props.onChange(e)
    }
    render () {

        return (
            <React.Fragment>

                        <FormGroup>
                            <Label for="range_from">Range From:</Label>
                            <Input value={this.state.range_from} 
                                className={this.hasErrorFor('range_from') ? 'is-invalid' : ''} 
                                type="number"
                                name="range_from" onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('range_from')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="range_to">Range To:</Label>
                            <Input className={this.hasErrorFor('range_to') ? 'is-invalid' : ''}
                                value={this.state.range_to}
                                type="number"
                                name="range_to"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('range_to')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="monthly_price">Monthly Price:</Label>
                            <Input className={this.hasErrorFor('monthly_price') ? 'is-invalid' : ''}
                                type="number"
                                name="monthly_price"
                                value={this.state.monthly_price}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('monthly_price')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="interest_rate">Interest Rate:</Label>
                            <Input className={this.hasErrorFor('interest_rate') ? 'is-invalid' : ''}
                                value={this.state.interest_rate}
                                type="number"
                                name="interest_rate"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('interest_rate')}
                        </FormGroup>

                <FormGroup>
                    <Label for="full_price">Full Price:</Label>
                    <Input className={this.hasErrorFor('full_price') ? 'is-invalid' : ''}
                        value={this.state.full_price}
                        type="number"
                        name="full_price"
                        onChange={this.handleInput.bind(this)}/>
                    {this.renderErrorFor('full_price')}
                </FormGroup>
            </React.Fragment>
        )
    }
}

export default ProductAttribute
