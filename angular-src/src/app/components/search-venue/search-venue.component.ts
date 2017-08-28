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


    localStorage.setItem('query', this.venueName);


    this.searchService.searchVenue(query).subscribe(data => {

      this.venueResults = data;


      console.log('data :' +JSON.stringify(data));
    });
  }

}
