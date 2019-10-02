/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'
import PropTypes from 'prop-types'

class EditProduct extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            loading: false,
            errors: [],
            name: this.props.product.name,
            description: this.props.product.description,
            price: this.props.product.price,
            sku: this.props.product.sku,
            id: this.props.product.id,
            categories: [],
            selectedCategories: this.props.product.category_ids ? this.props.product.category_ids : [],
            brand_id: this.props.product.brand_id
        }
        this.toggle = this.toggle.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.buildCategoryOptions = this.buildCategoryOptions.bind(this)
        this.buildBrandOptions = this.buildBrandOptions.bind(this)
        this.handleMultiSelect = this.handleMultiSelect.bind(this)
    }

    handleClick () {
        axios.put(`/api/products/${this.state.id}`, {
            name: this.state.name,
            description: this.state.description,
            price: this.state.price,
            sku: this.state.sku,
            category: this.state.selectedCategories,
            brand_id: this.state.brand_id,
        })
            .then((response) => {
                this.toggle()
                const index = this.props.products.findIndex(product => product.id === this.state.id)
                this.props.products[index].name = this.state.name
                this.props.products[index].description = this.state.description
                this.props.products[index].price = this.state.price
                this.props.products[index].sku = this.state.sku
                this.props.products[index].brand_id = this.state.brand_id
                this.props.products[index].category_ids = this.state.selectedCategories

                this.props.action(this.props.products)
            })
            .catch((error) => {
                this.setState({
                    errors: error.response.data.errors
                })
            })
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

    hasErrorFor (field) {
        return !!this.state.errors[field]
    }

    handleInput (e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleMultiSelect (e) {
        this.setState({ selectedCategories: Array.from(e.target.selectedOptions, (item) => item.value) })
    }

    toggle () {
        this.setState({
            modal: !this.state.modal
        })
    }

    buildCategoryOptions () {
        let categoryList = null
        if (!this.props.categories.length) {
            categoryList = <option value="">Loading...</option>
        } else {
            categoryList = this.props.categories.map((category, index) => (
                <option key={index} value={category.id}>{category.name}</option>
            ))
        }

        return (
            <FormGroup>
                <Label for="category">Categories</Label>
                <Input defaultValue={this.state.selectedCategories} onChange={this.handleMultiSelect} type="select"
                    name="category"
                    id="category" multiple>
                    {categoryList}
                </Input>
                {this.renderErrorFor('category')}
            </FormGroup>
        )
    }

    buildBrandOptions () {
        let brandList
        if (!this.props.brands.length) {
            brandList = <option value="">Loading...</option>
        } else {
            brandList = this.props.brands.map((brand, index) => (
                <option key={index} value={brand.id}>{brand.name}</option>
            ))
        }

        return (
            <FormGroup>
                <Label for="users">Brand</Label>
                <Input value={this.state.brand_id} onChange={this.handleInput.bind(this)}
                    type="select"
                    name="brand_id"
                    id="brand_id"
                >
                    <option value="">Select Brand</option>
                    {brandList}
                </Input>
                {this.renderErrorFor('brand')}
            </FormGroup>
        )
    }


    render () {

        const brandList = this.buildBrandOptions()
        const categoryList = this.buildCategoryOptions()

        return (
            <React.Fragment>
                <Button color="success" onClick={this.toggle}>Update</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                        Edit Product
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Name(*):</Label>
                            <Input className={this.hasErrorFor('name') ? 'is-invalid' : ''}
                                type="text"
                                name="name"
                                defaultValue={this.state.name}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('name')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="email">Description:</Label>
                            <Input className={this.hasErrorFor('description') ? 'is-invalid' : ''}
                                type="textarea"
                                name="description"
                                defaultValue={this.state.description}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('description')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="price">Price(*):</Label>
                            <Input className={this.hasErrorFor('price') ? 'is-invalid' : ''}
                                type="text"
                                name="price"
                                defaultValue={this.state.price}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('price')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="sku">Sku(*):</Label>
                            <Input className={this.hasErrorFor('sku') ? 'is-invalid' : ''}
                                type="text"
                                name="sku"
                                defaultValue={this.state.sku}
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('sku')}
                        </FormGroup>

                        {brandList}
                        {categoryList}
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

export default EditProduct

EditProduct.propTypes = {
    product: PropTypes.object,
    products: PropTypes.array,
    action: PropTypes.func
}
