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
                    <button md-raised-button (click)="dialogRef.close()" color="accent">Cancel</button>
                    <button md-raised-button type="submit" color="primary">Save</button>
                </div>
            </form>
        </div>
        <div *ngIf="formStatus=='form-submitted'">
            <div *ngIf="formSubmit && formSuccess" class="change-success">
                <p class="title">Success!</p>
                <p>Your information has been changed successfully</p>
                <button md-raised-button (click)="dialogRef.close()" class="ok-button">OK</button>
            </div>
            <div *ngIf="formSubmit && formFail" class="change-fail">
                <p class="title">Success!</p>
                <p>Your information has been changed successfully</p>
                <button md-raised-button (click)="dialogRef.close()" class="ok-button">OK</button>
            </div>
        </div>
        <md-spinner *ngIf="formStatus=='form-loading'" class="loader"></md-spinner>
       `,
    styleUrls: ['edit.profile.css']
})
export class EditProfile {
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
        public dialogRef: MdDialogRef<EditProfile>,
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

        console.log("Usename field testing");
        console.log(this.username.value);

        console.log("Email field testing");
        console.log(this.email.value);

        // Execute if both username and email are
        if((this.username.value != null && this.username.value.trim() != "") && (this.email.value != null && this.email.value.trim() != "")) {
            this.formStatus="form-loading";
            console.log("Change both");
            // this.changeUsernameAndEmail();
        } else if(this.username.value != null && this.username.value.trim() != "") {
            this.changeUsername();
        } else if(this.email.value != null && this.email.value.trim() != "") {
            this.changeEmail();
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

    changeUsername() {
        console.log("Change username");
    }

    changeEmail() {
        console.log("Change email");
    }

}