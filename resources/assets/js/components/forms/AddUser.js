import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,Input,FormGroup,Label } from 'reactstrap';
import axios from 'axios'

class AddUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          modal: false,
          username:'',
          email:'',
          first_name:'',
          last_name:'',
          profile_photo:'5af1921c0fe5703dd4a463ec',
          loading:false,
          errors: []
        };
        
        this.toggle = this.toggle.bind(this);
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
    }

    handleChange(event) {
        this.setState({ name: event.target.value });
    }

    handleInput(e) {
        this.setState({
          [e.target.name]: e.target.value
        })
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

    handleClick() {
        axios.post('/api/users', {
          username:this.state.username,
          email:this.state.email,
          first_name:this.state.first_name,
          last_name:this.state.last_name,
          profile_photo:this.state.profile_photo
        })
        .then((response)=> {
          if(response.data.message)
            alert(response.data.message)
          else{
            this.toggle();
            this.setState({
              username:null,
              email: null,
              first_name:null,
              last_name:null,
              profile_photo:null,
              loading:false
            })
          }
        })
        .catch((error)=> {
            this.setState({
                errors: error.response.data.errors
            })
        });
    }

    toggle() {
        this.setState({
          modal: !this.state.modal
        });
    }

    render() {

        return (
          <div>
            <i className="fas fa-user-plus" onClick={this.toggle}></i>
            <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
              <ModalHeader toggle={this.toggle}>
              <i className="fas fa-user-circle"></i> Add User
              </ModalHeader>
              <ModalBody>
                  <FormGroup>
                      <Label for="username">Username(*):</Label>
                      <Input className={this.hasErrorFor('username') ? 'is-invalid' : ''} type="text" name="username" onChange={this.handleInput.bind(this)}/>
                      {this.renderErrorFor('username')}
                  </FormGroup>

                  <FormGroup>
                      <Label for="email">Email(*):</Label>
                      <Input className={this.hasErrorFor('email') ? 'is-invalid' : ''} type="email" name="email" onChange={this.handleInput.bind(this)}/>
                      {this.renderErrorFor('email')}
                  </FormGroup>

                  <FormGroup>
                      <Label for="first_name">Name(*):</Label>
                      <Input className={this.hasErrorFor('first_name') ? 'is-invalid' : ''} type="text" name="first_name" onChange={this.handleInput.bind(this)}/>
                      {this.renderErrorFor('first_name')}
                  </FormGroup>

                  <FormGroup>
                      <Label for="last_name">Last Name(*):</Label>
                      <Input className={this.hasErrorFor('last_name') ? 'is-invalid' : ''} type="text" name="last_name" onChange={this.handleInput.bind(this)}/>
                      {this.renderErrorFor('last_name')}
                  </FormGroup>

                  <FormGroup>
                      <Label for="profile_photo">Profile Photo URL(*):</Label>
                      <Input className={this.hasErrorFor('profile_photo') ? 'is-invalid' : ''} type="text" name="profile_photo" onChange={this.handleInput.bind(this)}/>
                      {this.renderErrorFor('profile_photo')}
                  </FormGroup>
              </ModalBody>

              <ModalFooter>
                <Button color="primary" onClick={this.handleClick.bind(this)}><i className="fas fa-plus-circle"></i> Add</Button>
                <Button color="secondary" onClick={this.toggle}><i className="fas fa-times-circle"></i> Close</Button>
              </ModalFooter>
            </Modal>
          </div>
        );
    }
}

export default AddUser;