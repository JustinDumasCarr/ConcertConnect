import {Component, OnInit} from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router';

@Component({
    selector: 'app-register-artist',
    templateUrl: './register-artist.component.html',
    styleUrls: ['./register-artist.component.css']
})
export class RegisterArtistComponent implements OnInit {

    name: String;
    email: String;
    description: String;
    genres: String[];
    userId: String; // is this necessary //
    signedRequest: String;
    imageURL: String;
    soundcloudURL: String;
    file: any;

    rock: boolean = false;
    jazz: boolean = false;
    country: boolean = false;
    reggae: boolean = false;
    electronic: boolean = false;

    constructor(private validateService: ValidateService, private authService: AuthService, private router: Router) {
        this.genres = [];
    }

    ngOnInit() {
    }

    onRegisterSubmit() {

        const artist = {
            name: this.name,
            email: this.email,
            description: this.description,
            genres: this.genres,
            userId: JSON.parse(localStorage.getItem('user'))._id,
            imageURL: this.imageURL,
            soundcloudURL: this.soundcloudURL
        };

        // Required Fields
        if (!this.validateService.validateRegisterArtist(artist)) {
            return false;
        }

        // Validate Email
        if (!this.validateService.validateEmail(artist.email)) {
            return false;
        }

        // Register artist
        this.authService.registerArtist(artist).subscribe(data => {
            if (data.success) {
                this.authService.updateArtistArray(data.artists);
                console.log("signedRequest: " + this.signedRequest);
                this.authService.putImageToAWS(this.signedRequest, this.file).subscribe(data => {

                });

            } else {
                console.log("An error has occured");
            }
        });

    }

    imageUploadedToBrowser(event) {

        //split join removes whitespace
        this.authService.getAWSUploadURL(event.file.name.split(' ').join(''), event.file.type).subscribe(data => {
            console.log("imageUrl: " + this.imageURL);
            this.signedRequest = data.signedRequest;
            this.imageURL = data.url;
            this.file = event.file;
        });
    }
}
