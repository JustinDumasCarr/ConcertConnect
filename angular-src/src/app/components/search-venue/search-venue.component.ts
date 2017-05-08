import { Component, OnInit } from '@angular/core';
import{VenueResultComponent} from '../venue-result/venue-result.component'
import {SearchService} from '../../services/search.service';

@Component({
  selector: 'app-search-venue',
  templateUrl: 'search-venue.component.html',
  styleUrls: ['search-venue.component.css']
})
export class SearchVenueComponent implements OnInit {


  venueResults: VenueResultComponent[];

  venueName : string;

  constructor( private searchService:SearchService) { }

  ngOnInit() {

    this.venueName = localStorage.getItem('query') || "";
    this.getResults();
  }
  getResults(){

    const query = {
      name: this.venueName
    };

    localStorage.setItem('query',this.venueName);

    console.log(query);
    this.searchService.searchVenue(query).subscribe(data => {

      this.venueResults = data;

    });
}
}
