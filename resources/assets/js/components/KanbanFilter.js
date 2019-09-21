import React, { Component } from "react";
import { Button, Form, FormGroup, Label, Input, Card, CardBody, CardTitle } from 'reactstrap';
import axios from "axios";

export default class KanbanFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
          filters: []
        };

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
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

    handleSubmit(event) {

        event.preventDefault()

        console.log(this.state.filters)

        axios.post('/api/tasks', this.state.filters)
            .then((response)=> {
                    this.props.action(this.props.customers)
            })
            .catch((error)=> {
                alert(error)
            });
    }

    render() {
        return (
            <Card style={{ margin: '10px' }}>
                <CardBody>
                    <CardTitle>Filter</CardTitle>
                    <Form inline onSubmit={this.handleSubmit}>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="exampleEmail" className="mr-sm-2" hidden>User</Label>
                            <Input type="select" name="customer" id="customer" onChange={this.handleChange}>
                                <option value="all">Select customer...</option>
                                <option value={1}>Customer 1</option>
                            </Input>
                        </FormGroup>
                        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                            <Label for="examplePassword" className="mr-sm-2" hidden>Customer</Label>
                            <Input type="select" id="user" name="user" onChange={this.handleChange}>
                                <option value="all">Select user...</option>
                                <option value={1}>User 1</option>
                            </Input>
                        </FormGroup>
                        <Button>Submit</Button>
                    </Form>
                </CardBody>
            </Card>

        );
    }
}