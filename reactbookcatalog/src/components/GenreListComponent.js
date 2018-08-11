import React, {Component}  from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../backend/BaseUrl';

import {getAuthStatus} from '../service/AuthenticationService';

export default class GenreListComponent extends Component {

  constructor(props){
    super(props);
    this.state={
      statusCode: 401,
      message:'Unauthorized',
      genres:[],
      authed: false
    }
  }

  componentDidMount(){
    const authed = getAuthStatus().authed;
    if(authed === true) {
      this.setState({authed: true});
      const url = `${BASE_URL}/catalog/genres`;
      axios({
        method: 'get',
        url: url
      })
      .then(response => {
        if(response.data.statusCode === 200){
          this.setState({
            statusCode: response.data.statusCode,
            message: response.data.message,
            genres: response.data.genres
            })
        }
        else{
          this.setState({
            statusCode: response.data.statusCode,
            message: response.data.message,
            genres: []
            })
        }
      })
      .catch(error => {
        console.log(error);
      });
    }

  }

  renderGenres(){
    return this.state.genres.map(genre =>{
      return (
        <tr>
          <td>{genre.name}</td>
          <td>
            <Link to={`/genre/${genre._id}`}><button type='button' class='btn btn-primary'>Detail</button></Link>
          </td>
        </tr>
      );
    });
  }

  render(){
    if(this.state.authed === true && this.state.statusCode === 200 ){
      return (
          <div className='jumbotron jumbotron-fluid'>
          <h5>{this.state.message}</h5>
            <table className='table table-striped'>
              <thead>
                <tr>
                  <td> Name</td>
                  <td> Action</td>
                </tr>
              </thead>
              <tbody>
                {this.renderGenres()}
              </tbody>
            </table>
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
