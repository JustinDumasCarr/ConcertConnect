import {Component, OnInit, ViewChild} from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';



@Component({
    selector: 'app-register-artist',
    templateUrl: './register-artist.component.html',
    styleUrls: ['./register-artist.component.css'],
})
export class RegisterArtistComponent implements OnInit {

    isLinear = false;
    firstFormGroup: FormGroup;

    data: any;
    cropperSettings: CropperSettings;

    name: String;
    email: String;
    description: String;
    genres: String[];
    userId: String; // is this necessary //
    signedRequest: String;
    imageURL: String;
    soundcloudURL: String;
    file: any;

    @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
    constructor(private _formBuilder: FormBuilder, private validateService: ValidateService, private authService: AuthService, private router: Router) {
        this.genres = [];
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.canvasWidth = 400;
        this.cropperSettings.canvasHeight = 400;
        this.cropperSettings.croppedWidth = 400;
        this.cropperSettings.croppedHeight = 400;
        this.cropperSettings.noFileInput = true;
        this.data = {};
    }

    ngOnInit() {
        this.firstFormGroup = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', Validators.required],
            description: ['', Validators.required],
            soundcloudURL: ['', Validators.required],
            facebookURL: ['', Validators.required],
            genres:['',Validators.required]
        });
        this.genres = ['ambient','acoustic','alternative','blues','country','electronic','funk','folk','jazz','hip-hop','metal','pop','rap','rock']
    }

    onRegisterSubmit() {

            let artist = this.firstFormGroup.value;
            artist.userId = JSON.parse(this.authService.getActiveLocal()).userId;
            artist.profileImageURL = this.imageURL;

            // Required Fields
            // if (!this.validateService.validateRegisterArtist(artist)) {
            //     return false;
            // }

            // Validate Email
            // if (!this.validateService.validateEmail(artist.email)) {
            //     return false;
            // }

            // Register artist
            this.authService.registerArtist(artist).subscribe(data => {

                let artistId = data.artistId;

                if (data.success) {
                    this.authService.updateArtistArray(data.artists);

                    this.authService.getAWSUploadURL(artistId + '.jpeg', 'image/jpeg').subscribe(data1 => {
                        this.imageURL = data1.url;
                        this.signedRequest = data1.signedRequest;

                        var imageData = (this.data.image).toString();
                        var byteCharacters = atob(imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
                        var byteNumbers = new Array(byteCharacters.length);
                        for (var i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }

                        var byteArray = new Uint8Array(byteNumbers);
                        var blob = new Blob([byteArray], {
                            type: 'image/jpeg',
                        });

                        let file = new File([blob],artistId + '.jpeg' , {type: 'image/jpeg'});
                        console.log(file);

                        this.authService.saveArtistProfileImageURL({
                            artistId : artistId,
                            profileImageURL: this.imageURL
                        }).subscribe(response =>{
                             console.log(response);

                        });
                        this.authService.putImageToAWS(this.signedRequest, file).subscribe(dataAWS =>{


                        });

                    });



                    } else {
                    console.log("An error has occured");
                }
            });
    }
    fileChangeListener($event) {
        var image:any = new Image();
        this.file = $event.target.files[0];
        var myReader:FileReader = new FileReader();
        var that = this;
        myReader.onloadend = function (loadEvent:any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);

        };
        myReader.readAsDataURL(this.file);
    }
}
