import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent implements OnInit {

  id: string;

  constructor(private route: ActivatedRoute)
  {
    route.params.subscribe(params => {this.id = params['id'];});
  }

  ngOnInit()
  {
  }

}
