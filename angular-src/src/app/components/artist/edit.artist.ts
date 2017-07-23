import { Component, Inject, EventEmitter } from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from "@angular/forms";
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'demo-jazz-dialog',
    template: `
        <div *ngIf="formStatus=='form-not-submitted'">
            <p class="title">Edit Information</p>
            <form *ngIf="!formSubmit" (ngSubmit)="changeData()" [formGroup]="userInformation">
                <md-input-container>
                    <input mdInput type="text" value="{{artist.name}}" formControlName="artistName">
                </md-input-container>
                <md-input-container>
                    <input mdInput type="text" value="{{artist.email}}" formControlName="artistEmail">
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
    artistName: FormControl;
    artistEmail: FormControl;

    originalUsername: string;
    originalEmail: string;
    currentUsername: string;
    currentEmail: string;

    userChange: boolean;

    formSubmit: boolean;
    formSuccess: boolean;
    formFail: boolean;
    formStatus: string;
    artist: Object;
    updateProfile = new EventEmitter();

    constructor(
        public dialogRef: MdDialogRef<EditArtist>, private route: ActivatedRoute,
        @Inject(MD_DIALOG_DATA) public data: any, private authService: AuthService) {
        this.artistName = new FormControl();
        this.artistEmail = new FormControl();
        this.userInformation = new FormGroup({artistName: this.artistName, artistEmail: this.artistEmail});
        this.formSubmit = false;
        this.formSuccess = false;
        this.formFail = false;
        this.formStatus = "form-not-submitted";
        this.artist = this.data;

    }

    ngOnInit() {
    }

    changeData() {
        //Both username and email need to be changed
        if((this.artistName.value != null && this.artistName.value.trim() != "") && (this.artistEmail.value != null && this.artistEmail.value.trim() != "")) {
            this.formStatus="form-loading";
            this.changeNameAndEmail();
        }
    }

    changeNameAndEmail() {
        console.log("Name and email function called");

        const dataSend = {
          name: this.artistName.value,
          currentName: this.artist['name'],
          email: this.artistEmail.value,
          currentEmail: this.artist['email']
        };

        const nameData = {
          name: this.artistName.value,
          currentName: this.artist['name']
        };

        this.authService.changeArtistNameProfile(nameData).subscribe(data => {
            if(data.success) {
             // Validate and handle errors here later
            }
        });

        this.authService.changeArtistNameAndEmail(dataSend).subscribe(data => {
           if(data.success) {
               this.artist['name'] =  this.artistName.value;
               this.artist['email'] = this.artistEmail.value;
               this.updateProfile.emit(this.artist);

               this.formSubmit = true;
               this.formSuccess = true;
               this.userChange = true;
               this.formStatus = "form-submitted";

           } else {
               this.formSubmit = true;
               this.formSuccess = false;
           }
        });
    }
}