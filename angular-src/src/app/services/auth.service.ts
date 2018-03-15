import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import {Observer} from 'rxjs/Observer';


@Injectable()
export class AuthService {

    authToken: any;
    user: any;

    logChange$: Observable<boolean>;
    private _observer: Observer<boolean>;

    constructor(private http: Http) {
        this.logChange$ = new Observable<boolean>(observer =>
            this._observer = observer).share();
    }

    //Method that checks if venue or artists exist (navbar)
    accountExist() {
        if (this.artistExist() || this.venueExist()) {
            return true;
        }
        else {
            return false;
        }
    }

    //Method that checks if artists exist (navbar)
    artistExist() {
        if (JSON.parse(localStorage.getItem('user')).artists.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    authenticateUser(user) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/authenticate', user, {headers: headers})
            .map(res => res.json());
    }

    createRequestArtist(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/artists/createrequest', data, {headers: headers})
            .map(res => res.json());
    }

    createRequestVenue(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/venues/createrequest', data, {headers: headers})
            .map(res => res.json());
    }

    createContractArtist(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/artists/createcontract', data, {headers: headers})
            .map(res => res.json());
    }

    createContractVenue(data) {

    }

    deleteRequestArtist(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/artists/deleterequest', data, {headers: headers})
            .map(res => res.json());
    }

    changeEmail(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/changeemail', data, {headers: headers})
            .map(res => res.json());
    }

    changeUsername(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/changeusername', data, {headers: headers})
            .map(res => res.json());
    }

    changeEmailAndUsername(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/changeusernamandemail', data, {headers: headers})
            .map(res => res.json());
    }

    changeArtistInformation(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/artists/changeartistinformation', data, {headers: headers})
            .map(res => res.json());
    }

    changeArtistName(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/artists/changename', data, {headers: headers})
            .map(res => res.json());
    }

    changeArtistNameProfile(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/changeartistname', data, {headers: headers})
            .map(res => res.json());
    }

    changeArtistEmail(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/artists/changeemail', data, {headers: headers})
            .map(res => res.json());
    }

    changeArtistEmailProfile(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/changeartistemail', data, {headers: headers})
            .map(res => res.json());
    }

    changeArtistNameAndEmail(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/artists/changenameandemail', data, {headers: headers})
            .map(res => res.json());
    }

    changeVenueInformation(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/venues/changevenueinformation', data, {headers: headers})
            .map(res => res.json());
    }

    changeVenueNameProfile(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/changevenuename', data, {headers: headers})
            .map(res => res.json());
    }

    changeVenueNameAndEmail(data) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/venues/changenameandemail', data, {headers: headers})
            .map(res => res.json());
    }

    getArtistProfile(artist) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/artists/getProfile', artist, {headers: headers})
            .map(res => res.json());
    }

    getArtists() {
        //return JSON.parse(this.user.artists);
        return JSON.parse(localStorage.getItem('user')).artists;
    }

    getArtistsFromDatabase(userId) {
        let headers = new Headers();
        this.loadToken();
        let data = {userId:userId}
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/artists/getArtists', data, {headers: headers})
            .map(res => res.json());
    }

    getCurrentEmail() {
        return JSON.parse(localStorage.getItem('user')).email;
    }

    getCurrentUsername() {
        return JSON.parse(localStorage.getItem('user')).username;
    }

    getProfile() {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.get('http://localhost:3000/users/profile', {headers: headers})
            .map(res => res.json());
    }

    getUserLocal() {
        return localStorage.getItem('user');
    }

    getActiveLocal() {
        return localStorage.getItem('active');
    }

    getAWSUploadURL(fileName, fileType) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.get('http://localhost:3000/users/sign-s3?file-name=' + fileName + '&file-type=' + fileType, {headers: headers})
            .map(res => res.json());
    }

    getCurrentRequestsArtist(info) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/artists/getRequests', info, { headers: headers })
            .map(res => res.json());
    }

    getVenueProfile(venue) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/venues/getProfile', venue, {headers: headers})
            .map(res => res.json());
    }

    getVenues() {
        return JSON.parse(localStorage.getItem('user')).venues;
    }

    loadToken() {
        const token = localStorage.getItem('id_token');
        this.authToken = token;
    }

    loggedIn() {
        this._observer.next(tokenNotExpired('id_token'));
        return tokenNotExpired('id_token');
    }

    logout() {
        this.authToken = null;
        this.user = null;
        localStorage.clear();
    }

    putImageToAWS(signedRequest, file) {

        return Observable.fromPromise(new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {

                    } else {
                        console.log("File Upload Error");
                    }
                }
            };
            xhr.open("PUT", signedRequest, true);
            xhr.send(file);
        }));

    }

    registerArtist(artist) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/artists/register', artist, {headers: headers})
            .map(res => res.json());
    }

    registerUser(user) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/register', user, {headers: headers})
            .map(res => res.json());
    }

    registerVenue(venue) {
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/venues/register', venue, {headers: headers})
            .map(res => res.json());
    }

    saveArtistProfileImageURL(data){
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/artists/saveProfileImageURL', data, {headers: headers})
            .map(res => res.json());

    }
    saveVenueProfileImageURL(data){
        let headers = new Headers();
        this.loadToken();
        headers.append('Authorization', this.authToken);
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://localhost:3000/users/venues/saveProfileImageURL', data, {headers: headers})
            .map(res => res.json());

    }

    setActive(selectedEntity) {
        console.log(selectedEntity);
        localStorage.setItem('active', JSON.stringify(selectedEntity));
        console.log(selectedEntity);
    }

    setUser(user) {
        localStorage.setItem('user', JSON.stringify(user));
    }

    storeUserData(token, user) {
        localStorage.setItem('id_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.authToken = token;
        this.user = user; // _id, name, username, email, artists, venues
    }

    updateArtistArray(artistArray) {
        var user = JSON.parse(localStorage.getItem('user'));
        user.artists = artistArray;
        localStorage.setItem('user', JSON.stringify(user));
    }

    updateVenueArray(venueArray) {
        var user = JSON.parse(localStorage.getItem('user'));
        user.venues = venueArray;
        localStorage.setItem('user', JSON.stringify(user));
    }

    venueExist() {
        if (JSON.parse(localStorage.getItem('user')).venues.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }


}
