import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ArtistResultComponent} from '../artist-result/artist-result.component'

import {SearchService} from '../../services/search.service';
import {VenueResultComponent} from "../venue-result/venue-result.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

 user: Object;
  artistResults: ArtistResultComponent[];
  venueResults: VenueResultComponent[];


  viewDate: Date = new Date();
  events = [];

  constructor(private authService: AuthService, private searchService : SearchService) { }

  ngOnInit() {


    this.user = JSON.parse(localStorage.getItem('user'));

    this.artistResults = this.user['artists'];
    this.venueResults = this.user['venues'];
    console.log(this.user);

    console.log(this.user['artists']);

  }
}
