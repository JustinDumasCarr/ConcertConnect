import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AuthService} from '../../services/auth.service';

//Dialog Stuff
import { EditVenue } from '../venue/edit.venue';
import {DOCUMENT} from '@angular/platform-browser';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent implements OnInit {

    //calendar stuff
    viewDate: Date = new Date();
    events = [];


    id: string;
  venue: Object;
  venueExist: boolean;
  venueNotExist: boolean;
  isVenueDisplay: boolean;

    nameField: string;
    emailField: string;

    //Dialog values
    dialogRef: MdDialogRef<EditVenue>;
    lastCloseResult: string;
    actionsAlignment: string;
    config: MdDialogConfig = {
        disableClose: false,
        hasBackdrop: true,
        backdropClass: '',
        width: '',
        height: '',
        position: {
            top: '',
            bottom: '',
            left: '',
            right: ''
        },
        data: {
        }
    };
    numTemplateOpens = 0;
    @ViewChild(TemplateRef) template: TemplateRef<any>;

  constructor(private route: ActivatedRoute,private authService: AuthService, public dialog: MdDialog,
              @Inject(DOCUMENT) doc: any)
  {
      dialog.afterOpen.subscribe((ref: MdDialogRef<any>) => {
          if (!doc.body.classList.contains('no-scroll')) {
              doc.body.classList.add('no-scroll');
          }
      });
      dialog.afterAllClosed.subscribe(() => {
          doc.body.classList.remove('no-scroll');
      });
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
              this.config.data = data;
              this.venueExist = true;
            }
            this.isVenue();
          },

          err => {
            console.log(err);
            return false;
          }
      );})
  }


  isVenue() {
    let venues = this.authService.getVenues();
    for(let i=0; i<venues.length; i++) {
      if(venues[i].name==this.venue['name']) {
        this.isVenueDisplay = true;
      }
    }
  }

    openEdit() {
        this.dialogRef = this.dialog.open(EditVenue, this.config);
        const sub = this.dialogRef.componentInstance.updateProfile.subscribe((data) => {
            this.venue = data;
            this.config.data = data;
        });
        this.dialogRef.afterClosed().subscribe((result: string) => {
            this.lastCloseResult = result;
            this.dialogRef = null;
            sub.unsubscribe();
        });
    }

}
