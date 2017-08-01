import {Component, OnInit} from '@angular/core';
import{ArtistResultComponent} from '../artist-result/artist-result.component'

import {SearchService} from '../../services/search.service';

@Component({
    selector: 'app-search',
    templateUrl: 'search-artist.component.html',
    styleUrls: ['search-artist.component.css']
})
export class SearchArtistComponent implements OnInit {

    artistResults: ArtistResultComponent[];

    artistName: string;

    showStyle = false;

    selectedGenre = '';
    genres = [['All'],
        ['ambient', ['new-age', 'smooth']],
        ['rock', ['indie', 'prog', 'post']],
        ['electronic', []],
        ['hip-hop/rap', []],
        ['folk', []],
        ['punk', []],
        ['metal', []],
        ['jazz', []],
        ['pop', []],
        ['acoustic', []],
        ['metal', []],
        ['latin', []],
        ['jazz', []],
            ['country', []],
        ['funk', []],
        ['reggae', []]

    ];


    constructor(private searchService: SearchService) {

    }

    ngOnInit() {


        this.artistName = localStorage.getItem('query') || "";
        this.getResults();
    }

    getStyle(genre) {
        if (this.selectedGenre == genre)
            return '#444444';
        else return '';
    }

    changeGenre(genre) {


        this.selectedGenre = genre;

        this.getResults();


    }


    getResults() {

        //this is just so that
        var query = {genre: ""};

        if (this.selectedGenre[0] === "All") {
            query = {
                genre: ""
            };
        }
        else {
            query = {
                genre: this.selectedGenre[0]
            };
        }


        localStorage.setItem('query', this.artistName);


        this.searchService.searchArtist(query).subscribe(data => {

            this.artistResults = data;

        });
    }


}
