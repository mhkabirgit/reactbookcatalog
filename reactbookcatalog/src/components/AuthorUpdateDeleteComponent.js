import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import {Form, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';

import {getAuthStatus} from '../service/AuthenticationService';

import BASE_URL from '../backend/BaseUrl';

export default class AuthorUpdateDeleteComponent extends Component {

  constructor(props){
    super(props);
    this.state = {
      authorid: props.match.params.authorid,
      firstname: props.location.state.firstname,
      middlename: props.location.state.middlename,
      lastname: props.location.state.lastname,
      hasBooks: props.location.state.hasBooks,
      redirect: false,
      authed: false,
      isAdmin: false,
      message: 'Unauthorized'
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){
    const authStatus = getAuthStatus();
    this.setState({authed: authStatus.authed, isAdmin: authStatus.isAdmin});
  }

  handleChange = (event) => {
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit = (event) =>{
    event.preventDefault();
    const url = `${BASE_URL}/catalog/author/detail/${this.state.authorid}/update`;
    axios({
      method:'post',
      url: url,
      data: {id:this.state.authorid,
            first_name:this.state.firstname,
            middle_name: this.state.middlename,
            last_name: this.state.lastname}
    })
    .then((response) => {
      if(response.data.statusCode === 200) {
        this.setState({redirect: true});
      }
    })
    .catch((error) =>{console.log(error)});
  }

  handleClick = (event) => {
    if(this.state.hasBooks === true) {
      alert('This author has books, cannot be deleted');
    }
    else{
      const url = `${BASE_URL}/catalog/author/detail/${this.state.authorid}/delete`;
      axios({
        method: 'post',
        url: url,
      })
      .then((response) => {
        alert(response.data.message);
        this.setState({redirect: true});
      })
      .catch(error => {console.log(error)});
    }
  }

  render() {
      if(this.state.redirect === true){
        return (
                <Redirect to={'/authors'} />
               );
      }
      else if(this.state.authed === true && this.state.isAdmin === true) {
        return (
          <div className='jumbotron jumbotron-fluid'>
            <h5>Update Author</h5>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup controlId='authorid'>
                  <FormControl componentClass= 'hidden' value={this.state.authorid} />
              </FormGroup>
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
              <Button type='submit' bsStyle='primary'>Update</Button>
              <Button type='button' bsStyle='danger' onClick ={this.handleClick}>Delete</Button>
            </Form>
          </div>
        );
      }
      else {
        return (
          <div className='jumbotron jumbotron-fluid'>
            <h5>{this.state.message}</h5>
          </div>
        );
      }
  }
}
