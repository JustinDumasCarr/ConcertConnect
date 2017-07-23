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
    file: any;

    constructor(private validateService: ValidateService,
                private authService: AuthService,
                private router: Router) {
    }

    ngOnInit() {
    }

    onRegisterSubmit() {


        const venue = {
            name: this.name,
            email: this.email,
            userId: JSON.parse(localStorage.getItem('user')).id,
            imageURL: this.imageURL
        };

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
            if (data.success) {
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
