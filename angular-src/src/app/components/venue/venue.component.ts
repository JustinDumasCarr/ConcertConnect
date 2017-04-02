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

  constructor(private route: ActivatedRoute,private authService: AuthService)
  {
  }

  ngOnInit()
  {

    this.route.params.forEach(params =>
    {

      this.id = params['id'];

      this.venue = {"name": this.id};
      this.venue = JSON.stringify(this.venue);


      this.authService.getVenueProfile(this.venue).subscribe(data => {


            if (data == "") {
              this.venueNotExist = true;
            }
            else {
              this.venue = data;
              this.venueExist = true;
            }

          },

          err => {
            console.log(err);
            return false;
          }
      );

    })

  }



}
