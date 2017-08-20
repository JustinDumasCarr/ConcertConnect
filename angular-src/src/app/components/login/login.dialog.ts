import { Component, Inject, EventEmitter } from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';
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
                <button md-raised-button (click)="dialogRef.close()">OK</button>
            </div>
        </div>
       `,
    styleUrls: ['login.dialog.css']
})
export class LoginDialog {
    private _dimesionToggle = false;
    errorText: String;

    constructor(
        public dialogRef: MdDialogRef<LoginDialog>, private route: ActivatedRoute,
        @Inject(MD_DIALOG_DATA) public data: any, private authService: AuthService) {
        this.errorText = this.data;
    }

    ngOnInit() {
    }
}