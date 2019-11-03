Thanks import React, { Component } from 'react'
import axios from "axios";
import { Input, FormGroup, Label, Form } from 'reactstrap'


export default class CompanyDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            companies: []
        }

        this.getCompanies = this.getCompanies.bind(this)
    }

    componentDidMount() {
        if (!this.props.companies || !this.props.companies.length) {
            this.getCompanies()
        }
    }

    getCompanies() {
        axios.get('/api/brands')
            .then((r) => {
                this.setState({
                    companies: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    render () {
        let companyList = null
        if (!this.state.companies.length) {
            companyList = <option value="">Loading...</option>
        } else {
            companyList = this.state.companies.map((company, index) => (
                <option key={index} value={company.id}>{company.name}</option>
            ))
        }

        const name = this.props.name && this.props.name ? this.props.name : 'company_id'

        return (
            <FormGroup>
                <Label for="company_id">Company</Label>
                <Input value={this.props.company_id} onChange={this.props.handleInputChanges} type="select"
                    name={name} id={name}>
                    <option value="">Select Company</option>
                    {companyList}
                </Input>
                {this.props.renderErrorFor('company_id')}
            </FormGroup>
        )
    }
}
