import { Component, Inject, EventEmitter } from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from "@angular/forms";
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'register-dialog',
    template: `
        <div>
            <p class="title">Registration Failed</p>
            <p>{{ data.msg }}</p>
            <div class="button-container">
                <button md-raised-button (click)="dialogRef.close()">OK</button>
            </div>
        </div>
       `,
    styleUrls: ['register.dialog.css']
})
export class RegisterDialog {
    private _dimesionToggle = false;
    errorText: String;

    constructor(
        public dialogRef: MdDialogRef<RegisterDialog>, private route: ActivatedRoute,
        @Inject(MD_DIALOG_DATA) public data: any, private authService: AuthService) {
        this.errorText = this.data;
    }

    ngOnInit() {
    }
}