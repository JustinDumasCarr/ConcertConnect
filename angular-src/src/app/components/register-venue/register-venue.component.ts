import {Component, OnInit} from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router';
@Component({
    selector: 'app-register-venue',
    templateUrl: './register-venue.component.html',
    styleUrls: ['./register-venue.component.css']
})
export class RegisterVenueComponent implements OnInit {

    name: String;
    email: String;
    userId: String; // is this necessary
    signedRequest: String;
    imageURL: String;
    genres: String[];
    description: String;
    location: String;
    capacity: String;
    hours: String;
    file: any;

    rock: boolean = false;
    jazz: boolean = false;
    country: boolean = false;
    reggae: boolean = false;
    electronic: boolean = false;

    constructor(private validateService: ValidateService,
                private authService: AuthService,
                private router: Router) {
        this.genres = [];
    }

    ngOnInit() {
    }

    onRegisterSubmit() {

        console.log("Register function has been pressed");

        //Change logic to all multiple genres later
        if(this.rock == true) {
            this.genres.push("Rock");
        }
        if(this.jazz == true) {
            this.genres.push("Jazz");
        }
        if(this.country == true) {
            this.genres.push("Country");
        }
        if(this.reggae == true) {
            this.genres.push("Reggae");
        }
        if(this.electronic == true) {
            this.genres.push("Electronic");
        }

        const venue = {
            name: this.name,
            email: this.email,
            description: this.description,
            genres: this.genres,
            location: this.location,
            capacity: this.capacity,
            hours: this.hours,
            userId: JSON.parse(localStorage.getItem('user')).id,
            imageURL: this.imageURL
        };

        console.log("VENUE VALUE: ");
        console.log(venue);

        // Required Fields
        if (!this.validateService.validateRegisterVenue(venue)) {
            return false;
        }

        // Validate Email
        if (!this.validateService.validateEmail(venue.email)) {
            return false;
        }

        // Register venue
        this.authService.registerVenue(venue).subscribe(data => {

            console.log("Register Venue request");
            console.log(data);

            if (data.success) {

                console.log("Register Venue Success");

                this.authService.updateVenueArray(data.venues);
                this.authService.putImageToAWS(this.signedRequest, this.file).subscribe(data => {
                });
            } else {
            }
        });

    }

    imageUploadedToBrowser(event) {

        //split join removes whitespace
        this.authService.getAWSUploadURL(event.file.name.split(' ').join(''), event.file.type).subscribe(data => {
            this.signedRequest = data.signedRequest;
            this.imageURL = data.url;
            this.file = event.file;
        });
    }
}
