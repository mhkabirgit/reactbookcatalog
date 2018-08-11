import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import axios from 'axios';

import HomeComponent from './components/HomeComponent';
import BookListComponent from './components/BookListComponent';
import BookComponent from './components/BookComponent';
import BookAddComponent from './components/BookAddComponent';
import BookUpdateDeleteComponent from './components/BookUpdateDeleteComponent';
import AuthorListComponent from './components/AuthorListComponent';
import AuthorComponent from './components/AuthorComponent';
import AuthorAddComponent from './components/AuthorAddComponent';
import AuthorUpdateDeleteComponent from './components/AuthorUpdateDeleteComponent';
import GenreListComponent from './components/GenreListComponent';
import GenreComponent from './components/GenreComponent';
import GenreAddComponent from './components/GenreAddComponent';
import GenreUpdateDeleteComponent from './components/GenreUpdateDeleteComponent';
import SigninComponent from './components/SigninComponent';
import SignoutComponent from './components/SignoutComponent';
import SignupComponent from './components/SignupComponent';
import DummyComponent from './components/DummyComponent';

import logo from './logo.svg';
import './App.css';

class App extends Component {

  componentDidMount() {
    axios.defaults.withCredentials = true;
  }

  render() {
    return (
      <BrowserRouter>
      <div className='container-fluid'>
      <div className='App'>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">POINTBACK BOOK CATALOG</h1>
        </header>
        <Navbar>
          <Nav>
            <NavItem eventKey={1}>
                <Link to={'/'} className='nav-link'>Home</Link>
            </NavItem>
          </Nav>
          <Nav>
              <NavItem eventKey={2}>
                  <Link to={'/books'} className='nav-link'>Books</Link>
              </NavItem>
          </Nav>
          <Nav>
              <NavItem eventKey={3}>
                  <Link to={'/authors'} className='nav-link'>Authors</Link>
              </NavItem>
          </Nav>
          <Nav>
              <NavItem eventKey={3}>
                  <Link to={'/genres'} className='nav-link'>Genres</Link>
              </NavItem>
          </Nav>
          <Nav>
              <NavItem eventKey={4}>
                <Link to={'/book/new/add'} className='nav-link'> Add Book</Link>
              </NavItem>
          </Nav>
          <Nav>
              <NavItem eventKey={5}>
                  <Link to={'/author/new/add'} className='nav-link'> Add Author</Link>
              </NavItem>
          </Nav>
          <Nav>
              <NavItem eventKey={6}>
                    <Link to={'/genre/new/add'} className='nav-link'> Add Genre</Link>
              </NavItem>
          </Nav>
          <Nav pullRight>
              <NavItem eventKey={7}>
                  <Link to={'/user/signin'} className='nav-link'>Sign In</Link>
              </NavItem>
          </Nav>
          <Nav pullRight>
              <NavItem eventKey={8}>
                  <Link to={'/user/signout'} className='nav-link'>Sign Out</Link>
              </NavItem>
          </Nav>
          <Nav pullRight>
              <NavItem eventKey={9}>
                  <Link to={'/user/signup'} className='nav-link'>Sign Up</Link>
              </NavItem>
          </Nav>
          </Navbar>
          <Switch>
              <Route exact path='/' component={HomeComponent}/>
              <Route exact path='/books' component={BookListComponent}/>
              <Route exact path='/book/:bookid' component ={BookComponent}/>
              <Route exact path='/book/:bookid/update/delete' component ={BookUpdateDeleteComponent}/>
              <Route exact path='/book/new/add' component={BookAddComponent}/>

              <Route exact path='/authors' component={AuthorListComponent}/>
              <Route exact path='/author/:authorid' component={AuthorComponent}/>
              <Route exact path='/author/:authorid/update/delete' component={AuthorUpdateDeleteComponent}/>
              <Route exact path='/author/new/add' component={AuthorAddComponent}/>

              <Route exact path='/genres' component={GenreListComponent}/>
              <Route exact path='/genre/:genreid' component ={GenreComponent} />
              <Route exact path='/genre/:genreid/update/delete' component={GenreUpdateDeleteComponent}/>
              <Route exact path='/genre/new/add' component={GenreAddComponent}/>

              <Route exact path='/user/signin' component={SigninComponent}/>
              <Route exact path='/user/signout' component={SignoutComponent}/>
              <Route exact path='/user/signup' component={SignupComponent}/>
          </Switch>
          </div>
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
