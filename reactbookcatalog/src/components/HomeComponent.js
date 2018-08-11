import React, {Component} from 'react';
import axios from 'axios';

import BASE_URL from '../backend/BaseUrl';

export default class HomeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusCode:500,
      message:'Internal Error',
      books:[]
    };
  }

  componentDidMount() {
    const url =`${BASE_URL}`;
      axios({ method: 'get',
              url: url,
              data: {},
              config: { headers: {'Content-Type': 'application/json' },
              withCredentials: false}
      })
      .then((response) => {
        this.setState({statusCode:response.data.statusCode, message: response.data.message, books:response.data.books})
      })
      .catch((error) => {console.log(error)});
  }

  bookTableRows() {
    return this.state.books.map((book, i) => {
        return (<tr>
                  <td>{book.title} : {book.author.last_name}, {book.author.first_name} {book.author.middle_name}</td>
                </tr>);
          });
  }

  render() {
    if(this.state.statusCode===200){
    return (
        <div className="jumbotron jumbotron-fluid">
            <h5>{this.state.message}</h5>
              <table className="table table-striped">
                <tbody>
                  {this.bookTableRows()}
                </tbody>
              </table>
        </div>
      );
    }
    else {
      return (
      <div className="jumbotron jumbotron-fluid">
          <h5>{this.state.message}</h5>
      </div>
    );
    }
  }
}
