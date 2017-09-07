import {Component, OnInit} from '@angular/core';
import{ArtistResultComponent} from '../artist-result/artist-result.component'

import {SearchService} from '../../services/search.service';
import {VenueResultComponent} from "../venue-result/venue-result.component";

@Component({
    selector: 'app-discover',
    templateUrl: './discover.component.html',
    styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {

    artistResults: ArtistResultComponent[];
    venueResults: VenueResultComponent[];

    constructor(private searchService: SearchService) {
    }

    ngOnInit() {

        this.getResults();
    }

    getResults(){

        this.searchService.searchArtist({name: ""}).subscribe(data => {

            this.artistResults = data;

        });
        this.searchService.searchVenue({genre: "",
        capacity: 0}).subscribe(data => {

            this.venueResults = data;

        });

    }
}
