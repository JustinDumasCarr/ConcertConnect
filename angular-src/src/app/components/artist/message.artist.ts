import {Component, Inject, EventEmitter} from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup} from "@angular/forms";
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'message-artist-dialog',
    template: `
        <div>
            <p class="title">Message Artist</p>
            <form>
                <textarea id="textarea"  ></textarea>
            </form>
            <div class="button-container-message">
                <button md-raised-button (click)="dialogRef.close() " color="accent">OK</button>
                <button md-raised-button (click)="dialogRef.close()" color="primary">Cancel</button>
            </div>
        </div>
       `,
    styleUrls: ['message.dialog.css']
})
export class MessageArtist {
    private _dimesionToggle = false;
    errorText: String;

    constructor(public dialogRef: MatDialogRef<MessageArtist>, private route: ActivatedRoute,
                @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService) {
        this.errorText = this.data;
    }

    ngOnInit() {
    }
}