/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label, CustomInput } from 'reactstrap'
import axios from 'axios'
import CompanyDropdown from "../common/CompanyDropdown";
import CategoryDropdown from "../common/CategoryDropdown";

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
        this.handleInput = this.handleInput.bind(this)
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

        const formData = new FormData();
        formData.append('cover', this.state.cover)
        formData.append('image[]', this.state.image)
        formData.append('name', this.state.name)
        formData.append('description', this.state.description)
        formData.append('price', this.state.price)
        formData.append('sku', this.state.sku)
        formData.append('brand_id', this.state.brand_id)
        formData.append('category', this.state.selectedCategories)

        axios.post('/api/products', formData, {
            headers: {
                'content-type': 'multipart/form-data'
            }
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
    
     handleFileChange (e) {
        this.setState({
            [e.target.name]: e.target.files[0]
        })
    }

    handleMultiSelect (e) {
        this.setState({ selectedCategories: Array.from(e.target.selectedOptions, (item) => item.value) })
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
        return (
            <React.Fragment>
                <Button className="pull-right" color="success" onClick={this.toggle}>Add Product</Button>
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

                        <CustomInput onChange={this.handleFileChange.bind(this)} type="file" id="cover" name="cover"
                            label="Cover!"/>

                        <CustomInput onChange={this.handleFileChange.bind(this)} type="file" id="image" name="image"
                                     label="Thumbnail!"/>

                       <CompanyDropdown
                          name="brand_id"
                          hasErrorFor={this.hasErrorFor}
                          renderErrorFor={this.renderErrorFor}
                          handleInputChanges={this.handleInput}
                          // companies={this.props.brands}
                      />
                       
                      <CategoryDropdown
                          multiple={true}
                          name="category"
                          hasErrorFor={this.hasErrorFor}
                          renderErrorFor={this.renderErrorFor}
                          handleInputChanges={this.handleMultiSelect}
                          categories={this.props.categories}
                      />
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
