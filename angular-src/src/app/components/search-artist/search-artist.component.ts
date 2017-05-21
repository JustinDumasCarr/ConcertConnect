import { Component, OnInit } from '@angular/core';
import{ArtistResultComponent} from '../artist-result/artist-result.component'

import {SearchService} from '../../services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: 'search-artist.component.html',
  styleUrls: ['search-artist.component.css']
})
export class SearchArtistComponent implements OnInit {

  artistResults: ArtistResultComponent[];

  artistName : string;

  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];

  constructor(
      private searchService:SearchService

  ) {

  }

  ngOnInit() {
    this.artistName = localStorage.getItem('query') || "";
    this.getResults();
  }

  getResults(){

    const query = {
      name: this.artistName
    };

    localStorage.setItem('query',this.artistName);


    this.searchService.searchArtist(query).subscribe(data => {

      this.artistResults = data;

    });
  }


}
