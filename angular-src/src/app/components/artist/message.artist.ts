import {Component, Inject, EventEmitter} from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from '../../services/auth.service';
import {MessageService} from '../../services/message-service.service';

@Component({
    selector: 'message-artist-dialog',
    template: `
        <div>
           
            <form >
             <p class="title">Message Artist</p>
           <mat-form-field class="artist-text-area"  hintLabel="Message will be sent to Band's email">
                <textarea matInput rows="6" cols="48" placeholder="Enter Message Here"  type="textarea" [(ngModel)]="description" name="description" class="form-control" required></textarea>
            </mat-form-field>
              
           
            <div class="button-container-message">
                <button mat-raised-button type="submit" (click)="messageArtist()" color="accent">OK</button>
                <button mat-raised-button (click)="dialogRef.close()" color="primary">Cancel</button>
            </div>
             </form>
        </div>
       `,
    styleUrls: ['message.dialog.css']
})
export class MessageArtist {
    private _dimesionToggle = false;
    errorText: String;
    artist: any;

    description: String;

    constructor(public dialogRef: MatDialogRef<MessageArtist>, private route: ActivatedRoute,
                @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService, private messageService: MessageService) {
        this.errorText = this.data;
        this.artist = this.data;

    }

    ngOnInit() {
    }

    messageArtist() {

        let active = JSON.parse(localStorage.getItem('active'));
        let messageDetails = {};

        console.log("active: " +JSON.stringify(active))
        if (active.type === 'artist') {

            messageDetails = {
                to: this.artist.email,
                from: active.name,
                artistId: active.artistId,
                description: this.description,
                type: 'artist'

            };
        }
        else {

            messageDetails = {
                to: this.artist.email,
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