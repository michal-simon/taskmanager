import React,{Component} from 'react'
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import EditInvoice from './EditInvoice';
import { Table } from 'reactstrap';

export default class Invoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            invoices: [],
            entities: {
                meta: {
                    current_page: 1,
                    from: 1,
                    last_page: 1,
                    per_page: 5,
                    to: 1,
                    total: 1,
                },
            },
            first_page: 1,
            current_page: 1,
            sorted_column: [],
            data: [],
            columns: ['Customer', 'Due Date', 'Total', 'Status', 'Payment Type'],
            offset: 4,
            order: 'asc',
        }

        this.updateInvoice = this.updateInvoice.bind(this);
    }

    updateInvoice(invoices) {
        this.setState({invoices: invoices})
    }

    fetchEntities() {
        axios.get(`/api/invoice`).then(response => {
            //this.state.columns = Object.keys(response.data[0])
            this.setState({ invoices: response.data })
        })
    }

    changePage(pageNumber) {
        this.setState({ current_page: pageNumber }, () => {this.fetchEntities()});
    }

    columnHead(value) {
        return value.split('_').join(' ').toUpperCase()
    }

    pagesNumbers() {
        if (!this.state.entities.meta.to) {
            return [];
        }
        let from = this.state.entities.meta.current_page - this.state.offset;
        if (from < 1) {
            from = 1;
        }
        let to = from + (this.state.offset * 2);
        if (to >= this.state.entities.meta.last_page) {
            to = this.state.entities.meta.last_page;
        }
        let pagesArray = [];
        for (let page = from; page <= to; page++) {
            pagesArray.push(page);
        }
        return pagesArray;
    }

    componentDidMount() {
        this.setState({ current_page: this.state.entities.meta.current_page }, () => {this.fetchEntities()});
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
                {icon}
                { column === this.state.sorted_column && icon }
            </th>
        });
    }


    userList() {

        if (this.state.invoices && this.state.invoices.length) {

            return this.state.invoices.map(user => {

                return (
                    <tr>
                        <td>{user.first_name + ' ' + user.last_name}</td>
                        <td>{user.due_date}</td>
                        <td>{user.total}</td>
                        <td>{user.invoice_status}</td>
                        <td>Credit</td>
                        <td><EditInvoice
                            add={true}
                            invoice_id={user.id}
                            action={this.updateInvoice}
                            invoices={this.state.invoices}
                        /></td>
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
            return <li className={ page === this.state.entities.meta.current_page ? 'page-item active' : 'page-item' } key={page}>
                <button className="page-link" onClick={() => this.changePage(page)}>{page}</button>
            </li>
        })
    }

    deleteCustomer(id) {
        axios.delete(`/api/customers/${id}`).then(data => {
            const index = this.state.invoices.findIndex(invoice => invoice.id === id);
            const invoices = this.state.invoices.splice(index, 1);
            this.setState({ invoice: invoices });
        })
    }


    render() {
        return (
            <div className="data-table">

                <EditInvoice
                    add={false}
                    action={this.updateInvoice}
                    invoices={this.state.invoices}
                />

                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        { this.tableHeads() }
                        <td>Action</td>
                    </tr>
                    </thead>
                    <tbody>{ this.userList() }

                    </tbody>
                </Table>
                { (this.state.invoices && this.state.invoices.length > 0) &&
                <nav>
                    <ul className="pagination">
                        <li className="page-item">
                            <button className="page-link"
                                    disabled={ 1 === this.state.entities.meta.current_page }
                                    onClick={() => this.changePage(this.state.entities.meta.current_page - 1)}
                            >
                                Previous
                            </button>
                        </li>
                        { this.pageList() }
                        <li className="page-item">
                            <button className="page-link"
                                    disabled={this.state.entities.meta.last_page === this.state.entities.meta.current_page}
                                    onClick={() => this.changePage(this.state.entities.meta.current_page + 1)}
                            >
                                Next
                            </button>
                        </li>
                        <span style={{ marginTop: '8px' }}> &nbsp; <i>Displaying { this.state.invoices.length } of { this.state.entities.meta.total } entries.</i></span>
                    </ul>
                </nav>
                }
            </div>
        );
    }
}