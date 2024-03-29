/* eslint-disable no-unused-vars */
import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, FormGroup, Label } from 'reactstrap'
import axios from 'axios'
import DropdownDate from '../common/DropdownDate'
import DepartmentDropdown from "../common/DepartmentDropdown";
import RoleDropdown from "../common/RoleDropdown";

class AddUser extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            modal: false,
            username: '',
            email: '',
            first_name: '',
            last_name: '',
            dob: '',
            job_description: '',
            phone_number: '',
            gender: '',
            department: 0,
            role_id: 0,
            password: '',
            loading: false,
            errors: [],
            roles: [],
            selectedRoles: [],
            message: ''
        }
        this.toggle = this.toggle.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
        this.handleMultiSelect = this.handleMultiSelect.bind(this)
        this.setDate = this.setDate.bind(this)
        this.buildGenderDropdown = this.buildGenderDropdown.bind(this)
        this.handleInput = this.handleInput.bind(this)

        this.defaultValues = {
            year: 'Select Year',
            month: 'Select Month',
            day: 'Select Day'
        }

        this.classes = {
            dateContainer: 'form-row',
            yearContainer: 'col-md-4 mb-3',
            monthContainer: 'col-md-4 mb-3',
            dayContainer: 'col-md-4 mb-3'
        }
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
        axios.post('/api/users', {
            username: this.state.username,
            department: this.state.department,
            email: this.state.email,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            job_description: this.state.job_description,
            phone_number: this.state.phone_number,
            dob: this.state.dob,
            gender: this.state.gender,
            password: this.state.password,
            role: this.state.selectedRoles
        })
            .then((response) => {
                this.toggle()
                const newUser = response.data
                this.props.users.push(newUser)
                this.props.action(this.props.users)
                this.setState({
                    username: null,
                    email: null,
                    first_name: null,
                    last_name: null,
                    phone_number: null,
                    job_description: null,
                    gender: null,
                    password: null,
                    role_id: null,
                    loading: false
                })
            })
            .catch((error) => {
                if (error.response.data.errors) {
                    this.setState({
                        errors: error.response.data.errors
                    })
                } else {
                    alert('yes')
                    console.log('error', error.response.data)
                    this.setState({message: error.response.data})
                }
            })
    }

    handleInput (event) {
      const { name, value } = event.target

        this.setState({
            [name]: value
        })
    }

    toggle () {
        this.setState({
            modal: !this.state.modal,
            errors: []
        })
    }

    handleMultiSelect (e) {
        this.setState({ selectedRoles: Array.from(e.target.selectedOptions, (item) => item.value) })
    }

    setDate (date) {
        this.setState({ dob: date })
    }

    buildGenderDropdown () {
        const arrOptions = ['male', 'female']

        const options = arrOptions.map(option => {
            return <option key={option} value={option}>{option}</option>
        })

        return (
            <FormGroup>
                <Label for="gender">Gender(*):</Label>
                <Input className={this.hasErrorFor('gender') ? 'is-invalid' : ''}
                    type="select"
                    name="gender"
                    onChange={this.handleInput.bind(this)}>
                    <option value="">Select gender</option>
                    {options}
                </Input>
                {this.renderErrorFor('gender')}
            </FormGroup>
        )
    }

    render () {
        const genderList = this.buildGenderDropdown()
        const {message} = this.state

        return (
            <React.Fragment>
                <Button className="pull-right" color="success" onClick={this.toggle}>Add User</Button>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>
                       Add User
                    </ModalHeader>
                    <ModalBody>
                    
                     {message && <div className="alert alert-danger" role="alert">
                            {message}
                        </div>}
            
                        <FormGroup>
                            <Label for="username">Username(*):</Label>
                            <Input className={this.hasErrorFor('username') ? 'is-invalid' : ''}
                                placeholder="Username"
                                type="text"
                                name="username"
                                onChange={this.handleInput.bind(this)}/>
                            <small className="form-text text-muted">Your username must be "firstname"."lastname" eg joe.bloggs.</small>
                            {this.renderErrorFor('username')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="email">Email(*):</Label>
                            <Input className={this.hasErrorFor('email') ? 'is-invalid' : ''}
                                placeholder="Email"
                                type="email"
                                name="email"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('email')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="first_name">First Name(*):</Label>
                            <Input className={this.hasErrorFor('first_name') ? 'is-invalid' : ''}
                                type="text"
                                name="first_name"
                                placeholder="First Name"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('first_name')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="last_name">Last Name(*):</Label>
                            <Input className={this.hasErrorFor('last_name') ? 'is-invalid' : ''}
                                type="text"
                                placeholder="Last Name"
                                name="last_name"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('last_name')}
                        </FormGroup>

                        {genderList}
                        
                        <DepartmentDropdown
                            hasErrorFor={this.hasErrorFor}
                            departments={this.props.departments}
                            name="department"
                            renderErrorFor={this.renderErrorFor}
                            handleInputChanges={this.handleInput}
                        />
                                
                        <RoleDropdown
                            hasErrorFor={this.hasErrorFor}
                            name="role"
                            multiple={true}
                            renderErrorFor={this.renderErrorFor}
                            handleInputChanges={this.handleMultiSelect}
                            role={this.state.selectedRoles}
                        />

                        <DropdownDate classes={this.classes} defaultValues={this.defaultValues} onDateChange={this.setDate}/>

                        <FormGroup>
                            <Label for="job_description">Job Description:</Label>
                            <Input className={this.hasErrorFor('job_description') ? 'is-invalid' : ''}
                                type="text"
                                placeholder="Job Description"
                                name="job_description"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('job_description')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="phone_number">Phone Number:</Label>
                            <Input className={this.hasErrorFor('phone_number') ? 'is-invalid' : ''}
                                type="tel"
                                name="phone_number"
                                onChange={this.handleInput.bind(this)}/>
                            {this.renderErrorFor('phone_number')}
                        </FormGroup>

                        <FormGroup>
                            <Label for="password">Password:</Label>
                            <Input className={this.hasErrorFor('password') ? 'is-invalid' : ''} type="password"
                                name="password" onChange={this.handleInput.bind(this)}/>
                            <small className="form-text text-muted">Your password must be more than 8 characters long, should contain at-least 1 Uppercase, 1 Lowercase, 1 Numeric and 1 special character..</small>
                            {this.renderErrorFor('password')}
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

export default AddUser
