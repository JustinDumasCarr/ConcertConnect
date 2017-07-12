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

        //Don't forget to reset boolean values before and after data is changed
        console.log("Testing form input");
        console.log(this.username.value);
        console.log(this.email.value);

        console.log("Change data function has been pressed");
        //Set the placeholder to be the current username

        //Both username and email need to be changed
        if((this.username.value != null && this.username.value.trim() != "") && (this.email.value != null && this.email.value.trim() != "")) {
            this.formStatus="form-loading";
            //Use callback function here. When the function starts, it will trigger the loading state. When the function
            //ends (both userChange and emailChange are true then move to the finished state => display success message)
            this.changeBoth("");
        }




        if(this.username.value != null && this.username.value.trim() != "") {
            this.changeUsername();
        }

        if(this.email.value != null && this.email.value.trim() != "") {
            this.changeEmail();
        }


        //Next steps:
        // On submit, it will execute the existing logic and change the username and email for the user


        //Check to see if the username is unchanged

        //Check to see if the password if unchanged
    }


    changeBoth(callback) {
        this.formStatus = "form-submitted";
        if(this.userChange ==  true && this.emailChange == true) {
            callback();
        }
    }

    changeUsername() {


        //Backend code here
        const dataSend = {
            username: this.username.value,
            currentUsername: this.authService.getCurrentUsername()
        };

        this.authService.changeUsername(dataSend).subscribe(data => {
            if(data.success) {

                //
                // this.authService.getProfile().subscribe(profile => {
                //        // this.user = profile.user;
                //     },
                //     err => {
                //         console.log(err);
                //         return false;
                //     });
               // this.editUsernameField = false;
                //Reloads local storage data with new values
                let newUser = JSON.parse(this.authService.getUserLocal());
                newUser.username = dataSend.username;
                this.authService.setUser(newUser);
                this.authService.setActive(newUser);

                this.formSubmit = true;
                this.formSuccess = true;
                this.userChange = true;
            }
            else {
                this.formSubmit = true;
                this.formSuccess = false;
                //alert('The username you have chosen is already in use');
            }
        });
    }

    changeEmail() {

        //Backend code here
        const dataSend = {
            email: this.email.value,
            currentEmail: this.authService.getCurrentEmail()
        };

        this.authService.changeEmail(dataSend).subscribe(data => {
            if(data.success) {
                // this.flashMessage.show('You have successfully changed your email', {cssClass: 'alert-success', timeout: 3000});
                this.authService.getProfile().subscribe(profile => {
                        // this.user = profile.user;
                    },
                    err => {
                        console.log(err);
                        return false;
                    });
                // this.editEmailField = false;

                //Reloads local storage data with new values
                let newUser = JSON.parse(this.authService.getUserLocal());
                newUser.email = dataSend.email;
                this.authService.setUser(newUser);
                this.authService.setActive(newUser);

                this.formSubmit = true;
                this.formSuccess = true;
                this.emailChange = true;

            }
            else {
                // this.errorMessage('The email you have chosen is already in use');
                this.formSubmit = true;
                this.formSuccess = false;
                return false;
            }
        });
    }
}