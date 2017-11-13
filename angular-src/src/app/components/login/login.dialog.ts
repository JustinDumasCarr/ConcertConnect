import { Component, Inject, EventEmitter } from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from "@angular/forms";
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'login-dialog',
    template: `
        <div>
            <p class="title">Login Failed</p>
            <p>{{ data.msg }}</p>
            <div class="button-container">
                <button mat-raised-button (click)="dialogRef.close()">OK</button>
            </div>
        </div>
       `,
    styleUrls: ['login.dialog.css']
})
export class LoginDialog {
    private _dimesionToggle = false;
    errorText: String;

    constructor(
        public dialogRef: MatDialogRef<LoginDialog>, private route: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService) {
        this.errorText = this.data;
    }

    ngOnInit() {
    }
}