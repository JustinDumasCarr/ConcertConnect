import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class CalendarService {

    authToken: any;
    user: any;

    constructor(private http: Http) {
    }
    loadToken(){
        const token = localStorage.getItem('id_token');
        this.authToken = token;
    }

    createContract(artist, venue, date) {


        var data = {
            artistId: artist,
            venueId: venue,
            date: date
        };


        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/venues/createContract', data, {headers: headers})
            .map(res => res.json());

    }

    submitRequest(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/artists/createRequest', data, {headers: headers})
            .map(res => res.json());
    }


}
