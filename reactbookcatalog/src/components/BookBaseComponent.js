import React, {Component} from 'react';
import {Link} from 'react-router-dom';
// import {Link} from 'react-router-dom';

export default class BookBaseComponent extends Component {

genres(){
  return this.props.book.genre.map(g => {
    return <Link to={`/genre/${g._id}`}><button type='button' class='btn btn-primary'>{g.name}</button></Link>
});
}
  render() {
    return (
      <div>
        <td>{this.props.book.isbn}</td>
        <td> {this.props.book.title} </td>
        <td><Link to={`/author/${this.props.book.author._id}`}>
            <button type='button' class='btn btn-primary'>{this.props.book.author.first_name} {this.props.book.author.last_name}</button>
            </Link>
        </td>
        <td> {this.genres()}</td>
      </div>
    );
  }

}
