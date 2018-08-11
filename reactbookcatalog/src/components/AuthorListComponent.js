import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../backend/BaseUrl';
import {getAuthStatus} from '../service/AuthenticationService';

export default class AuthorListComponent extends Component {
  constructor(props){
    super(props);
    this.state={statusCode: 401,
                message:'Unauthorized',
                authors:[],
                authed: false
              };
  }

  componentDidMount(){
    const authed = getAuthStatus().authed;
    if( authed === true) {
      this.setState({authed: true});
      const url = `${BASE_URL}/catalog/authors`;
      axios({ method:'get',
              url:url,
              data: {},
              config: {}})
            .then( response => {
              if(response.data.statusCode === 200){
                this.setState({statusCode:response.data.statusCode, message: response.data.message, authors: response.data.authors});
              }
              else {
                this.setState({statusCode:response.data.statusCode, message: response.data.message, authors: []});
              }
            })
            .catch(error => {
              console.log(error);
            });
    }

  }

  renderAuthors(){
    return this.state.authors.map(author =>{
      return (
        <tr>
          <td>{author.last_name}, {author.first_name} {author.middle_name}</td>
          <td>
            <Link to={`/author/${author._id}`}><button type='button' class='btn btn-primary'>Detail</button></Link>
          </td>
        </tr>
      );
    });
  }

  render(){
    if(this.state.authed === true && this.state.statusCode === 200){
      return (
        <div className='jumbotron jumbotron-fluid'>
          <h5>{this.state.message}</h5>
          <table className="table table-striped">
            <thead>
              <tr>
                <td>Name (Last, First Middle)</td>
                <td/>
              </tr>
            </thead>
            <tbody>
              {this.renderAuthors()}
            </tbody>
          </table>
        </div>
      );
    }
    else {
      return(
        <div className='jumbotron jumbotron-fluid'>
          <h5>{this.state.message}</h5>
        </div>
      );
    }
  }

}
