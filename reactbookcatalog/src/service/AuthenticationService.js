import axios from 'axios';
import BASE_URL from '../backend/BaseUrl';

var authStatus = {authed:false, isAdmin: false, email:'', error:''};

export function login(email, password){
  const url = `${BASE_URL}/users/signin`;
  axios({
    method: 'post',
    url: url,
    data: {email:email, password: password},
    config: { headers: {'Content-Type': 'application/form-data' },
              withCredentials: true}
    })
  .then(response => {
    if(response.data.statusCode === 200){
      authStatus = {authed:true,
                    isAdmin: response.data.isAdmin,
                    email:response.data.email,
                    error:response.data.error};
    }
    else{
      authStatus = {authed:false,
                    email:response.data.email,
                    error:response.data.error};
    }
  })
  .catch(error => {
    console.log(error)});
}

export function logout() {
  const url = `${BASE_URL}/users/signout`;
  axios({
    method: 'post',
    url: url,
    data: {},
    config: { headers: {'Content-Type': 'application/json' },
    withCredentials: true}
    })
  .then(response => {
    if(response.data.statusCode === 200){
      authStatus = {authed:false, isAdmin: false, email:'', error:''};
    }
  })
  .catch(error => {console.log(error)});
}

export function getAuthStatus() {
  return authStatus;
}
