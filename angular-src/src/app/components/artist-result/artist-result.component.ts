import {Component, OnInit} from '@angular/core';
import {Router}  from '@angular/router';

class ArtistResult {
    name: string;
    email: string;
    profileImageURL: string;
    artistId: string;


    constructor(name: string, email: string, profileImageURL: string, artistId : string) {
        this.name = name;
        this.email = email;
        this.profileImageURL = profileImageURL;
this.artistId = artistId;
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

    getProfile(artistId) {
        this.router.navigate(['/artist', artistId]);
        return false;
    }
}
