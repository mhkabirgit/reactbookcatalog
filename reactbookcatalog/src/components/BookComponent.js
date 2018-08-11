import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import BookBaseComponent from './BookBaseComponent';

import {getAuthStatus} from '../service/AuthenticationService';

export default class BookComponent extends Component {
  constructor(props){
    super(props);
    this.state ={
        bookid: props.match.params.bookid,
        book: props.location.book,
        authed: false
    };
  }

  componentDidMount(){
    const authed = getAuthStatus().authed;
    this.setState({authed: authed});
  }

  render(){
    if(this.state.authed === true){
        return (
          <div className='jumbotron jumbotron-fluid'>
              <h5>Book Detail</h5>
              <table className='table table-stripped'>
                <thead>
                  <tr>
                      <td>ISBN</td>
                      <td>Title</td>
                      <td>Author</td>
                      <td>Genre</td>
                      <td>Synopsis</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                      <BookBaseComponent book={this.state.book}/>
                      <td>{this.state.book.synopsis}</td>
                  </tr>
                  <tr>
                      <td>
                          <Link to={{
                            pathname:`/book/${this.state.bookid}/update/delete`,
                            book: this.state.book
                          }}><button type='button' class='btn btn-danger'>Update/Delete</button></Link>
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
            <h5>Unauthorized</h5>
        </div>
      );
    }

  }
}
