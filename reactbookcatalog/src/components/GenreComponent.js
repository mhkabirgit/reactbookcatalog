import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../backend/BaseUrl';
import {getAuthStatus} from '../service/AuthenticationService';

export default class GenreComponent extends Component {

  constructor(props){
    super(props);
    this.state = {
      genreid:props.match.params.genreid,
      genrename:'',
      statusCode: 401,
      message: 'Unauthorized',
      books:[],
      hasBooks: false,
      authed: false
    }
  }

  componentDidMount() {
    const authed = getAuthStatus().authed;
    if(authed === true) {
        this.setState({authed: true});
        const url = `${BASE_URL}/catalog/genre/detail/${this.state.genreid}`;
        axios({
          method:'get',
          url:url,
        })
        .then(response => {
          if(response.data.statusCode === 200){
            const hasBooks = response.data.books.length > 0 ? true : false;
            this.setState({
              statusCode: response.data.statusCode,
              message: response.data.message,
              genrename: response.data.genre.name,
              books: response.data.books,
              hasBooks: hasBooks
            });
          }
          else {
            this.setState({
              statusCode: response.data.statusCode,
              message: response.data.message,
            });
          }
        })
        .catch(error=> {console.log(error);
        });
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
                <td>Name</td>
                <td>Genre Books</td>
                <td> Action </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.state.genrename}</td>
                <td>
                  <table>
                    {this.renderBooks()}
                  </table>
                </td>
                <td>
                  <Link to={{pathname: `/genre/${this.state.genreid}/update/delete`,
                            state:{ genrename: `${this.state.genrename}`,
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
