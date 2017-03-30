import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
@Component({
  selector: 'app-register-venue',
  templateUrl: './register-venue.component.html',
  styleUrls: ['./register-venue.component.css']
})
export class RegisterVenueComponent implements OnInit {


  name: String;
  email: String;
  userId: String; // is this necessary

  constructor(
      private validateService: ValidateService,
      private flashMessage:FlashMessagesService,
      private authService:AuthService,
      private router: Router
  ) { }

  ngOnInit() {
  }
  onRegisterSubmit(){


    const venue = {
      name: this.name,
      email: this.email,
      userId : JSON.parse(localStorage.getItem('user')).id //clean this up somehow
    }

    // Required Fields
    if(!this.validateService.validateRegisterVenue(venue)){
      this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Validate Email
    if(!this.validateService.validateEmail(venue.email)){
      this.flashMessage.show('Please use a valid email', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Register venue
    this.authService.registerVenue(venue).subscribe(data => {
      if(data.success){
        this.flashMessage.show('Venue registered', {cssClass: 'alert-success', timeout: 3000});
        this.authService.updateVenueArray(data.venues);
      } else {
        this.flashMessage.show('Venue name already exists', {cssClass: 'alert-danger', timeout: 3000});
      }
    });

  }
}
