import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl, FormGroup } from "@angular/forms";
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'demo-jazz-dialog',
    template: `
        <div *ngIf="formStatus=='form-not-submitted'">
            <p class="title">Edit Information</p>
            <form *ngIf="!formSubmit" (ngSubmit)="changeData()" [formGroup]="userInformation">
                <mat-input-container>
                    <input matInput placeholder="Username" type="text" value="{{originalUsername}}" formControlName="username">
                </mat-input-container>
                <mat-input-container>
                    <input matInput placeholder="Email" type="text" value="{{originalEmail}}" formControlName="email">
                </mat-input-container>
                <div class="button-container">
                    <button mat-raised-button (click)="dialogRef.close()" color="accent">Cancel</button>
                    <button mat-raised-button type="submit" color="primary">Save</button>
                </div>
            </form>
        </div>
        <div *ngIf="formStatus=='form-submitted'">
            <div *ngIf="formSubmit && formSuccess" class="change-success">
                <p class="title">Success!</p>
                <p>Your information has been changed successfully</p>
                <button mat-raised-button (click)="dialogRef.close()" class="ok-button">OK</button>
            </div>
            <div *ngIf="formSubmit && formFail" class="change-fail">
                <p class="title">Error</p>
                <p>{{errorText}}</p>
                <button mat-raised-button (click)="dialogRef.close()" class="ok-button">OK</button>
            </div>
        </div>
        <mat-spinner *ngIf="formStatus=='form-loading'" class="loader"></mat-spinner>
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
    errorText: string;

    userChange: boolean;
    emailChange: boolean;
    bothChange: boolean;

    formSubmit: boolean;
    formSuccess: boolean;
    formFail: boolean;
    formStatus: string;

    constructor(
        public dialogRef: MatDialogRef<EditProfile>,
        @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService) {
        this.username = new FormControl();
        this.email = new FormControl();
        this.userInformation = new FormGroup({username: this.username, email: this.email});
        this.formSubmit = false;
        this.formSuccess = false;
        this.formFail = false;
        this.formStatus = "form-not-submitted";
        this.errorText = "";
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

        if((this.username.value != null && this.username.value.trim() != "") && (this.email.value != null && this.email.value.trim() != "")) {
            this.formStatus="form-loading";
            this.changeUsernameAndEmail();
        } else if(this.username.value != null && this.username.value.trim() != "") {
            this.formStatus = "form-loading";
            this.changeUsername();
        } else if(this.email.value != null && this.email.value.trim() != "") {
            this.formStatus = "form-loading";
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
                this.errorText = "There was an error changing your username and email. Please try again later";
                this.formStatus = "form-submitted";
                this.formSubmit = true;
                this.formFail = true;
            }
        })
    }

    changeUsername() {
        const dataSend = {
            username: this.username.value,
            currentUsername: this.authService.getCurrentUsername()
        };

        this.authService.changeUsername(dataSend).subscribe(data => {
           if(data.success) {
               let newUser = JSON.parse(this.authService.getUserLocal());
               newUser.username = dataSend.username;
               this.authService.setUser(newUser);
               this.authService.setActive(newUser);

               this.originalUsername = this.authService.getCurrentUsername();

               this.formSubmit = true;
               this.formSuccess = true;
               this.userChange = true;
               this.formStatus = "form-submitted";

           } else {
               this.errorText = "There was an error changing your username. Please try again later";
               this.formStatus = "form-submitted";
               this.formSubmit = true;
               this.formFail = true;
           }
        });
    }

    changeEmail() {
        const dataSend = {
            email: this.email.value,
            currentEmail: this.authService.getCurrentEmail()
        };

        this.authService.changeEmail(dataSend).subscribe(data => {
            if(data.success) {
                let newUser = JSON.parse(this.authService.getUserLocal());
                newUser.email = dataSend.email;
                this.authService.setUser(newUser);
                this.authService.setActive(newUser);

                this.originalEmail = this.authService.getCurrentEmail();

                this.formSubmit = true;
                this.formSuccess = true;
                this.userChange = true;
                this.formStatus = "form-submitted";

            } else {
                this.errorText = "There was an error changing your email. Please try again later";
                this.formStatus = "form-submitted";
                this.formSubmit = true;
                this.formFail = true;
            }
        });
    }

}