import React, {Component} from 'react';
import validator from 'validator';
import {Redirect} from 'react-router-dom';
import axios from 'axios';
import {Form, FormGroup, ControlLabel, FormControl, Button, HelpBlock} from 'react-bootstrap';
import BASE_URL from '../backend/BaseUrl';

export default class SignupComponent extends Component {

  constructor(props){
    super(props);
    this.state = {
      username:'',
      email:'',
      password:'',
      passwordcnf:'',
      hasError: false,
      redirect: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getValidated = this.getValidated.bind(this);
    this.isValidUsername = this.isValidUsername.bind(this);
    this.isEmailValid = this.isEmailValid.bind(this);
    this.isValidPaasword = this.isValidPaasword.bind(this);
    this.isPasswordConfirmed = this.isPasswordConfirmed.bind(this);
  }

  handleChange(event){
    this.setState({[event.target.id]: event.target.value});
  }

  handleSubmit(event){
    event.preventDefault();

    if(this.getValidated() === 'success'){
      const url = `${BASE_URL}/users/signup`;
      axios({
        method: 'post',
        url: url,
        data: { username: this.state.username,
                email: this.state.email,
                password: this.state.password,
                passwordcnf: this.state.passwordcnf},
        config: {headers: {'Content-Type': 'application/json'}, withCredentials: false}
      })
      .then( (response) => {
        if(response.data.statusCode === 200){
          this.setState({redirect:true});
        }
        else {
          alert(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      })
    }
  }

  getValidated(){
    let errors = [];
    let hasError = false;
    if (validator.isLength(this.state.username, {min:3, max:25}) === false) {
      errors.push('Username must be 3 to 25 characters long');
      hasError = true;
    }
    if(validator.isEmail(this.state.email) === false ) {
      errors.push('Must enter a valid email address');
      hasError = true;
    }
    if(validator.isLength(this.state.password, {min:6, max:25}) === false){
      errors.push('Password must be 6 to 25 characters long');
      hasError = true;
    }
    if(validator.equals(this.state.passwordcnf,this.state.password) === false){
      errors.push('Passwords did not match');
      hasError=true;
    }
    this.setState({hasError: hasError});
    if(hasError){
      alert(JSON.stringify(errors));
      return 'error';
    }
    else {
      return 'success'
    }
  }

  isValidUsername(){
    if(validator.isLength(this.state.username, {min:3, max:25})){
      return 'success';
    }
    else {
      return 'error';
    }
  }

  isEmailValid() {
    if(validator.isEmail(this.state.email)) {
      return 'success';
    }
    else {
      return 'error';
    }
  }

  isValidPaasword(){
    if(validator.isLength(this.state.password, {min:6, max:25})){
      return 'success';
    }
    else {
      return 'error';
    }
  }

  isPasswordConfirmed() {
     if(validator.equals(this.state.passwordcnf,this.state.password)) {
       return 'success';
     }
     else {
       return 'error';
     }
  }

  render() {
    if(this.state.redirect === true) {
      return <Redirect to={'/'}/>;
    }
    else {
      return(
        <div className='jumbotron jumbotron-fluid'>
          <h5>Sign Up</h5>
          <Form onSubmit ={this.handleSubmit}>
            <FormGroup controlId='username' validationState={this.isValidUsername()}>
              <ControlLabel>Username</ControlLabel>
              <FormControl type='text' value={this.state.username} placeholder='username' onChange={this.handleChange}/>
              <HelpBlock>Username must be 3 to 25 characters long</HelpBlock>
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId='email' validationState = {this.isEmailValid()}>
              <ControlLabel>Email</ControlLabel>
              <FormControl type='text' value={this.state.email} placeholder='email@domain.com' onChange={this.handleChange}/>
              <HelpBlock>Must enter a valid email address</HelpBlock>
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId='password' validationState= {this.isValidPaasword()}>
              <ControlLabel>Password </ControlLabel>
              <FormControl type='password' value={this.state.password} onChange={this.handleChange}/>
              <HelpBlock>Password must be 6 to 25 characters long</HelpBlock>
              <FormControl.Feedback />
            </FormGroup>
            <FormGroup controlId='passwordcnf' validationState = {this.isPasswordConfirmed()}>
              <ControlLabel>Confirm Password </ControlLabel>
              <FormControl type='password' value={this.state.passwordcnf} onChange={this.handleChange}/>
              <HelpBlock>Both passwords must match</HelpBlock>
              <FormControl.Feedback />
            </FormGroup>
            <Button type='submit' bsStyle='primary'>Sign Up</Button>
          </Form>
        </div>
      );
    }
  }
}
