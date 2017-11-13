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
            <div *ngIf="!formSubmit">
                <mat-input-container>
                    <input matInput type="text" value="name" [(ngModel)]="venueName">
                </mat-input-container>
                <mat-input-container>
                    <input matInput type="text" value="email" [(ngModel)]="venueEmail">
                </mat-input-container>
                <mat-input-container>
                    <input matInput type="text" value="location" [(ngModel)]="venueLocation">
                </mat-input-container>
                 <mat-input-container>
                    <input matInput type="text" value="description" [(ngModel)]="venueDescription">
                </mat-input-container>
                 <mat-input-container>
                    <input matInput type="text" value="capacity" [(ngModel)]="venueCapacity">
                </mat-input-container>
                <mat-input-container>
                    <input matInput type="text" value="hours" [(ngModel)]="venueHours">
                </mat-input-container>
                <div class="chips-wrapper">
                    <td-chips placeholder="Enter a genre" [(ngModel)]="venueGenres"></td-chips>
                </div>
                <div class="button-container">
                    <button mat-raised-button (click)="dialogRef.close()">Cancel</button>
                    <button mat-raised-button (click)="changeData()" type="submit">Save</button>
                </div>
            </div>
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

    venueName: string;
    venueEmail: string;
    venueLocation: string;
    venueDescription: string;
    venueCapacity: number;
    venueHours: string;
    venueGenres: string[];

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
        this.formSubmit = false;
        this.formSuccess = false;
        this.formFail = false;
        this.formStatus = "form-not-submitted";
        this.venue = this.data;

        this.venueName = this.venue['name'];
        this.venueEmail = this.venue['email'];
        this.venueLocation = this.venue['location'];
        this.venueDescription = this.venue['description'];
        this.venueCapacity = this.venue['capacity'];
        this.venueHours = this.venue['hours'];
        this.venueGenres = JSON.parse(JSON.stringify(this.venue['genres']));
    }

    ngOnInit() {
    }

    changeData() {
        const dataSend = {
            _id: this.venue['_id'],
            name: this.venueName,
            email: this.venueEmail,
            location: this.venueLocation,
            description: this.venueDescription,
            capacity: this.venueCapacity,
            hours: this.venueHours,
            genres: this.venueGenres
        };
        
        this.authService.changeVenueInformation(dataSend).subscribe(data => {
            //Reload current artist page dat
            this.authService.getVenueProfile(this.venue).subscribe(data => {
                    this.venue['name'] = data['name'];
                    this.venue['email'] = data['email'];
                    this.venue['location'] = data['location'];
                    this.venue['description'] = data['description'];
                    this.venue['capacity'] = data['capacity'];
                    this.venue['hours'] = data['hours'];
                    this.venue['genres'] = data['genres'];
                },
                err => {
                    console.log(err);
                }
            );
        });
    }
}