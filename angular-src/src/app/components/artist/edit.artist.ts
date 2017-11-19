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
                    <input matInput placeholder="Name" type="text" value="name" [(ngModel)]="name">
                </mat-input-container>
                <mat-input-container>
                    <input matInput placeholder="Email" type="text" value="email" [(ngModel)]="email">
                </mat-input-container>
                <mat-input-container>
                    <input matInput placeholder="Description" type="text" value="description" [(ngModel)]="description">
                </mat-input-container>
                <mat-input-container>
                    <input matInput placeholder="SoundCloud URL" type="text" value="soundcloudURL" [(ngModel)]="soundcloudURL">
                </mat-input-container>
                <div class="chips-wrapper">
                    <td-chips placeholder="Enter a genre" [(ngModel)]="genres"></td-chips>
                </div>
                <div class="button-container">
                    <button mat-raised-button (click)="dialogRef.close()" color="accent">Cancel</button>
                    <button mat-raised-button (click)="changeData()" type="submit" color="primary">Save</button>
                </div>
            </div>
        </div>
        <div *ngIf="formStatus=='form-submitted'">
            <div *ngIf="formSubmit && formSuccess" class="change-success">
                <p class="title">Success!</p>
                <p>Your information has been changed successfully</p>
                <button mat-raised-button (click)="dialogRef.close()">OK</button>
            </div>
            <div *ngIf="formSubmit && formFail" class="change-fail">
                <p class="title">Error</p>
                <p>Your information has been changed successfully</p>
                <button mat-raised-button (click)="dialogRef.close()">OK</button>
            </div>
        </div>
        <mat-spinner *ngIf="formStatus=='form-loading'" class="loader"></mat-spinner>
       `,
    styleUrls: ['edit.artist.css']
})
export class EditArtist {
    private _dimesionToggle = false;

    originalUsername: string;
    originalEmail: string;
    currentUsername: string;
    currentEmail: string;
    errorText: string;

    name: string;
    email: string;
    description: string;
    soundcloudURL: string;
    genres: string[];

    userChange: boolean;

    formSubmit: boolean;
    formSuccess: boolean;
    formFail: boolean;
    formStatus: string;
    artist: Object;
    updateProfile = new EventEmitter();

    constructor(
        public dialogRef: MatDialogRef<EditArtist>, private route: ActivatedRoute,
        @Inject(MAT_DIALOG_DATA) public data: any, private authService: AuthService) {
        this.formSubmit = false;
        this.formSuccess = false;
        this.formFail = false;
        this.formStatus = "form-not-submitted";
        this.artist = this.data;
        this.errorText = "";

        this.name = this.artist['name'];
        this.email = this.artist['email'];
        this.description = this.artist['description'];
        this.soundcloudURL = this.artist['soundcloudURL'];
        this.genres = JSON.parse(JSON.stringify(this.artist['genres']));

    }

    ngOnInit() {
    }

    changeData() {
        const dataSend = {
            _id: this.artist['_id'],
            name: this.name,
            email: this.email,
            description: this.description,
            soundcloudURL: this.soundcloudURL,
            genres: this.genres
        };

        this.authService.changeArtistInformation(dataSend).subscribe(data => {
            this.authService.getArtistProfile(this.artist).subscribe(data => {
                this.artist['name'] = data['name'];
                this.artist['email'] = data['email'];
                this.artist['description'] = data['description'];
                this.artist['soundcloudURL'] = data['souncloudURL'];
                this.artist['genres'] = data['genres'];
                },
                err => {
                    console.log(err);
                }
            );

        });
    }

}