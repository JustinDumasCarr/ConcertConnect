import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit
{
  id: string;

  constructor(private route: ActivatedRoute)
  {
    route.params.subscribe(params => {this.id = params['id'];});
  }

  ngOnInit()
  {
  }

}
