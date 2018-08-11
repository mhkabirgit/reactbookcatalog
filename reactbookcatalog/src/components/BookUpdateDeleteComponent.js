import React, {Component} from 'react';
import {Form, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';

import axios from 'axios';
import BASE_URL from '../backend/BaseUrl';

import {getAuthStatus} from '../service/AuthenticationService';

export default class BookUpdateDeleteComponent extends Component {

  constructor(props){
    super(props);
    const authStatus = getAuthStatus();
    let book = props.location.book;
    this.state ={
      bookid: props.match.params.bookid,
      book: book,
      bookIsbn: book.isbn,
      bookTitle: book.title,
      bookAuthorId:'',
      bookGenreIds: [],
      bookSynopsis: book.synopsis,
      authors:[],
      genres: [],
      authed: authStatus.authed,
      isAdmin: authStatus.isAdmin,
      redirect: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleGenreChange = this.handleGenreChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick =this.handleClick.bind(this);
  }

  componentDidMount(){
    if(this.state.authed === true && this.state.isAdmin === true) {
      const url =`${BASE_URL}/catalog/authors/and/genres`;
      axios({
        method:'get',
        url:url
      })
      .then ((response) => {
        if(response.data.statusCode === 200){
          let authors = response.data.authors;
          let genres = response.data.genres;
          let bookAuthor = this.state.book.author;
          let bookGenres = this.state.book.genre;

          let authorIds = authors.map((author) => {return author._id});
          let bookAuthorId =authorIds.indexOf(bookAuthor._id);
          authors[bookAuthorId].selected='true';

          let bookGenreIds =[];
          let genreIds = genres.map((genre) => {return genre._id});
          for(let i=0; i<bookGenres.length; i++) {
            let gIndex = genreIds.indexOf(bookGenres[i]._id);
            genres[gIndex].selected='true';
            bookGenreIds.push(gIndex);
          }
          this.setState({bookAuthorId: bookAuthorId, bookGenreIds: bookGenreIds, authors:authors, genres: genres});
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }

  handleChange(event) {
    this.setState({[event.target.id]: event.target.value});
  }

  handleGenreChange(event) {
    let options =event.target.options;
    var selected = [];
    for(var i=0; i<options.length; i++){
      if(options[i].selected){
        selected.push(options[i].value);
      }
    }
    this.setState({[event.target.id]:selected});
  }

  handleSubmit(event) {
    event.preventDefault();
    let isbn = this.state.bookIsbn;
    let title = this.state.bookTitle;
    let sAuthor = this.state.authors[this.state.bookAuthorId];

    let sGenres= [];
    let genreIds = this.state.bookGenreIds;
    let genres = this.state.genres;
    for(let j=0; j<genreIds.length; j++){
        sGenres.push(genres[genreIds[j]]);
    }

    let synopsis = this.state.bookSynopsis;

    let data ={isbn:isbn, title:title, author:sAuthor, genre: sGenres, synopsis:synopsis};
    let url =`${BASE_URL}/catalog//book/detail/${this.state.bookid}/update`;
    axios({
      method:'post',
      url:url,
      data:data
    })
    .then((response) => {
        if(response.data.statusCode === 200) {
          this.setState({redirect: true});
        }
    })
    .catch((error) => {});
  }

  handleClick(){
    let url =`${BASE_URL}/catalog//book/detail/${this.state.bookid}/delete`;
    axios({
      method:'post',
      url:url
    })
    .then((response) => {
        if(response.data.statusCode === 200) {
          this.setState({redirect: true});
        }
    })
    .catch((error) => {});
  }

  authorOptions(){
    return this.state.authors.map((author, i) => {
      if(author.selected){
        return (<option value={i} selected='selected'>{author.last_name}, {author.first_name} {author.middle_name}</option>);
      }
      else {
        return (<option value={i}>{author.last_name}, {author.first_name} {author.middle_name}</option>);
      }

    });
  }

  genreOptions(){
    return this.state.genres.map((genre, i) => {
      if(genre.selected){
        return (<option value={i} selected='selected' >{genre.name}</option>);
      }
      else {
        return (<option value={i}>{genre.name}</option>);
      }

    });
  }

  render () {
    if(this.state.redirect === true) {
      return (<Redirect to={'/books'} />);
    }
    else if(this.state.authed === true && this.state.isAdmin === true) {
      return (
        <div className='jumbotron jumbotron-fluid'>
          <h5>Add Book</h5>
          <Form onSubmit={this.handleSubmit}>
          <FormGroup controlId='bookIsbn'>
            <ControlLabel>ISBN</ControlLabel>
            <FormControl type='text' value={this.state.bookIsbn} placeholder='book isbn' onChange={this.handleChange}/>
          </FormGroup>
            <FormGroup controlId='bookTitle'>
              <ControlLabel>Title</ControlLabel>
              <FormControl type='text' value={this.state.bookTitle} placeholder='book title' onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup controlId = 'bookAuthorId'>
              <ControlLabel>Select One Author</ControlLabel>
              <FormControl componentClass='select' onChange = {this.handleChange}>
                {this.authorOptions()}
              </FormControl>
            </FormGroup>
            <FormGroup controlId='bookGenreIds'>
              <ControlLabel>Select One or More Genres</ControlLabel>
              <FormControl componentClass='select' multiple onChange={this.handleGenreChange}>
                {this.genreOptions()}
              </FormControl>
            </FormGroup>
            <FormGroup controlId='bookSynopsis'>
              <ControlLabel>Synopsis</ControlLabel>
              <FormControl type='text' value={this.state.bookSynopsis} placeholder='synopsis' onChange ={this.handleChange}/>
            </FormGroup>
            <Button type='submit' bsStyle='primary'>Update</Button>
            <Button type='button' bsStyle='danger' onClick={this.handleClick}>Delete</Button>
          </Form>
        </div>
      );
    }
    else {
      return (<div className='jumbotron jumbotron-fluid'>
                <h5>Unauthorized</h5>
              </div>);
    }

  }
}
