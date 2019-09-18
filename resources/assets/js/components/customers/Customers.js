import React,{Component} from 'react'
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import AddCustomer from './AddCustomer';
import EditCustomer from './EditCustomer';
import { Table, Button, Input } from 'reactstrap';


export default class Customers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: '',
            loading: false,
            message: '',
            entities: {
                    current_page: 1,
                    from: 1,
                    last_page: 1,
                    per_page: 5,
                    to: 1,
                    total: 1,
            },
            first_page: 1,
            current_page: 1,
            sorted_column: [],
            data: [],
            columns: [],
            offset: 4,
            order: 'asc',
        }

        this.cancel = '';

        this.updateCustomers = this.updateCustomers.bind(this)
        this.handleSearchChange = this.handleSearchChange.bind(this)
    }

    updateCustomers(customers) {
        this.setState(prevState => {
            let entities = Object.assign({}, prevState.entities);  // creating copy of state variable jasper
            entities.data = customers;                     // update the name property, assign a new value
            return { entities };                                 // return new object jasper object
        })
    }

    fetchEntities() {

        if( this.cancel ) {
            this.cancel.cancel();
        }

        this.cancel = axios.CancelToken.source();
        const searchUrl = `/api/customers/?page=${this.state.current_page}&search_term=${this.state.query}&column=${this.state.sorted_column}&order=${this.state.order}&per_page=${this.state.entities.per_page}`

        axios.get(searchUrl, {
            cancelToken: this.cancel.token
        })
            .then(response => {
            this.state.columns = Object.keys(response.data.data[0])
            this.setState({ entities: response.data, loading: false })
        }).catch( error => {
                if ( axios.isCancel(error) || error ) {
                    this.setState({
                        loading: false,
                        message: 'Failed to fetch the data. Please check network'
                    })
                }
            } )
    }

    handleSearchChange( event ) {

        const query = event.target.value;

        if(query.length < 3 && query.length > 0) {
            this.setState( { query, loading: false, message: '' })
            return false
        }

        this.setState( { query, loading: true, message: '' }, () => {
            this.fetchEntities();
        } );
    };

    changePage(pageNumber) {
        this.setState({ current_page: pageNumber }, () => {this.fetchEntities()});
    }

    columnHead(value) {
        return value.split('_').join(' ').toUpperCase()
    }

    pagesNumbers() {
        if (!this.state.entities.to) {
            return [];
        }
        let from = this.state.entities.current_page - this.state.offset;
        if (from < 1) {
            from = 1;
        }
        let to = from + (this.state.offset * 2);
        if (to >= this.state.entities.last_page) {
            to = this.state.entities.last_page;
        }
        let pagesArray = [];
        for (let page = from; page <= to; page++) {
            pagesArray.push(page);
        }
        return pagesArray;
    }

    componentDidMount() {
        this.setState({ current_page: this.state.entities.current_page }, () => {this.fetchEntities()});
    }

    tableHeads() {

        let icon;
        if (this.state.order === 'asc') {
            icon = <i className="fas fa-arrow-up"></i>;
        } else {
            icon = <i className="fas fa-arrow-down"></i>;
        }
        return this.state.columns.map(column => {
            return <th className="table-head" key={column} onClick={() => this.sortByColumn(column)}>
                { this.columnHead(column) }
                { icon }
            </th>
        });
    }


    userList() {
        if (this.state.entities.data && this.state.entities.data.length) {
            return this.state.entities.data.map(user => {


                const test = Object.keys(user).map((index, element) => {

                   if(index === 'address') {
                      return (
                          <React.Fragment>
                              {this.displayCustomerAddress(user[index])}
                              {/*{this.displayCustomerPhone(user[index])}*/}
                          </React.Fragment>
                      )
                    } else {
                       return (
                           <td>{user[index]}</td>
                       )
                   }
                })

                return (
                    <tr>
                        {test}
                        <td>
                            <EditCustomer
                                id={user.id}
                                action={this.updateCustomers}
                                customers={this.state.customers}
                            />
                            <Button color="danger" onClick={() => this.deleteCustomer(user.id)}>Delete</Button>

                        </td>
                    </tr>
                )

            })
        } else {
            return <tr>
                <td colSpan={this.state.columns.length} className="text-center">No Records Found.</td>
            </tr>
        }
    }

    sortByColumn(column) {
        if (column === this.state.sorted_column) {
            this.state.order === 'asc' ? this.setState({ order: 'desc', current_page: this.state.first_page }, () => {this.fetchEntities()}) : this.setState({ order: 'asc' }, () => {this.fetchEntities()});
        } else {
            this.setState({ sorted_column: column, order: 'asc', current_page: this.state.first_page }, () => {this.fetchEntities()});
        }
    }

    pageList() {
        return this.pagesNumbers().map(page => {
            return <li className={ page === this.state.entities.current_page ? 'page-item active' : 'page-item' } key={page}>
                <button className="page-link" onClick={() => this.changePage(page)}>{page}</button>
            </li>
        })
    }

    deleteCustomer(id) {
        axios.delete(`/api/customers/${id}`).then(data => {
            const index = this.state.entities.data.findIndex(customer => customer.id === id);
            const customers = this.state.entities.data.splice(index, 1);
            this.updateCustomers(customers)
        })
    }

    displayCustomerAddress(address) {

        if(!address) {
            return (<p>&nbsp</p>)
        }
        
            return(
                <React.Fragment>
                    {address.address_1}<br />
                    {address.address_2}<br />
                    {address.zip}<br />
                    {address.city}
                </React.Fragment>
            )

        return (
            <td>{addresses}</td>
        )
    }

    displayCustomerPhone(address) {

        if(!address) {
            return (<span>&nbsp</span>)
        }

        const phone = address.map(function(address){
            return(<span>{address.phone}</span>)
        })

        return (
            <td>{phone}</td>
        )
    }

    render() {

        const { query, loading, message } = this.state;
        const loader = loading ? <h2>Loading...</h2> : ''

        return (
            <div className="data-table m-md-3 m-0">

                <AddCustomer action={this.updateCustomers} customers={this.state.entities.data} />

                <div className="col-8 col-lg-6">

                    <Input
                        type="text"
                        name="query"
                        value={ query }
                        id="search-input"
                        placeholder="Search..."
                        onChange={this.handleSearchChange}
                    />

                    {/*	Error Message*/}
                    {message && <p className="message">{ message }</p>}

                    {/*	Loader*/}
                    {loader}
                </div>

                <Table className="mt-4" striped bordered hover responsive>
                    <thead>
                    <tr>
                        { this.tableHeads() }
                    <td>Action</td>
                    </tr>
                    </thead>
                    <tbody>{ this.userList() }

                    </tbody>
                </Table>
                { (this.state.entities.data && this.state.entities.data.length > 0) &&
                <nav>
                    <ul className="pagination">
                        <li className="page-item">
                            <button className="page-link"
                                    disabled={ 1 === this.state.entities.current_page }
                                    onClick={() => this.changePage(this.state.entities.current_page - 1)}
                            >
                                Previous
                            </button>
                        </li>
                        { this.pageList() }
                        <li className="page-item">
                            <button className="page-link"
                                    disabled={this.state.entities.last_page === this.state.entities.current_page}
                                    onClick={() => this.changePage(this.state.entities.current_page + 1)}
                            >
                                Next
                            </button>
                        </li>
                        <span style={{ marginTop: '8px' }}> &nbsp; <i>Displaying { this.state.entities.data.length } of { this.state.entities.total } entries.</i></span>
                    </ul>
                </nav>
                }
            </div>
        );
    }
}