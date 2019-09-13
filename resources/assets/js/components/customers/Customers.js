import React,{Component} from 'react'
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';

export default class Customers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: []
        }
    }

    componentDidMount() {
        axios.get(`/api/customers`).then(data => {
            this.setState({ customers: data.data })
        })
    }

    deleteCustomer(id) {
        axios.delete(`/api/customers/${id}`).then(data => {
            const index = this.state.customers.findIndex(customer => customer.id === id);
            const customers = this.state.customers.splice(index, 1);
            this.setState({ customer: customers });
        })
    }

    displayCustomerAddress(customer) {

        const addresses = customer.addresses.map(function(address){
            return(
                <p key={customer.id}>
                    {address.address_1}<br />
                    {address.address_2}<br />
                    {address.zip}<br />
                    {address.city}
                </p>
            )
        })

        return (
            <td>{addresses}</td>
        )
    }

    displayCustomerPhone(customer) {

        const phone = customer.addresses.map(function(address){
            return(<span>{address.phone}</span>)
        })

        return (
            <td>{phone}</td>
        )
    }

    render() {
        const customers = this.state.customers;

        console.log('customers', customers)
        return (
            <div>
                {customers.length === 0 && (
                    <div className="text-center">
                        <h2>No customer found at the moment</h2>
                    </div>
                )}

                <div className="container">
                    <div className="row">

                        <AddCustomer />

                        <table className="table table-bordered">
                            <thead className="thead-light">
                            <tr>
                                <th scope="col">Firstname</th>
                                <th scope="col">Lastname</th>
                                <th scope="col">Email</th>
                                <th scope="col">Phone</th>
                                <th scope="col">Address</th>
                                <th scope="col">Description</th>
                                <th scope="col">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {customers && customers.map(customer =>

                                <tr key={customer.id}>
                                    <td>{customer.first_name}</td>
                                    <td>{customer.last_name}</td>
                                    <td>{customer.email}</td>
                                    {this.displayCustomerPhone(customer)}
                                    {this.displayCustomerAddress(customer)}
                                    <td>{customer.description}</td>
                                    <td>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="btn-group" style={{ marginBottom: "20px" }}>
                                                <EditCustomer id={customer.id} />
                                                {/*<a href={`edit/${customer.id}`} className="btn btn-sm btn-outline-secondary">Edit Customer </a>*/}
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => this.deleteCustomer(customer.id)}>Delete Customer</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        )
    }
}