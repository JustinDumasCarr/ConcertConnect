import {Component, OnInit} from '@angular/core';
import {Router}  from '@angular/router';
class SearchResult {
    name: string;
    email: string;
    link: string;

    constructor(name: string, email: string, link:string) {
        this.name = name;
        this.email = email;
        this.link = link ;
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

    constructor(private router:Router,) {
    }

    ngOnInit() {
    }

    getProfile(name){
        this.router.navigate(['/artist',name]);
        return false;
    }
}
