import {Component, OnInit} from '@angular/core';
import {Router}  from '@angular/router';

class VenueResult {
  name: string;
  email: string;
  profileImageURL: string;


  constructor(name: string, email: string, profileImageURL: string) {
    this.name = name;
    this.email = email;
    this.profileImageURL = profileImageURL;

  }
}

@Component({
  selector: 'venue-result',
  templateUrl: 'venue-result.component.html',
  styleUrls: ['venue-result.component.css'],
  inputs: ['venueResult']
})

export class VenueResultComponent implements OnInit {

  venueResult: VenueResult;

  constructor(private router: Router,) {
  }

  ngOnInit() {
  }

  getProfile(name) {
    this.router.navigate(['/venue', name]);
    return false;
  }
}
