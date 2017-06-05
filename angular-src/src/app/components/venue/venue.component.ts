import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent implements OnInit {

  id: string;
  venue: Object;
  venueExist: boolean;
  venueNotExist: boolean;
  isVenueDisplay: boolean;

  editEmailField: boolean;
  editNameField: boolean;

  nameField: string;
  emailField: string;

  constructor(private route: ActivatedRoute,private authService: AuthService)
  {
    this.editNameField = false;
    this.editEmailField = false;
  }

  ngOnInit()
  {

    this.route.params.forEach(params =>
    {

      this.id = params['id'];

      this.venue = {"_id": this.id};
      this.venue = JSON.stringify(this.venue);


      this.authService.getVenueProfile(this.venue).subscribe(data => {


            if (data == "") {
              this.venueNotExist = true;
            }
            else {
              this.venue = data;
              this.venueExist = true;
            }

            this.isVenue();

          },

          err => {
            console.log(err);
            return false;
          }
      );

    })

  }


  isVenue() {
    let venues = this.authService.getVenues();
    for(let i=0; i<venues.length; i++) {
      if(venues[i].name==this.venue['name']) {
        this.isVenueDisplay = true;
      }
    }
  }

  changeName() {
    //Backend call here
    console.log(this.nameField);
  }

  changeEmail() {
    //Backend call here
    console.log(this.emailField);
  }


  toggleEditName() {

    if(this.editNameField == false) {
      this.editNameField = true;
      return false;
    }

    if(this.editNameField == true) {
      this.editNameField = false;
      return false;
    }

  }

  toggleEditEmail() {
    if(this.editEmailField == false) {
      this.editEmailField = true;
      return false;
    }

    if(this.editEmailField == true) {
      this.editEmailField = false;
      return false;
    }
  }



}
