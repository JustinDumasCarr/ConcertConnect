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

  constructor(private route: ActivatedRoute,private authService: AuthService)
  {
    route.params.subscribe(params => {this.id = params['id'];});
  }

  ngOnInit()
  {


    this.venue = {"name": this.id };
    this.venue = JSON.stringify(this.venue);



    this.authService.getVenueProfile(this.venue).subscribe(data =>
        {


          if(data=="")
          {
            this.venueExist = false;
          }
          else
          {
            this.venue = data;
            this.venueExist = true;
          }

        },

        err =>
        {
          console.log(err);
          return false;
        }
    );
  }



}
