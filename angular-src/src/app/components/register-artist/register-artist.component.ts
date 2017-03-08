import { Component, OnInit } from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
@Component({
  selector: 'app-register-artist',
  templateUrl: './register-artist.component.html',
  styleUrls: ['./register-artist.component.css']
})
export class RegisterArtistComponent implements OnInit {


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


    const artist = {
      name: this.name,
      email: this.email,
      userId : JSON.parse(localStorage.getItem('user')).id //clean this up somehow
    }

    // Required Fields
    if(!this.validateService.validateRegisterArtist(artist)){
      this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Validate Email
    if(!this.validateService.validateEmail(artist.email)){
      this.flashMessage.show('Please use a valid email', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    // Register artist
    this.authService.registerArtist(artist).subscribe(data => {
      if(data.success){
        this.flashMessage.show('Artist registered', {cssClass: 'alert-success', timeout: 3000});
      } else {
        this.flashMessage.show('Artist name already exists', {cssClass: 'alert-danger', timeout: 3000});
      }
    });

  }
}
