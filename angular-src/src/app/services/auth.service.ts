import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';



@Injectable()
export class AuthService {

  authToken: any;
  user: any;

  constructor(private http:Http)
  {
  }

  //Method that checks if venue or artists exist (navbar)
  accountExist()
  {
    if(this.artistExist() || this.venueExist())
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  //Method that checks if artists exist (navbar)
  artistExist()
  {
    if(JSON.parse(localStorage.getItem('user')).artists.length>0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }

  authenticateUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/authenticate', user,{headers: headers})
        .map(res => res.json());
  }

  changeEmail(data)
  {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/changeemail',data,{headers: headers})
        .map(res => res.json());
  }

  changeUsername(data)
  {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/changeusername',data,{headers: headers})
        .map(res => res.json());
  }

  getArtistProfile(name){
    let headers = new Headers();
    this.loadToken();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/artists/getProfile',name,{headers: headers})
        .map(res => res.json());
  }

  getArtists()
  {
    //return JSON.parse(this.user.artists);
    return JSON.parse(localStorage.getItem('user')).artists;
  }

  getCurrentEmail()
  {
    return JSON.parse(localStorage.getItem('user')).email;
  }

  getCurrentUsername()
  {
    return JSON.parse(localStorage.getItem('user')).username;
  }

  getProfile(){
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type','application/json');
    return this.http.get('http://localhost:3000/users/profile',{headers: headers})
        .map(res => res.json());
  }

  getUserId(){
    return this.user
  }

  getVenueProfile(name){
    let headers = new Headers();
    this.loadToken();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/venues/getProfile',name,{headers: headers})
        .map(res => res.json());
  }

  getVenues()
  {
    return JSON.parse(localStorage.getItem('user')).venues;
  }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn(){
    return tokenNotExpired();
  }

  logout(){
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }

  registerArtist(artist){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/artists/register', artist,{headers: headers})
        .map(res => res.json());
  }

  registerUser(user){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/register', user,{headers: headers})
        .map(res => res.json());
  }


  registerVenue(venue){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/venues/register', venue,{headers: headers})
        .map(res => res.json());
  }

  search(query){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/artists/search', query,{headers: headers})
        .map(res => res.json());
  }

  setActive(selectedEntity){

    localStorage.setItem('active', JSON.stringify(selectedEntity));
  }

  storeUserData(token, user){
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user; // _id, name, username, email, artists, venues
  }

  updateArtistArray(artistArray){
   var user = JSON.parse(localStorage.getItem('user'));
    user.artists = artistArray;
    localStorage.setItem('user', JSON.stringify(user));
  }
  updateVenueArray(venueArray){
    var user = JSON.parse(localStorage.getItem('user'));
    user.venues = venueArray;
    localStorage.setItem('user', JSON.stringify(user));
  }

  venueExist()
  {
    if(JSON.parse(localStorage.getItem('user')).venues.length>0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }


}
