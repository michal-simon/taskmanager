/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import { Input, Table, Button } from 'reactstrap'

export default class DataTable extends Component {
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
            sorted_column: this.props.defaultColumn ? this.props.defaultColumn : [],
            data: [],
            columns: [],
            offset: 4,
            order: 'asc'
        }
        this.cancel = ''
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
            this.setState({query, loading: false, message: ''})
            return false
        }

        this.setState(prevState => ({
            parameters: {
                ...prevState.parameters,
                page: 1
            },
            query: query,
            loading: true,
            message: '',
            current_page: 1
        }), () => {
            this.fetchEntities()
        })
    }

    fetchEntities () {
        if (this.cancel) {
            this.cancel.cancel()
        }

        this.cancel = axios.CancelToken.source()
        const fetchUrl = `${this.props.fetchUrl}?page=${this.state.current_page}&search_term=${this.state.query}&column=${this.state.sorted_column}&order=${this.state.order}&per_page=${this.state.entities.per_page}`

        axios.get(fetchUrl, {
            cancelToken: this.cancel.token
        })
            .then(response => {
                if(response.data && Object.keys(response.data).length) {
                    this.setState({ entities: response.data, loading: false })
                    const columns = this.props.columns && this.props.columns.length ? this.props.columns : Object.keys(response.data.data[0])
                    this.setState({ columns: columns })
                    this.props.updateState(response.data.data)
                }
            })
            .catch(error => {
                if (axios.isCancel(error) || error) {
                    console.log('error', error)
                    this.setState({
                        loading: false,
                        message: 'Failed to fetch the data. Please check network'
                    })
                }
            })
    }

     tableHeads () {
        let icon
        if (this.state.order === 'asc') {
            icon = <i className="fa fa-arrow-up"/>
        } else {
            icon = <i className="fa fa-arrow-down"/>
        }

        if (this.state.columns && this.state.columns.length) {
            return this.state.columns.map(column => {
                const sortedClass = (this.props.disableSorting && this.props.disableSorting.includes(column)) ? ('') : ((column === this.state.sorted_column) ? (`th-sm sorting_${this.state.order}`) : ('sorting_asc_disabled'))

                if (!this.props.ignore || (this.props.ignore.length && !this.props.ignore.includes(column))) {
                    return <th className={`table-head ${sortedClass} th-lg`} key={column} onClick={() => this.sortByColumn(column)}>
                        {this.columnHead(column)}
                    </th>
                }
            })
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

    reset () {
        this.setState({
            query: '',
            current_page: 1
        }, () => {
            this.fetchEntities()
        })
    }

    render () {
        const { query, loading, message } = this.state
        const loader = loading ? <h2>Loading...</h2> : ''

        return (
            <React.Fragment>
                <div className="col-4 p-0">

                    <div className="input-group">
                        <Input type="text" className="form-control" placeholder="Search..." value={query} onChange={this.handleSearchChange} />
                            <Button color="link" className="bg-transparent" style={{'marginLeft': '-40px', 'zIndex': '100', 'color': '#000'}} onClick={() => this.reset()}>
                                <i className="fa fa-times" />
                            </Button>
                    </div>

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
                        {this.props.userList()}
                    </tbody>
                </Table>
                {(this.state.entities.data && this.state.entities.data.length > 0) &&
                <nav>
                    <ul className="pagination">
                        <li className="page-item">
                            <button className="page-link"
                                disabled={this.state.entities.current_page === 1}
                                onClick={() => this.changePage(this.state.entities.current_page - 1)}>
                                Previous
                            </button>
                        </li>
                        {this.pageList()}
                        <li className="page-item">
                            <button className="page-link"
                                disabled={this.state.entities.last_page === this.state.entities.current_page}
                                onClick={() => this.changePage(this.state.entities.current_page + 1)}>
                                Next
                            </button>
                        </li>
                        <span> &nbsp;
                            <i>Displaying {this.state.entities.data.length} of {this.state.entities.total} entries.</i></span>
                    </ul>
                </nav>
                }
            </React.Fragment>
        )
    }
}
