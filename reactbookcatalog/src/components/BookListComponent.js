import React, {Component} from 'react';
import axios from 'axios';
import BookListRowComponent from './BookListRowComponent';
import BASE_URL from '../backend/BaseUrl';
import {getAuthStatus} from '../service/AuthenticationService';


export default class BookListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusCode:401,
      message:'Unauthorized',
      books:[]
    };
  }

  componentDidMount() {
      const authed = getAuthStatus().authed;
      if( authed === true) {
        this.setState({authed:true});
        const url = `${BASE_URL}/catalog/books`;
        axios({ method: 'get',
                url: url,
                data: {},
                config: { headers: {'Content-Type': 'application/json' },
                          withCredentials: true}
        })
        .then(response => {
            if(response.data.statusCode===200){
              this.setState({statusCode:response.data.statusCode, message: response.data.message, books:response.data.books});
            }
            else{
              this.setState({statusCode:response.data.statusCode, message:response.data.message , books:[]});
            }
        })
        .catch(error => {console.log(error)});
      }
  }

  bookTableRows() {
    return this.state.books.map((book, i) => {
        return <BookListRowComponent book={book} key={i} />;
      }
    );
  }

  render(){
    if(this.state.authed === true && this.state.statusCode===200){
    return (
        <div className="jumbotron jumbotron-fluid">
            <h5>{this.state.message}</h5>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <td>ISBN</td>
                    <td>Title</td>
                    <td>Author</td>
                    <td>Genre</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {this.bookTableRows()}
                </tbody>
              </table>
        </div>
      );
    }
    else {
      return(
      <div className="jumbotron jumbotron-fluid">
          <h5>{this.state.message}</h5>
      </div>
    );
    }
  }
}
