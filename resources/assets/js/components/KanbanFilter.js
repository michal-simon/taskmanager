import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Card, CardBody, CardTitle } from 'reactstrap';
import axios from "axios";

export default class KanbanFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filters: [],
            customers: [],
            users: []
        };

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.resetFilters = this.resetFilters.bind(this)
    }

    handleChange(event) {

        const column = event.target.id
        const value = event.target.value

        if(value === 'all') {
            const updatedRowState = this.state.filters.filter(filter => filter.column !== column);

            this.setState({filters: updatedRowState})
            return true
        }

        this.setState(prevState => ({
            filters: [...prevState.filters, {"column": column, "value": value}]
        }))

        return true
    }

    resetFilters() {
        console.log('props', this.props)
        this.props.reset()
    }


    handleSubmit(event) {

        event.preventDefault()

        console.log(this.state.filters)

        axios.post( `/api/tasks/filterTasks/${this.props.task_type}`,
            this.state.filters)
            .then((response)=> {
                this.props.action(response.data)
            })
            .catch((error)=> {
                alert(error)
            });
    }

    componentDidMount() {
        this.getCustomers()
        this.getUsers()
    }

    getUsers() {
        axios.get('api/users')
            .then((r)=> {
                this.setState({
                    users: r.data
                })
            })
            .catch((e)=>{
                this.setState({
                    loading:false,
                    err: e
                })
            })
    }

    getCustomers() {
        axios.get('/api/customers')
            .then((r)=> {
                this.setState({
                    customers: r.data,
                })
            })
            .catch((e)=>{
                this.setState({
                    loading:false,
                    err: e
                })
            })
    }

    render() {

        let userContent = null
        let customerContent = null

        if (!this.state.customers.length) {
            customerContent = <option value="">Loading...</option>
        } else {
            customerContent = this.state.customers.map((customer, index) => (
                <option key={index} value={customer.id}>{customer.first_name + " " + customer.last_name}</option>
            ))
        }

        if (!this.state.users.length) {
            userContent = <option value="">Loading...</option>
        } else {
            userContent = this.state.users.map((user, index) => (
                <option key={index} value={user.id}>{user.first_name + " " + user.last_name}</option>
            ))
        }

        return (
            <Card style={{ margin: '10px' }}>
                <CardBody>
                    <CardTitle>Filter</CardTitle>
                    <Form inline onSubmit={this.handleSubmit}>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="exampleEmail" className="mr-sm-2" hidden>User</Label>
                            <Input type="select" name="customer_id" id="customer_id" onChange={this.handleChange}>
                                <option value="all">Select customer...</option>
                                {customerContent}
                            </Input>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="examplePassword" className="mr-sm-2" hidden>User</Label>
                            <Input type="select" id="contributors" name="contributors" onChange={this.handleChange}>
                                <option value="all">Select user...</option>
                                {userContent}
                            </Input>
                        </FormGroup>
                        <Button className="mr-2" color="success">Submit</Button>
                        <Button onClick={this.resetFilters} color="primary">Reset</Button>
                    </Form>
                </CardBody>
            </Card>

        );
    }
}