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

  venueName: string;

  showStyle = false;

  selectedGenre = '';
  selectedCapacity = 0;
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

  capacities = [
    {value: 100, viewValue: '100'},
    {value: 500, viewValue: '500'},
    {value: 2000, viewValue: '2000'},
    {value: 0, viewValue: 'All'}
  ];

  constructor(private searchService: SearchService) {

  }

  ngOnInit() {


    this.venueName = localStorage.getItem('query') || "";
    this.getResults();
  }

  getStyle(genre) {
    if (this.selectedGenre == genre)
      return '#444444';
    else return '';
  }

  changeGenre(genre) {


    this.selectedGenre = genre;
console.log('selectedGenre' + this.selectedGenre);
    this.getResults();


  }

  changeCapacity(capacity){
    this.selectedCapacity = capacity;
    this.getResults();
  }


  getResults() {

    //this is just so that
    var query = {genre: "",
      capacity: 0
    };

    if (this.selectedGenre[0] === "All") {
      query = {
        genre: "",
        capacity: this.selectedCapacity
      };
    }
    else {
      query = {
        genre: this.selectedGenre[0],
        capacity: this.selectedCapacity
      };
    }
console.log('query: ' + JSON.stringify(query));

    localStorage.setItem('query', this.venueName);


    this.searchService.searchVenue(query).subscribe(data => {

      this.venueResults = data;


      console.log('data :' +JSON.stringify(data));
    });
  }



}
