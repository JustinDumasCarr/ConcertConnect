import { Component, Inject, EventEmitter } from '@angular/core';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from "@angular/forms";
import {AuthService} from '../../services/auth.service';

@Component({
    selector: 'demo-jazz-dialog',
    template: `
        <div *ngIf="formStatus=='form-not-submitted'">
            <p class="title">Edit Information</p>
            <form *ngIf="!formSubmit" (ngSubmit)="changeData()" [formGroup]="userInformation">
                <mat-input-container>
                    <input matInput type="text" value="{{venue.name}}" formControlName="venueName">
                </mat-input-container>
                <mat-input-container>
                    <input matInput type="text" value="{{venue.email}}" formControlName="venueEmail">
                </mat-input-container>
                 <mat-input-container>
                    <input matInput type="text" value="{{venue.description}}" formControlName="venueDescription">
                </mat-input-container>
                 <mat-input-container>
                    <input matInput type="text" value="{{venue.capacity}}" formControlName="venueCapacity">
                </mat-input-container>
                 <mat-input-container>
                    <input matInput type="text" value="{{venue.genres[0]}}" formControlName="venueGenre[0]">
                </mat-input-container>
                <div class="button-container">
                    <button mat-raised-button (click)="dialogRef.close()">Cancel</button>
                    <button mat-raised-button type="submit">Save</button>
                </div>
            </form>
        </div>
        <div *ngIf="formStatus=='form-submitted'">
            <div *ngIf="formSubmit && formSuccess" class="change-success">
                <p class="title">Success!</p>
                <p>Your information has been changed successfully</p>
                <button mat-raised-button (click)="dialogRef.close()" color="primary">OK</button>
            </div>
            <div *ngIf="formSubmit && formFail" class="change-fail">
                <p class="title">Success!</p>
                <p>Your information has been changed successfully</p>
                <button mat-raised-button (click)="dialogRef.close()" color="accent">OK</button>
            </div>
        </div>
        <mat-spinner *ngIf="formStatus=='form-loading'" class="loader"></mat-spinner>
       `,
    styleUrls: ['edit.venue.css']
})
export class EditVenue {
    private _dimesionToggle = false;
    userInformation: FormGroup;
    venueName: FormControl;
    venueEmail: FormControl;
    venueDescription: FormControl;
    venueCapacity: FormControl;
    venueGenre: FormControl;


    originalUsername: string;
    originalEmail: string;
    currentUsername: string;
    currentEmail: string;
    errorText: string;

    userChange: boolean;

    formSubmit: boolean;
    formSuccess: boolean;
    formFail: boolean;
    formStatus: string;
    venue: Object;
    updateProfile = new EventEmitter();

    constructor(
        public dialogRef: MatDialogRef<EditVenue>, private route: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService) {
        this.venueName = new FormControl();
        this.venueEmail = new FormControl();
        this.venueDescription = new FormControl();
        this.venueCapacity = new FormControl();
        this.venueGenre = new FormControl();
        this.userInformation = new FormGroup({venueName: this.venueName, venueEmail: this.venueEmail, venueDescription : this.venueDescription, venueCapacity: this.venueCapacity, venueGenre: this.venueGenre});
        this.formSubmit = false;
        this.formSuccess = false;
        this.formFail = false;
        this.formStatus = "form-not-submitted";
        this.venue = this.data;

    }

    ngOnInit() {
    }

    changeData() {
        //Both username and email need to be changed
        if((this.venueName.value != null && this.venueName.value.trim() != "") && (this.venueEmail.value != null && this.venueEmail.value.trim() != "")) {
            this.formStatus="form-loading";
            this.changeNameAndEmail();
        }
    }

    changeNameAndEmail() {
        const dataSend = {
            name: this.venueName.value,
            currentName: this.venue['name'],
            email: this.venueEmail.value,
            currentEmail: this.venue['email']
        };

        const nameData = {
            name: this.venueName.value,
            currentName: this.venue['name']
        };

        this.authService.changeVenueNameProfile(nameData).subscribe(data => {
            if(data.success) {
                // Validate and handle errors here later
            }
        });

        this.authService.changeVenueNameAndEmail(dataSend).subscribe(data => {
            if(data.success) {
                this.venue['name'] =  this.venueName.value;
                this.venue['email'] = this.venueEmail.value;
                this.updateProfile.emit(this.venue);

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