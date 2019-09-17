import React, { Component } from 'react';
import axios from 'axios'
import EditUser from './EditUser'
import AddUser from '../forms/AddUser'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,Input,FormGroup,Label, Table } from 'reactstrap';

export default class DataTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
    };

    this.updateUserState = this.updateUserState.bind(this);
    this.addUserToState = this.addUserToState.bind(this);
  }

  addUserToState(users) {

    console.log('users', users)

    this.setState(prevState => {
      let entities = Object.assign({}, prevState.entities);  // creating copy of state variable jasper
      entities.data = users;                     // update the name property, assign a new value
      return { entities };                                 // return new object jasper object
    })
  }

  fetchEntities() {

    let fetchUrl = `/api/users/?page=${this.state.current_page}&column=${this.state.sorted_column}&order=${this.state.order}&per_page=${this.state.entities.per_page}`;
    axios.get(fetchUrl)
      .then(response => {
        this.state.columns = Object.keys(response.data.data[0])
        this.setState({ entities: response.data })
      })
      .catch(e => {
        console.error(e);
      });
  }

  changePage(pageNumber) {
    this.setState({ current_page: pageNumber }, () => {this.fetchEntities()});
  }

  columnHead(value) {
    return value.split('_').join(' ').toUpperCase()
  }

  updateUserState(user) {
    this.addUserToState(user)
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


        const columnList = Object.keys(user).map(key => {

          if(key === 'profile_photo') {
            return <td>&nbsp;</td>
          }

          return <td key={key}>{user[key]}</td>
        })


        return <tr key={ user.id }>

          {columnList}

          <td>
            <i id="delete" className="fas fa-times" onClick={() => this.deleteUser(user.id)}></i>
            <EditUser user={user} users={this.state.entities.data} action={this.updateUserState} />
          </td>
        </tr>
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
  
    deleteUser(id) {

        const self = this;

       axios.delete('/api/users/' + id)
       .then(function (response) {
         const index = self.state.entities.data.findIndex(user => user.id === id);
         const users = self.state.entities.data.splice(index, 1);
         self.addUserToState(users)
        })
        .catch(function (error) {
            console.log(error);
        });
    }

  render() {

    const divStyle = {
      margin: '10px'
    };

    return (
      <div className="data-table" style={divStyle}>

        <AddUser users={this.state.entities.data} action={this.addUserToState} />
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              { this.tableHeads() }
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{ this.userList() }</tbody>
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