import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import{SearchResultComponent} from '../search-result/search-result.component'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchResults: SearchResultComponent[];

  name : string;
  results = [];

  constructor(
      private authService:AuthService

  ) { }

  ngOnInit() {
  }

  getResults(){

    const query = {
      name: this.name
    };

    console.log(query);
    this.authService.search(query).subscribe(data => {

      this.searchResults = data;

    });
  }


}
