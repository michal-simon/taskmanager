/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'

class AddProduct extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            name: '',
            description: '',
            brand: 0,
            price: '',
            sku: '',
            loading: false,
            errors: [],
            categories: [],
            selectedCategories: []
        }
        this.toggle = this.toggle.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.buildBrandOptions = this.buildBrandOptions.bind(this)
        this.buildCategoryOptions = this.buildCategoryOptions.bind(this)
        this.handleMultiSelect = this.handleMultiSelect.bind(this)
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
        axios.post('/api/products', {
            name: this.state.name,
            description: this.state.description,
            price: this.state.price,
            sku: this.state.sku,
            brand_id: this.state.brand,
            category: this.state.selectedCategories
        })
            .then((response) => {
                this.toggle()
                const newProduct = response.data
                this.props.products.push(newProduct)
                this.props.action(this.props.products)
                this.setState({
                    name: null,
                    description: null,
                    price: null,
                    sku: null,
                    loading: false
                })
            })
            .catch((error) => {
                this.setState({
                    errors: error.response.data.errors
                })
            })
    }

    handleMultiSelect (e) {
        this.setState({ selectedCategories: Array.from(e.target.selectedOptions, (item) => item.value) })
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
                <Label for="users">Categories</Label>
                <Input defaultValue={this.state.selectedCategories} onChange={this.handleMultiSelect} type="select"
                    name="category" id="category" multiple>
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
                <Input onChange={this.handleInput.bind(this)} type="select" name="brand" id="brand">
                    <option value="">Select Brand</option>
                    {brandList}
                </Input>
                {this.renderErrorFor('brand')}
            </FormGroup>
        )
    }

    handleInput (e) {
        this.setState({
            [e.target.name]: e.target.value
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
        const brandList = this.buildBrandOptions()
        const categoryList = this.buildCategoryOptions()

        return (
            <React.Fragment>
                <Button color="success" onClick={this.toggle}>Add Product</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                       Add Product
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Name(*):</Label>
                            <Input className={this.hasErrorFor('name') ? 'is-invalid' : ''} type="text"
                                name="name" onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('name')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="description">Description:</Label>
                            <Input className={this.hasErrorFor('description') ? 'is-invalid' : ''}
                                type="textarea"
                                name="description"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('description')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="price">Price(*):</Label>
                            <Input className={this.hasErrorFor('price') ? 'is-invalid' : ''}
                                type="text"
                                name="price"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('price')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="sku">Sku(*):</Label>
                            <Input className={this.hasErrorFor('sku') ? 'is-invalid' : ''}
                                type="text"
                                name="sku"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('sku')}
                        </FormGroup>

                        {brandList}
                        {categoryList}
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

export default AddProduct
