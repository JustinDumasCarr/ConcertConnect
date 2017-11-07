import {Component, OnInit, Inject, ViewChild, TemplateRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {CalendarService} from '../../services/calendar.service';

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
import {EditArtist} from '../artist/edit.artist';
import {MessageArtist} from '../artist/message.artist';

import {DOCUMENT} from '@angular/platform-browser';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-artist',
    templateUrl: './artist.component.html',
    styleUrls: ['./artist.component.css'],
})
export class ArtistComponent implements OnInit {

//calendar stuff
    viewDate: Date = new Date();
    events = [];

    id: string;
    artist: Object;
    //Having two separate values ensures that the 'Not found' message does not show up while it's loading
    artistExist: boolean;
    artistNotExist: boolean;
    isArtistDisplay: boolean;

    nameField: string;
    emailField: string;

    //Dialog values
    dialogRef: MdDialogRef<EditArtist>;
    dialogRefMessage: MdDialogRef<MessageArtist>;
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
        data: {}
    };
    numTemplateOpens = 0;
    @ViewChild(TemplateRef) template: TemplateRef<any>;

    constructor(private route: ActivatedRoute, private authService: AuthService,private calendarService: CalendarService, public dialog: MdDialog,
    private _dialogService: TdDialogService,
    private _viewContainerRef: ViewContainerRef,
                @Inject(DOCUMENT) doc: any) {
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
                        this.config.data = data;
                        this.artistExist = true;
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
        for (let i = 0; i < artists.length; i++) {
            if (artists[i].name == this.artist['name']) {
                this.isArtistDisplay = true;
            }
        }
    }

    openMessage() {

        this.dialogRefMessage = this.dialog.open(MessageArtist, this.config);

        this.dialogRefMessage.afterClosed().subscribe((result: string) => {
            this.lastCloseResult = result;
            this.dialogRefMessage = null;
        });


    }

    openEdit() {
        this.dialogRef = this.dialog.open(EditArtist, this.config);
        const sub = this.dialogRef.componentInstance.updateProfile.subscribe((data) => {
            this.artist = data;
            this.config.data = data;
        });
        this.dialogRef.afterClosed().subscribe((result: string) => {
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
        console.log('active:' +active.venueId);

        this.calendarService.createContract(this.artist['_id'],active['venueId'],event.day.date).subscribe((data) => {
            window.location.reload();
        });
    }
}