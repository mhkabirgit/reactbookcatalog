import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import BookBaseComponent from './BookBaseComponent';

export default class BookListRowComponent extends Component {

  render() {
    return(
      <tr>
        <BookBaseComponent book={this.props.book} />
        <td>
            <Link to={{
                pathname:`/book/${this.props.book._id}`,
                book:this.props.book
                }}>
                <button type='button' class='btn btn-primary'>Detail</button>
            </Link>
        </td>
      </tr>
    );
  }

}
