/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'

class AddBrand extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            name: '',
            website: '',
            phone_number: '',
            email: '',
            address_1: '',
            address_2: '',
            town: '',
            city: '',
            postcode: '',
            loading: false,
            errors: []
        }
        this.toggle = this.toggle.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
    }

    handleInput (e) {
        this.setState({
            [e.target.name]: e.target.value
        })
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

    handleClick () {
        axios.post('/api/brands', {
            name: this.state.name,
            website: this.state.website,
            phone_number: this.state.phone_number,
            email: this.state.email,
            address_1: this.state.address_1,
            address_2: this.state.address_2,
            town: this.state.town,
            city: this.state.city,
            postcode: this.state.postcode
        })
            .then((response) => {
                this.toggle()
                const newUser = response.data
                this.props.brands.push(newUser)
                this.props.action(this.props.brands)
                this.setState({
                    website: null,
                    phone_number: null,
                    email: null,
                    address_1: null,
                    address_2: null,
                    town: null,
                    city: null,
                    postcode: null
                })
            })
            .catch((error) => {
                this.setState({
                    errors: error.response.data.errors
                })
            })
    }

    toggle () {
        this.setState({
            modal: !this.state.modal,
            errors: [],
            loading: true
        })
    }

    render () {
        return (
            <React.Fragment>
                <Button color="success" onClick={this.toggle}>Add Company</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Add Company
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="username">Name(*):</Label>
                            <Input className={this.hasErrorFor('name') ? 'is-invalid' : ''}
                                type="text"
                                name="name"
                                placeholder="Name"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('name')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="website">Website(*):</Label>
                            <Input className={this.hasErrorFor('website') ? 'is-invalid' : ''}
                                type="text"
                                name="website"
                                placeholder="Website"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('website')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="phone_number">Phone Number(*):</Label>
                            <Input className={this.hasErrorFor('phone_number') ? 'is-invalid' : ''}
                                placeholder="Phone Number"
                                type="tel"
                                name="phone_number"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('phone_number')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="email">Email(*):</Label>
                            <Input className={this.hasErrorFor('name') ? 'is-invalid' : ''}
                                placeholder="Email"
                                type="email"
                                name="email"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('email')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="address_1">Address(*):</Label>
                            <Input className={this.hasErrorFor('address_1') ? 'is-invalid' : ''}
                                placeholder="Address"
                                type="text"
                                name="address_1"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('address_1')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="address_2">Address 2:</Label>
                            <Input className={this.hasErrorFor('address_2') ? 'is-invalid' : ''}
                                placeholder="Address"
                                type="text"
                                name="address_2"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('address_2')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="town">Town(*):</Label>
                            <Input className={this.hasErrorFor('town') ? 'is-invalid' : ''}
                                placeholder="Town"
                                type="text"
                                name="town"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('town')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="city">City(*):</Label>
                            <Input className={this.hasErrorFor('city') ? 'is-invalid' : ''}
                                placeholder="City"
                                type="text"
                                name="city"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('city')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="postcode">Postcode(*):</Label>
                            <Input className={this.hasErrorFor('postcode') ? 'is-invalid' : ''}
                                placeholder="Postcode"
                                type="text"
                                name="postcode"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('postcode')}
                        </FormGroup>
                    </ModalBody>

                    <ModalFooter>
                        <Button color="primary" onClick={this.handleClick.bind(this)}>Add</Button>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }
}

export default AddBrand
