import {Component, OnInit} from '@angular/core';
import {Router}  from '@angular/router';
class SearchResult {
    name: string;
    email: string;
    profileImageURL: string;


    constructor(name: string, email: string, profileImageURL: string) {
        this.name = name;
        this.email = email;
        this.profileImageURL = profileImageURL;

        console.log("url :" +this.profileImageURL);
    }
}

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.css'],
    inputs: ['searchResult']
})

export class SearchResultComponent implements OnInit {

    searchResult: SearchResult;

    constructor(private router: Router,) {
    }

    ngOnInit() {
    }

    getProfile(name) {
        this.router.navigate(['/artist', name]);
        return false;
    }
}
