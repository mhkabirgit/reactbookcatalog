import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

import {getAuthStatus} from '../service/AuthenticationService';
import BASE_URL from '../backend/BaseUrl';


export default class AuthorComponent extends Component {

  constructor(props){
    super(props);
    this.state = {
      authorid: props.match.params.authorid,
      author: {},
      books: [],
      authed: false,
      hasBooks: false,
      statusCode: 401,
      message: 'Unauthorized'
    }
  }

  componentDidMount(){
    const authed = getAuthStatus().authed;
    if(authed === true) {
      this.setState({authed:true});
      const url =`${BASE_URL}/catalog/author/detail/${this.state.authorid}`;
      axios({
        method: 'get',
        url: url,
      })
      .then((response) => {
        if(response.data.statusCode === 200) {
          const hasBooks = response.data.books.length > 0 ? true : false;
          this.setState({
            statusCode:response.data.statusCode,
            message: response.data.message,
            author: response.data.author,
            books: response.data.books,
            hasBooks: hasBooks});
        }
        else {
          this.setState({
            statusCode:response.data.statusCode,
            message: response.data.message});
        }
      })
      .catch((error) => { console.log(error)});
    }
  }

  renderBooks(){
    return this.state.books.map((book) => {
      return(
        <tr>
          <td>
          {book.title}
          </td>
        </tr> );
    });
  }

  render(){
    if(this.state.authed === true && this.state.statusCode === 200) {
      return(
        <div className='jumbotron jumbotron-fluid'>
          <h5>{this.state.message}</h5>
          <table className='table, table-stripped'>
            <thead>
              <tr>
                <td>Author</td>
                <td>Author Books</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.state.author.last_name} , {this.state.author.first_name} {this.state.author.middle_name}</td>
                <td>
                  <table>
                    {this.renderBooks()}
                  </table>
                </td>
                <td>
                  <Link to={{pathname: `/author/${this.state.authorid}/update/delete`,
                            state:{ firstname: this.state.author.first_name,
                                    middlename: this.state.author.middle_name,
                                    lastname: this.state.author.last_name,
                                    hasBooks:this.state.hasBooks}
                          }}> <button type='button' class='btn btn-danger'>Update/Delete</button>
                  </Link>
                </td>
              </tr>
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
