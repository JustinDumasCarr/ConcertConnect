import {Component, OnInit, ViewChild} from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-register-venue',
    templateUrl: './register-venue.component.html',
    styleUrls: ['./register-venue.component.css']
})
export class RegisterVenueComponent implements OnInit {

    isLinear = false;
    firstFormGroup: FormGroup;

    data: any;
    cropperSettings: CropperSettings;


    name: String;
    email: String;
    userId: String; // is this necessary
    signedRequest: String;
    imageURL: String;
    genres: string[];
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

    @ViewChild('cropper', undefined) cropper:ImageCropperComponent;
    constructor(private _formBuilder: FormBuilder,
                private validateService: ValidateService,
                private authService: AuthService,
                private router: Router) {

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
            location: ['', Validators.required],
            capacity: ['', Validators.required],
            hours: ['', Validators.required],
            faceBookURL: ['', Validators.required],
            genres:['',Validators.required]
        });
        this.genres = ['ambient','acoustic','alternative','blues','country','electronic','funk','folk','jazz','hip-hop','metal','pop','rap','rock']

    }
    onRegisterSubmit() {



        let venue = this.firstFormGroup.value;
        venue.userId = JSON.parse(this.authService.getActiveLocal()).userId;
        venue.profileImageURL = this.imageURL;

        // Required Fields
        // if (!this.validateService.validateRegisterArtist(artist)) {
        //     return false;
        // }

        // Validate Email
        // if (!this.validateService.validateEmail(artist.email)) {
        //     return false;
        // }

        this.authService.registerVenue(venue).subscribe(data => {

            let venueId = data.venueId;

            if (data.success) {
                this.authService.updateVenueArray(data.venues);
                this.authService.getAWSUploadURL(venueId + '.jpeg', 'image/jpeg').subscribe(data1 => {
                    this.imageURL = data1.url;
                    this.signedRequest = data1.signedRequest;

                    var imageData = (this.data.image).toString();
                    var byteCharacters = atob(imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
                    var byteNumbers = new Array(byteCharacters.length);
                    for (var i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);
                    var blob = new Blob([ byteArray ], {
                        type : 'image/jpeg',
                    });

                    let file = new File([blob],'adele.jpeg',{type : 'image/jpeg'});
                    console.log(file);


                    this.authService.saveVenueProfileImageURL({
                        venueId : venueId,
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
