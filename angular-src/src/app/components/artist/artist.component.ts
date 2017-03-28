import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AuthService} from '../../services/auth.service';
@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit
{
  id: string;
  artist: Object;
  //Having two separate values ensures that the 'Not found' message does not show up while it's loading
  artistExist: boolean;
  artistNotExist: boolean;

  constructor(private route: ActivatedRoute,private authService: AuthService)
  {
    route.params.subscribe(params => {this.id = params['id']; });
  }

  ngOnInit()
  {

      this.artist = {"name": this.id };
      this.artist = JSON.stringify(this.artist);



     this.authService.getArtistProfile(this.artist).subscribe(data =>
     {


      if(data=="")
      {
        this.artistNotExist = true;
      }
      else
      {
        this.artist = data;
        this.artistExist = true;
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
