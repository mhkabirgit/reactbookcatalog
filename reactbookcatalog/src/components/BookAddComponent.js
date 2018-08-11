import React, {Component} from 'react';
import {Form, FormGroup, ControlLabel, FormControl, Button} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';

import axios from 'axios';
import BASE_URL from '../backend/BaseUrl';

import {getAuthStatus} from '../service/AuthenticationService';

export default class BookAddComponent extends Component {

  constructor(props){
    super(props);
    this.state ={
      bookIsbn: '',
      bookTitle: '',
      bookAuthorId:'',
      bookGenreIds: [],
      bookSynposis: '',
      authors:[],
      genres: [],
      authed: false,
      isAdmin: false,
      redirect: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAuthorChange = this.handleAuthorChange.bind(this);
    this.handleGenreChange = this.handleGenreChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    const authStatus = getAuthStatus();
    if(authStatus.authed === true && authStatus.isAdmin === true ){
      const url =`${BASE_URL}/catalog/authors/and/genres`;
      axios({
        method:'get',
        url:url
      })
      .then ((response) => {
        if(response.data.statusCode === 200){
          this.setState({authed: true, isAdmin: true, authors:response.data.authors, genres: response.data.genres});
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

  handleAuthorChange(event) {
    let options =event.target.options;
    for(var i=0; i<options.length; i++){
      if(options[i].selected ){
        this.setState({[event.target.id]: options[i].value});
        break;
      }
    }
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
    let url =`${BASE_URL}/catalog/book/create`;
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

  authorOptions(){
    return this.state.authors.map((author, i) => {
      return (<option value={i}>{author.last_name}, {author.first_name} {author.middle_name}</option>);
    });
  }

  genreOptions(){
    return this.state.genres.map((genre, i) => {
      return (<option value={i}>{genre.name}</option>);
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
              <ControlLabel>Select Author</ControlLabel>
              <FormControl componentClass='select' onChange = {this.handleAuthorChange}>
                {this.authorOptions()}
              </FormControl>
            </FormGroup>
            <FormGroup controlId='bookGenreIds'>
              <ControlLabel>Select Genres</ControlLabel>
              <FormControl componentClass='select' multiple onChange={this.handleGenreChange}>
                {this.genreOptions()}
              </FormControl>
            </FormGroup>
            <FormGroup controlId='bookSynopsis'>
              <ControlLabel>Synopsis</ControlLabel>
              <FormControl type='text' value={this.state.bookSynopsis} placeholder='synopsis' onChange ={this.handleChange}/>
            </FormGroup>
            <Button type='submit' bsStyle='primary'>Add</Button>
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
