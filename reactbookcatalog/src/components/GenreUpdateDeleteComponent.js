import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import {Form, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';

import {getAuthStatus} from '../service/AuthenticationService';

import BASE_URL from '../backend/BaseUrl';

export default class GenreUpdateDeleteComponent extends Component {

  constructor(props){
    super(props);
    this.state = {
      genreid: props.match.params.genreid,
      genrename: props.location.state.genrename,
      hasBooks: props.location.state.hasBooks,
      redirect: false,
      authed: false,
      isAdmin: false,
      message:'Unauthorized'
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
    const url = `${BASE_URL}/catalog/genre/detail/${this.state.genreid}/update`;
    axios({
      method:'post',
      url: url,
      data: {id:this.state.genreid, name:this.state.genrename}
    })
    .then((response) => {
      if(response.data.statusCode === 200) {
        this.setState({redirect: true, message: response.data.message});
      }
    })
    .catch((error) =>{console.log(error)});
  }

  handleClick = (event) => {
    if(this.state.hasBooks === true) {
      alert('This genre has books, cannot be deleted');
    }
    else{
      const url = `${BASE_URL}/catalog/genre/detail/${this.state.genreid}/delete`;
      axios({
        method: 'post',
        url: url,
      })
      .then((response) => {
        alert(response.data.message);
        this.setState({redirect: true, message: response.data.message});
      })
      .catch(error => {console.log(error)});
    }
  }

  render() {
      if(this.state.redirect === true){
        return (
                <Redirect to={'/genres'} />
               );
      }
      else if(this.state.authed === true && this.state.isAdmin === true) {
        return (
          <div className='jumbotron jumbotron-fluid'>
            <h5>Update Genre</h5>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup controlId='genreid'>
                  <FormControl componentClass= 'hidden' value={this.state.genreid} />
              </FormGroup>
              <FormGroup controlId ='genrename'>
                <ControlLabel>Name</ControlLabel>
                <FormControl type='text' value={this.state.genrename} onChange={this.handleChange} />
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
