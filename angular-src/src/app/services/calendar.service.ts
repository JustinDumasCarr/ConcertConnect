import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';


@Injectable()
export class CalendarService {

    constructor(private http: Http) {
    }


    createContract(artist, venue, date) {


        var data = {
            artistId: artist,
            venueId: venue,
            date: date
        };



        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/venues/createContract', data, {headers: headers})
            .map(res => res.json());

    }


}
