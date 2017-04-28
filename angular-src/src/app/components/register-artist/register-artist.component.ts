import {Component, OnInit} from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';


@Component({
    selector: 'app-register-artist',
    templateUrl: './register-artist.component.html',
    styleUrls: ['./register-artist.component.css']
})
export class RegisterArtistComponent implements OnInit {


    name: String;
    email: String;
    userId: String; // is this necessary
    signedRequest: String;
    imageURL: String;
    file : any;

    constructor(private validateService: ValidateService,
                private flashMessage: FlashMessagesService,
                private authService: AuthService,
                private router: Router) {
    }

    ngOnInit() {
    }

    onRegisterSubmit() {


        const artist = {
            name: this.name,
            email: this.email,
            userId: JSON.parse(localStorage.getItem('user')).id,
            imageURL : this.imageURL
        };

        // Required Fields
        if (!this.validateService.validateRegisterArtist(artist)) {
            this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
            return false;
        }

        // Validate Email
        if (!this.validateService.validateEmail(artist.email)) {
            this.flashMessage.show('Please use a valid email', {cssClass: 'alert-danger', timeout: 3000});
            return false;
        }

        // Register artist
        this.authService.registerArtist(artist).subscribe(data => {
            if (data.success) {
                this.flashMessage.show('Artist registered', {cssClass: 'alert-success', timeout: 3000});
                this.authService.updateArtistArray(data.artists);

                this.authService.putImageToAWS(this.signedRequest, this.file).subscribe(data => {

                });

            } else {
                this.flashMessage.show('Artist name already exists', {cssClass: 'alert-danger', timeout: 3000});
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
