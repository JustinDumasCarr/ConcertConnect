import { Component, OnInit, Inject, ViewChild, TemplateRef, ChangeDetectionStrategy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {CalendarService} from '../../services/calendar.service';
import { CalendarEvent } from 'angular-calendar';
import { ViewContainerRef } from '@angular/core';
import { TdDialogService } from '@covalent/core';
import {
    startOfDay,
    endOfDay,
    subDays,
    addDays,
    endOfMonth,
    isSameDay,
    isSameMonth,
    addHours
} from 'date-fns';
//Dialog Stuff
import { EditVenue } from '../venue/edit.venue';
import { MessageVenue } from '../venue/message.venue';

import {DOCUMENT} from '@angular/platform-browser';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-venue',
    //changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.css']
})
export class VenueComponent implements OnInit {

    //calendar stuff
    viewDate: Date = new Date();
    events: CalendarEvent[];


    id: string;
  venue: Object;
  venueExist: boolean;
  venueNotExist: boolean;
  isVenueDisplay: boolean;

    nameField: string;
    emailField: string;

    //Dialog values
    dialogRef: MatDialogRef<EditVenue>;
    dialogRefMessage: MatDialogRef<MessageVenue>;

    lastCloseResult: string;
    actionsAlignment: string;
    config: MatDialogConfig = {
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

  constructor(private route: ActivatedRoute,private authService: AuthService,private router: Router,private calendarService: CalendarService, public dialog: MatDialog,

              private _dialogService: TdDialogService,
              private _viewContainerRef: ViewContainerRef,@Inject(DOCUMENT) doc: any)
  {
      dialog.afterOpen.subscribe((ref: MatDialogRef<any>) => {
          if (!doc.body.classList.contains('no-scroll')) {
              doc.body.classList.add('no-scroll');
          }
      });

      dialog.afterAllClosed.subscribe(() => {
          doc.body.classList.remove('no-scroll');
      });
  }

  ngOnInit(){
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
                this.events= data['contracts'].map(function(contract) {
                    return {
                        start: startOfDay(contract['date']),
                        title: contract['artistId'],
                        color: {
                            primary: '#ad2121',
                            secondary: '#FAE3E3'
                        },
                    }
                });
                console.log('data:' + JSON.stringify(data['contracts']));
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


    openMessage(){

        this.dialogRefMessage = this.dialog.open(MessageVenue, this.config);

        this.dialogRefMessage.afterClosed().subscribe((result: string) => {
            this.lastCloseResult = result;
            this.dialogRefMessage = null;

        });


    }

    openEdit() {
        this.dialogRef = this.dialog.open(EditVenue, this.config);
        const sub = this.dialogRef.componentInstance.updateProfile.subscribe((data) => {
            this.venue = data;
            this.config.data = data;
        });
        this.dialogRef.afterClosed().subscribe((result: string) => {
            this.authService.setActive(this.venue);
            this.authService.getProfile().subscribe(data => {
                localStorage.setItem('user', JSON.stringify(data.user));
            });
            this.lastCloseResult = result;
            this.dialogRef = null;
            sub.unsubscribe();
        });
    }
    openConfirm(event): void {
        this._dialogService.openConfirm({
            message: 'Would you like to send a request to play on this Date?',
            disableClose:  false, // defaults to false
            viewContainerRef: this._viewContainerRef, //OPTIONAL
            title: 'Confirm', //OPTIONAL, hides if not provided
            cancelButton: 'No', //OPTIONAL, defaults to 'CANCEL'
            acceptButton: 'Yes', //OPTIONAL, defaults to 'ACCEPT'
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.createContract(event);
            } else {
                // DO SOMETHING ELSE
            }
        });
    }


    createContract(event) {
        console.log(event);
        var active = JSON.parse(localStorage.getItem('active'));
        console.log('active:' +active.artistId);
        console.log('venue: '+ JSON.stringify(this.venue));
        this.calendarService.createContract(active['artistId'],this.venue['_id'],event.day.date).subscribe((data) => {
            // this.router.navigate(['/venue',this.venue['_id']]);
            window.location.reload();
        });
    }

}
