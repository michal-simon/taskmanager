/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import axios from 'axios'
import EditBrand from './EditBrand'
import AddBrand from './AddBrand'
import { Button } from 'reactstrap'
import DataTable from '../common/DataTable'

export default class Brands extends Component {
    constructor (props) {
        super(props)

        this.state = {
            categories: [],
            errors: []
        }

        this.addUserToState = this.addUserToState.bind(this)
        this.userList = this.userList.bind(this)
    }

    componentDidMount () {
        this.getUsers()
    }

    addUserToState (categories) {
        this.setState({ categories: categories })
    }

    userList () {
        if (this.state.categories && this.state.categories.length) {
            return this.state.categories.map(category => {
                const columnList = Object.keys(category).map(key => {
                    return <td key={key}>{category[key]}</td>
                })
                return <tr key={category.id}>

                    {columnList}

                    <td>
                        <Button color="danger" onClick={() => this.deleteCategory(category.id)}>Delete</Button>
                        <EditCategory
                            users={this.state.users}
                            category={category}
                            categories={this.state.categories}
                            action={this.addUserToState}
                        />
                    </td>
                </tr>
            })
        } else {
            return <tr>
                <td className="text-center">No Records Found.</td>
            </tr>
        }
    }

    deleteCategory (id) {
        const self = this
        axios.delete('/api/categories/' + id)
            .then(function (response) {
                const arrCategories = [...self.state.categories]
                const index = arrCategories.findIndex(category => category.id === id)
                arrCategories.splice(index, 1)
                self.addUserToState(arrCategories)
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    getUsers () {
        axios.get('api/users')
            .then((r) => {
                this.setState({
                    users: r.data
                })
            })
            .catch((e) => {
                this.setState({
                    loading: false,
                    err: e
                })
            })
    }

    render () {
        const fetchUrl = '/api/categories/'

        return (
            <div className="data-table m-md-3 m-0">

                <AddCategory users={this.state.users} categories={this.state.categories} action={this.addUserToState}/>

                <DataTable
                    userList={this.userList}
                    fetchUrl={fetchUrl}
                    updateState={this.addUserToState}
                />
            </div>
        )
    }
}
