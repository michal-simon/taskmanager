import React, { Component } from 'react'
import axios from "axios";
import { Input, FormGroup, Label, Form } from 'reactstrap'

export default class CategoryDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categories: []
        }

        this.getCategories = this.getCategories.bind(this)
    }

    componentDidMount() {
        if (!this.props.categories || !this.props.categories.length) {
            this.getCategories()
        } else {
            this.setState({categories: this.props.categories})
        }
    }

    getCategories() {
        axios.get('/api/categories')
            .then((r) => {
                this.setState({
                    categories: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    render () {
        let categoryList = null
        if (!this.state.categories.length) {
            categoryList = <option value="">Loading...</option>
        } else {
            categoryList = this.state.categories.map((category, index) => (
                <option key={index} value={category.id}>{category.name}</option>
            ))
        }

        const name = this.props.name && this.props.name ? this.props.name : 'category'

        return (
            <FormGroup>
                <Input value={this.props.category} onChange={this.props.handleInputChanges} type="select"
                       name={name} id={name}>
                    <option value="">Select Category</option>
                    {categoryList}
                </Input>
                {this.props.renderErrorFor('category')}
            </FormGroup>
        )
    }
}
