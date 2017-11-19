import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class MessageService {

  authToken: any;
  user: any;

  constructor(private http: Http,) { }

  loadToken(){
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  sendMessage(messageDetails){


    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    console.log("sendMEssage called");
    return this.http.post('http://localhost:3000/users/message', messageDetails, {headers: headers})
        .map(res => res.json());

  }
}
