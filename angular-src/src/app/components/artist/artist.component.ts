import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {FlashMessagesService} from 'angular2-flash-messages';

//Dialog Stuff
import {EditArtist}from '../artist/edit.artist';
import {ContactArtist} from '../artist/contact.artist';
import {DOCUMENT} from '@angular/platform-browser';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';


@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
})
export class ArtistComponent implements OnInit
{
  id: string;
  artist: Object;
  //Having two separate values ensures that the 'Not found' message does not show up while it's loading
  artistExist: boolean;
  artistNotExist: boolean;
  isArtistDisplay: boolean;

  editEmailField: boolean;
  editNameField: boolean;

  nameField: string;
  emailField: string;





  constructor(private route: ActivatedRoute,private authService: AuthService,private flashMessage:FlashMessagesService,  public dialog: MdDialog, @Inject(DOCUMENT) doc: any)
  {
      this.editEmailField = false;
      this.editNameField = false;


      dialog.afterOpen.subscribe((ref: MdDialogRef<any>) => {
          if (!doc.body.classList.contains('no-scroll')) {
              doc.body.classList.add('no-scroll');
          }
      });
      dialog.afterAllClosed.subscribe(() => {
          doc.body.classList.remove('no-scroll');
      });
  }

  ngOnInit() {
      this.route.params.forEach(params => {
          this.id = params['id'];
          this.artist = {"_id": this.id};
          this.artist = JSON.stringify(this.artist);
          this.authService.getArtistProfile(this.artist).subscribe(data => {
              if (data == "") {
                  this.artistNotExist = true;
              }
              else {
                  this.artist = data;
                  this.artistExist = true;
              }

              this.isArtist();
            },
          err => {
              console.log(err);
              return false;
          }
          );
      })
     }



     isArtist() {
         let artists = this.authService.getArtists();
         for(let i=0; i<artists.length; i++) {
             if(artists[i].name==this.artist['name']) {
                 this.isArtistDisplay = true;
             }
         }
     }



    errorMessage(message) {
        this.flashMessage.show(message, {
            cssClass: 'alert-danger',
            timeout: 5000});
    }

}

