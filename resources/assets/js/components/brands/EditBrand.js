/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'

class EditBrand extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            loading: false,
            errors: [],
            name: this.props.brand.name,
            website: this.props.brand.website,
            phone_number: this.props.brand.phone_number,
            email: this.props.brand.email,
            address_1: this.props.brand.address_1,
            address_2: this.props.brand.address_2,
            town: this.props.brand.town,
            city: this.props.brand.city,
            postcode: this.props.brand.postcode,
            id: this.props.brand.id
        }
        this.toggle = this.toggle.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
    }

    handleInput (e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleMultiSelect (e) {
        this.setState({ attachedPermissions: Array.from(e.target.selectedOptions, (item) => item.value) })
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

        const index = this.props.brands.findIndex(brand => brand.id === this.props.brand.id)
        this.props.brands[index] = {
            name: this.state.name,
            website: this.state.website,
            phone_number: this.state.phone_number,
            email: this.state.email,
            address_1: this.state.address_1,
            address_2: this.state.address_2,
            town: this.state.town,
            city: this.state.city,
            postcode: this.state.postcode
        }

        axios.put(`/api/brands/${this.state.id}`, this.props.brands[index])
            .then((response) => {
                this.toggle()
                this.props.action(this.props.brands)
            })
            .catch((error) => {
                this.setState({
                    errors: error.response.data.errors
                })
            })
    }

    toggle () {
        this.setState({
            modal: !this.state.modal
        })
    }

    render () {
        return (
            <React.Fragment>
                <Button color="success" onClick={this.toggle}>Update</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Edit Brand
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Name(*):</Label>
                            <Input className={this.hasErrorFor('name') ? 'is-invalid' : ''}
                                type="text"
                                placeholder="Name"
                                name="name"
                                value={this.state.name}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('name')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="website">Website(*):</Label>
                            <Input className={this.hasErrorFor('website') ? 'is-invalid' : ''}
                                type="text"
                                name="website"
                                placeholder="Website"
                                value={this.state.website}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('website')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="phone_number">Phone Number(*):</Label>
                            <Input className={this.hasErrorFor('phone_number') ? 'is-invalid' : ''}
                                placeholder="Phone Number"
                                type="tel"
                                name="phone_number"
                                value={this.state.phone_number}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('phone_number')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="email">Email(*):</Label>
                            <Input className={this.hasErrorFor('name') ? 'is-invalid' : ''}
                                placeholder="Email"
                                type="email"
                                name="email"
                                value={this.state.email}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('email')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="address_1">Address(*):</Label>
                            <Input className={this.hasErrorFor('address_1') ? 'is-invalid' : ''}
                                placeholder="Address"
                                type="text"
                                name="address_1"
                                value={this.state.address_1}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('address_1')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="address_2">Address 2:</Label>
                            <Input className={this.hasErrorFor('address_2') ? 'is-invalid' : ''}
                                placeholder="Address"
                                type="text"
                                name="address_2"
                                value={this.state.address_2}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('address_2')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="town">Town(*):</Label>
                            <Input className={this.hasErrorFor('town') ? 'is-invalid' : ''}
                                placeholder="Town"
                                type="text"
                                name="town"
                                value={this.state.town}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('town')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="city">City(*):</Label>
                            <Input className={this.hasErrorFor('city') ? 'is-invalid' : ''}
                                placeholder="City"
                                type="text"
                                name="city"
                                value={this.state.city}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('city')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="postcode">Postcode(*):</Label>
                            <Input className={this.hasErrorFor('postcode') ? 'is-invalid' : ''}
                                placeholder="Postcode"
                                type="text"
                                name="postcode"
                                value={this.state.postcode}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('postcode')}
                        </FormGroup>

                    </ModalBody>

                    <ModalFooter>
                        <Button color="primary" onClick={this.handleClick.bind(this)}>Update</Button>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }
}

export default EditBrand
