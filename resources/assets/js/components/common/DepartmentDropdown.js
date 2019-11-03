import React, { Component } from 'react'
import axios from "axios";
import { Input, FormGroup, Label, Form } from 'reactstrap'


export default class DepartmentDropdown extends Component {
    constructor(props) {
        super(props)
        this.state = {
            departments: []
        }

        this.getDepartments = this.getDepartments.bind(this)
    }

    componentDidMount() {
        if (!this.props.departments || !this.props.departments.length) {
            this.getDepartments()
        } else {
            this.setState({departments: this.props.departments})
        }
    }

    getDepartments() {
        axios.get('/api/departments')
            .then((r) => {
                this.setState({
                    departments: r.data
                })
            })
            .catch((e) => {
                console.error(e)
            })
    }

    render () {
        let departmentList = null
        if (!this.state.departments.length) {
            departmentList = <option value="">Loading...</option>
        } else {
            departmentList = this.state.departments.map((department, index) => (
                <option key={index} value={department.id}>{department.name}</option>
            ))
        }

        const name = this.props.name && this.props.name ? this.props.name : 'department'

        return (
            <FormGroup className="mr-2">
                <Input value={this.props.department} onChange={this.props.handleInputChanges} type="select"
                       name={name} id={name}>
                    <option value="">Select Department</option>
                    {departmentList}
                </Input>
                {this.props.renderErrorFor('department')}
            </FormGroup>
        )
    }
}