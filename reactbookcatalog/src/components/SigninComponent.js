import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {Form, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';
import {getAuthStatus, login} from '../service/AuthenticationService';

export default class SigninComponent extends Component {
  constructor(props){
    super(props);
    this.state ={
        email:'',
        password:'',
        redirect: false
      };
      this.handleChange=this.handleChange.bind(this);
      this.handleSubmit=this.handleSubmit.bind(this);
  }

  handleChange = (event) => {
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit = (event) =>{
    event.preventDefault();
    if(this.state.email && this.state.password){
        login(this.state.email, this.state.password);
        let authStatus = getAuthStatus();
        if(authStatus.authed === true){
          this.setState({redirect: true});
        }
      }
  }

  render (){
      if(this.state.redirect === true){
        return <Redirect to={'/books'}/> ;
      }
      else {
        return (
          <div className='jumbotron jumbotron-fluid'>
            <h4>Enter your email and password to login </h4>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup controlId='email'>
                <ControlLabel> Email </ControlLabel>
                <FormControl type='text'
                             value={this.state.email}
                             placeholder = 'email'
                             onChange={this.handleChange}/>
              </FormGroup>

              <FormGroup controlId='password'>
                <ControlLabel>Password</ControlLabel>
                <FormControl type='password'
                             value={this.state.password}
                             placeholder='password'
                             onChange={this.handleChange}/>
              </FormGroup>
              <Button bsStyle='primary' type='submit'> Log In</Button>
            </Form>
          </div>);
      }
  }
}
