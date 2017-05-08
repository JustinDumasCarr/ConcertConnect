import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class SearchService {

  constructor(private http:Http) { }

  searchArtist(query){
    console.log("query: " +query);
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/artists/search', query,{headers: headers})
        .map(res => res.json());
  }
  searchVenue(query){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/venues/search', query,{headers: headers})
        .map(res => res.json());
  }
  searchTechnician(query){
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/technicians/search', query,{headers: headers})
        .map(res => res.json());
  }

}

