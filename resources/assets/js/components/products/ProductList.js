/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import EditProduct from './EditProduct'
import AddProduct from './AddProduct'
import { Button, Input, Table } from 'reactstrap'

export default class ProductList extends Component {
    constructor (props) {
        super(props)
        this.state = {
            query: '',
            message: '',
            loading: false,
            entities: {
                current_page: 1,
                from: 1,
                last_page: 1,
                per_page: 5,
                to: 1,
                total: 1,
                data: []
            },
            first_page: 1,
            current_page: 1,
            sorted_column: [],
            data: [],
            columns: [],
            offset: 4,
            order: 'asc'
        }
        this.cancel = ''
        this.addProductToState = this.addProductToState.bind(this)
        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.setPage = this.setPage.bind(this)
    }

    componentDidMount () {
        this.setPage()
    }

    pagesNumbers () {
        if (!this.state.entities.to) {
            return []
        }
        let from = this.state.entities.current_page - this.state.offset
        if (from < 1) {
            from = 1
        }
        let to = from + (this.state.offset * 2)
        if (to >= this.state.entities.last_page) {
            to = this.state.entities.last_page
        }
        const pagesArray = []
        for (let page = from; page <= to; page++) {
            pagesArray.push(page)
        }
        return pagesArray
    }

    setPage () {
        this.setState({ current_page: this.state.entities.current_page }, () => {
            this.fetchEntities()
        })
    }

    columnHead (value) {
        return value.split('_').join(' ').toUpperCase()
    }

    changePage (pageNumber) {
        this.setState({ current_page: pageNumber }, () => {
            this.fetchEntities()
        })
    }

    handleSearchChange (event) {
        const query = event.target.value
        if (query.length < 3 && query.length > 0) {
            this.setState({ query, loading: false, message: '' })
            return false
        }
        this.setState({ query, loading: true, message: '' }, () => {
            this.fetchEntities()
        })
    }

    fetchEntities () {
        const fetchUrl = `/api/products/?page=${this.state.current_page}&search_term=${this.state.query}&column=${this.state.sorted_column}&order=${this.state.order}&per_page=${this.state.entities.per_page}`
        if (this.cancel) {
            this.cancel.cancel()
        }
        this.cancel = axios.CancelToken.source()
        axios.get(fetchUrl, {
            cancelToken: this.cancel.token
        })
            .then(response => {
                this.setState({ entities: response.data, loading: false, columns: Object.keys(response.data.data[0]) })
            })
            .catch(error => {
                if (axios.isCancel(error) || error) {
                    this.setState({
                        loading: false,
                        message: 'Failed to fetch the data. Please check network'
                    })
                }
            })
    }

    addProductToState (products) {
        this.setState(prevState => {
            const entities = Object.assign({}, prevState.entities)
            entities.data = products
            return { entities }
        })
    }

    tableHeads () {
        let icon
        if (this.state.order === 'asc') {
            icon = <i className="fas fa-arrow-up" />
        } else {
            icon = <i className="fas fa-arrow-down" />
        }
        return this.state.columns.map(column => {
            return <th className="table-head" key={column} onClick={() => this.sortByColumn(column)}>
                {this.columnHead(column)}
                {icon}
            </th>
        })
    }

    userList () {
        if (this.state.entities.data && this.state.entities.data.length) {
            return this.state.entities.data.map(product => {
                const columnList = this.state.columns.map(key => {
                    return <td key={key}>{product[key]}</td>
                })
                return <tr key={product.id}>

                    {columnList}

                    <td>
                        <Button color="danger" onClick={() => this.deleteProduct(product.id)}>Delete</Button>
                        <EditProduct product={product} products={this.state.entities.data} action={this.addProductToState}/>
                    </td>
                </tr>
            })
        } else {
            return <tr>
                <td colSpan={this.state.columns.length} className="text-center">No Records Found.</td>
            </tr>
        }
    }

    sortByColumn (column) {
        if (column === this.state.sorted_column) {
            this.state.order === 'asc' ? this.setState({ order: 'desc', current_page: this.state.first_page }, () => {
                this.fetchEntities()
            }) : this.setState({ order: 'asc' }, () => {
                this.fetchEntities()
            })
        } else {
            this.setState({ sorted_column: column, order: 'asc', current_page: this.state.first_page }, () => {
                this.fetchEntities()
            })
        }
    }

    pageList () {
        return this.pagesNumbers().map(page => {
            return <li className={page === this.state.entities.current_page ? 'page-item active' : 'page-item'}
                key={page}>
                <button className="page-link" onClick={() => this.changePage(page)}>{page}</button>
            </li>
        })
    }

    deleteProduct (id) {
        const self = this
        axios.delete('/api/products/' + id)
            .then(function (response) {
                const arrProducts = [...self.state.entities.data]
                const index = arrProducts.findIndex(product => product.id === id)
                arrProducts.splice(index, 1)
                self.addProductToState(arrProducts)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    render () {
        const { query, loading, message } = this.state
        const loader = loading ? <h2>Loading...</h2> : ''

        return (
            <div className="data-table m-md-3 m-0">

                <AddProduct products={this.state.entities.data} action={this.addProductToState}/>

                <div className="col-8 col-lg-6">

                    <Input
                        type="text"
                        name="query"
                        value={query}
                        id="search-input"
                        placeholder="Search..."
                        onChange={this.handleSearchChange}
                    />

                    {message && <p className="message">{message}</p>}

                    {loader}
                </div>

                <Table className="mt-4" striped bordered hover responsive>
                    <thead>
                        <tr>
                            {this.tableHeads()}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.userList()}
                    </tbody>
                </Table>
                {(this.state.entities.data && this.state.entities.data.length > 0) &&
                <nav>
                    <ul className="pagination">
                        <li className="page-item">
                            <button className="page-link"
                                disabled={this.state.entities.current_page === 1}
                                onClick={() => this.changePage(this.state.entities.current_page - 1)}
                            >
                                Previous
                            </button>
                        </li>
                        {this.pageList()}
                        <li className="page-item">
                            <button className="page-link"
                                disabled={this.state.entities.last_page === this.state.entities.current_page}
                                onClick={() => this.changePage(this.state.entities.current_page + 1)}
                            >
                                Next
                            </button>
                        </li>
                        <span> &nbsp;
                            <i>Displaying {this.state.entities.data.length} of {this.state.entities.total} entries.</i></span>
                    </ul>
                </nav>
                }
            </div>
        )
    }
}
