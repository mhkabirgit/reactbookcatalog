import React, {Component} from 'react';
import {getAuthStatus, logout} from '../service/AuthenticationService';

export default class SignoutComponent extends Component {
  constructor(props){
    super(props);
    this.state={message:''};
  }

  componentDidMount() {
    const authStatus = getAuthStatus();
    if(authStatus.authed === true){
      logout();
      this.setState({message: 'Your are signed out'});
    }
    else{
      this.setState({message: 'You are not signed in'});
    }
  }

  render(){
    return(
      <div className="jumbotron jumbotron-fluid">
          <h5>{this.state.message}</h5>
      </div>
    );
  }
}
