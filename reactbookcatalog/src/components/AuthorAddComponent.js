import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import {Form, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';

import {getAuthStatus} from '../service/AuthenticationService';

import BASE_URL from '../backend/BaseUrl';

export default class AuthorAddComponent extends Component {

  constructor(props){
    super(props);
    this.state = {
      firstname: '',
      middlename: '',
      lastname: '',
      redirect: false,
      authed: false,
      isAdmin: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    const authStatus = getAuthStatus();
    this.setState({authed:authStatus.authed, isAdmin: authStatus.isAdmin});
  }

  handleChange = (event) => {
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit = (event) =>{
    event.preventDefault();
    const url = `${BASE_URL}/catalog/author/create`;
    axios({
      method:'post',
      url: url,
      data: { first_name:this.state.firstname,
              middle_name: this.state.middlename,
              last_name: this.state.lastname}
    })
    .then((response) => {
      if(response.data.statusCode === 200) {
        this.setState({redirect: true});
      }
      else {
        alert(response.data.message);
      }
    })
    .catch((error) =>{console.log(error)});
  }

  render() {
      if(this.state.redirect === true){
        return (
                <Redirect to={'/authors'} />
               );
      }
      else if (this.state.authed === true && this.state.isAdmin === true){
        return (
          <div className='jumbotron jumbotron-fluid'>
            <h5>Add Author</h5>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup controlId ='firstname'>
                <ControlLabel>First Name</ControlLabel>
                <FormControl type='text' value={this.state.firstname} onChange={this.handleChange} />
              </FormGroup>
              <FormGroup controlId ='middlename'>
                <ControlLabel>Middle Name</ControlLabel>
                <FormControl type='text' value={this.state.middlename} onChange={this.handleChange} />
              </FormGroup>
              <FormGroup controlId ='lastname'>
                <ControlLabel>Last Name</ControlLabel>
                <FormControl type='text' value={this.state.lastname} onChange={this.handleChange} />
              </FormGroup>
              <Button type='submit' bsStyle='primary'>Add</Button>
            </Form>
          </div>
        );
      }

      else {
        return (
          <div className='jumbotron jumbotron-fluid'>
            <h5>Unauthorized</h5>
          </div>
        );
      }
  }
}
