import axios from 'axios';
import BASE_URL from '../backend/BaseUrl';

var authors = [];
var books = [];
var genres =[];

export function getBooks(){
  let url = `${BASE_URL}/catalog/books`;
  axios({
    method:'get',
    url: url
  })
  .then((response) => {
    if(response.data.statusCode === 200) {
      books = response.data.books;
    }
  })
  .catch((error) => {
    console.log(error);
  });
  return books;
}

export function getAuthors(){
  let url = '${BASE_URL}/catalog/authors';
  axios({
    method: 'get',
    url: url
  })
  .then((response) => {
      if(response.data.statusCode === 200){
        authors = response.data.authors;
      }
  })
  return authors;
}

export function getGenres(){
  let url =`${BASE_URL}/catalog/genres`;
  axios({
    method: 'get',
    url:url
  })
  .then((response) =>{
    if(response.data.statusCode === 200) {
      genres = response.data.genres;
    }
  })
  return genres;
}
