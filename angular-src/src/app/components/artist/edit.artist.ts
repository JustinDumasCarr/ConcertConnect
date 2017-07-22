import { Component, Inject } from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup } from "@angular/forms";
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'demo-jazz-dialog',
    template: `
        <div *ngIf="formStatus=='form-not-submitted'">
            <p class="title">Edit Information</p>
            <form *ngIf="!formSubmit" (ngSubmit)="changeData()" [formGroup]="userInformation">
                <md-input-container>
                    <input mdInput type="text" value="{{originalUsername}}" formControlName="username">
                </md-input-container>
                <md-input-container>
                    <input mdInput type="text" value="{{originalEmail}}" formControlName="email">
                </md-input-container>
                <div class="button-container">
                    <button md-raised-button (click)="dialogRef.close()">Cancel</button>
                    <button md-raised-button type="submit">Save</button>
                </div>
            </form>
        </div>
        <div *ngIf="formStatus=='form-submitted'">
            <div *ngIf="formSubmit && formSuccess" class="change-success">
                <p class="title">Success!</p>
                <p>Your information has been changed successfully</p>
                <button md-raised-button (click)="dialogRef.close()">OK</button>
            </div>
            <div *ngIf="formSubmit && formFail" class="change-fail">
                <p class="title">Success!</p>
                <p>Your information has been changed successfully</p>
                <button md-raised-button (click)="dialogRef.close()">OK</button>
            </div>
        </div>
        <md-spinner *ngIf="formStatus=='form-loading'" class="loader"></md-spinner>
       `,
    styleUrls: ['edit.artist.css']
})
export class EditArtist {
    private _dimesionToggle = false;
    userInformation: FormGroup;
    username: FormControl;
    email: FormControl;

    originalUsername: string;
    originalEmail: string;
    currentUsername: string;
    currentEmail: string;

    userChange: boolean;
    emailChange: boolean;
    bothChange: boolean;

    formSubmit: boolean;
    formSuccess: boolean;
    formFail: boolean;
    formStatus: string;

    constructor(
        public dialogRef: MdDialogRef<EditArtist>,
        @Inject(MD_DIALOG_DATA) public data: any, private authService: AuthService) {
        this.username = new FormControl();
        this.email = new FormControl();
        this.userInformation = new FormGroup({username: this.username, email: this.email});
        this.formSubmit = false;
        this.formSuccess = false;
        this.formFail = false;
        this.formStatus = "form-not-submitted";
    }

    ngOnInit() {
        this.originalUsername = this.authService.getCurrentUsername();
        this.originalEmail = this.authService.getCurrentEmail();
    }

    changeData() {
        //Both username and email need to be changed
        if((this.username.value != null && this.username.value.trim() != "") && (this.email.value != null && this.email.value.trim() != "")) {
            this.formStatus="form-loading";
            this.changeUsernameAndEmail();
        }
    }

    changeUsernameAndEmail() {
        const dataSend = {
            username: this.username.value,
            currentUsername: this.authService.getCurrentUsername(),
            email: this.email.value,
            currentEmail: this.authService.getCurrentEmail()
        };

        this.authService.changeEmailAndUsername(dataSend).subscribe(data => {
            if(data.success) {

                // Updating user information on the front-end
                let newUser = JSON.parse(this.authService.getUserLocal()); // This line may be causing the problem
                newUser.username = dataSend.username;
                newUser.email = dataSend.email;
                this.authService.setUser(newUser);
                this.authService.setActive(newUser);

                this.originalUsername = this.authService.getCurrentUsername();
                this.originalEmail = this.authService.getCurrentEmail();

                this.formSubmit = true;
                this.formSuccess = true;
                this.userChange = true;
                this.formStatus = "form-submitted";
            } else {
                this.formSubmit = true;
                this.formSuccess = false;
            }
        })
    }



}
