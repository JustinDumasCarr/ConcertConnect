import {Component, Inject, EventEmitter} from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from '../../services/auth.service';
import {MessageService} from '../../services/message-service.service';

@Component({
    selector: 'message-venue-dialog',
    template: `
          <div>
           
            <form >
             <p class="title">Message Venue</p>
           <mat-form-field class="venue-text-area"  hintLabel="Message will be sent to Venue's email">
                <textarea matInput rows="6" cols="48" placeholder="Enter Message Here"  type="textarea" [(ngModel)]="description" name="description" class="form-control" required></textarea>
            </mat-form-field>
              
           
            <div class="button-container-message">
                <button mat-raised-button type="submit" (click)="messageVenue()" color="accent">OK</button>
                <button mat-raised-button (click)="dialogRef.close()" color="primary">Cancel</button>
            </div>
             </form>
        </div>
       `,
    styleUrls: ['message.dialog.css']
})
export class MessageVenue {
    private _dimesionToggle = false;

    venue: any;

    description: String;

    constructor(public dialogRef: MatDialogRef<MessageVenue>, private route: ActivatedRoute,
                @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService, private messageService: MessageService) {

        this.venue = this.data;
    }

    ngOnInit() {
    }

    messageVenue() {

        let active = JSON.parse(localStorage.getItem('active'));
        let messageDetails = {};

        console.log("active: " +JSON.stringify(active))
        if (active.type === 'artist') {
            console.log("type =artist")
            messageDetails = {
                to: this.venue.email,
                from: active.name,
                artistId: active.artistId,
                description: this.description,
                type: 'artist'

            };
        }
        else {
            console.log("type =venue")
            messageDetails = {
                to: this.venue.email,
                from: active.name,
                venueId: active.venueId,
                description: this.description,
                type: 'venue'


            }
        }
            this.messageService.sendMessage(messageDetails).subscribe((result: string) => {
                this.dialogRef.close();
            });
            this.dialogRef.close();
        }


}