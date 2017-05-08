import {Component, OnInit} from '@angular/core';
import {Router}  from '@angular/router';

class ArtistResult {
    name: string;
    email: string;
    profileImageURL: string;


    constructor(name: string, email: string, profileImageURL: string) {
        this.name = name;
        this.email = email;
        this.profileImageURL = profileImageURL;

    }
}

@Component({
    selector: 'artist-result',
    templateUrl: 'artist-result.component.html',
    styleUrls: ['artist-result.component.css'],
    inputs: ['artistResult']
})

export class ArtistResultComponent implements OnInit {

    artistResult: ArtistResult;

    constructor(private router: Router,) {
    }

    ngOnInit() {
    }

    getProfile(name) {
        this.router.navigate(['/artist', name]);
        return false;
    }
}
