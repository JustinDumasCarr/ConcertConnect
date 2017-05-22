import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {FlashMessagesService} from 'angular2-flash-messages';


@Component({
  selector: 'app-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
})
export class ArtistComponent implements OnInit
{
  id: string;
  artist: Object;
  //Having two separate values ensures that the 'Not found' message does not show up while it's loading
  artistExist: boolean;
  artistNotExist: boolean;
  isArtistDisplay: boolean;

  editEmailField: boolean;
  editNameField: boolean;

  nameField: string;
  emailField: string;

  constructor(private route: ActivatedRoute,private authService: AuthService,private flashMessage:FlashMessagesService)
  {
      this.editEmailField = false;
      this.editNameField = false;
  }

  ngOnInit() {
      this.route.params.forEach(params => {
          this.id = params['id'];
          this.artist = {"name": this.id};
          this.artist = JSON.stringify(this.artist);
          this.authService.getArtistProfile(this.artist).subscribe(data => {
              if (data == "") {
                  this.artistNotExist = true;
              }
              else {
                  this.artist = data;
                  this.artistExist = true;
              }

              this.isArtist();
            },
          err => {
              console.log(err);
              return false;
          }
          );
      })
     }



     isArtist() {
         let artists = this.authService.getArtists();
         for(let i=0; i<artists.length; i++) {
             if(artists[i].name==this.artist['name']) {
                 this.isArtistDisplay = true;
             }
         }
     }

     changeName() {
         if(this.nameField == undefined || this.nameField == "" || this.nameField == null) {
             this.errorMessage("Please do not leave any empty fields");
             return false;
         }

         //Backend code here
         const dataSend = {
             name: this.nameField,
             currentName: this.artist['name']
         };


         this.authService.changeArtistName(dataSend).subscribe(data => {
             if(data.success) {

                 this.flashMessage.show('You have successfully changed your name', {cssClass: 'alert-success', timeout: 3000});

                 let getArtist = {name: dataSend.name};
                 this.authService.getArtistProfile(JSON.stringify(getArtist)).subscribe(profile => {

                 this.artist = profile;
                 this.editNameField = false;

                     this.authService.changeArtistNameProfile(dataSend).subscribe(data => {
                         if(data.success) {

                             let artistArray = this.authService.getArtists();
                             let newArtist;
                             for (let i = 0; i < artistArray.length; i++) {
                                 if (artistArray[i].name == dataSend.currentName) {
                                     newArtist = artistArray[i];
                                     break;
                                 }
                             }
                             newArtist.name = dataSend.name;
                             this.authService.setActive(newArtist);

                             let tempUser = JSON.parse(this.authService.getUserLocal());
                             for (let i = 0; i<tempUser.artists.length; i++) {
                                 if (tempUser.artists[i].name == dataSend.currentName) {
                                     tempUser.artists[i].name = dataSend.name;
                                     this.authService.setUser(tempUser);
                                 }
                             }
                         }
                         else {
                             this.errorMessage('An error has occured');
                         }
                     });

             },
             err => {
                 console.log(err);
                 return false;
             });


             }
             else
             {
                 this.errorMessage('The username you have chosen is already in use');
             }
         });

     }


     changeEmail() {
      console.log(this.emailField);
         if(this.emailField == undefined || this.emailField == "" || this.emailField == null) {
             this.errorMessage("Please do not leave any empty fields");
             return false;
         }

         //Backend code here
         const dataSend = {
             email: this.emailField,
             currentEmail: this.artist['email']
         };


         this.authService.changeArtistEmail(dataSend).subscribe(data => {
             if(data.success) {

                 this.flashMessage.show('You have successfully changed your email', {cssClass: 'alert-success', timeout: 3000});

                 let getArtist = {name: this.artist['name']};

                 this.authService.getArtistProfile(JSON.stringify(getArtist)).subscribe(profile => {

                         this.artist = profile;
                         this.editNameField = false;

                         this.authService.changeArtistEmailProfile(dataSend).subscribe(data => {
                             if(data.success) {

                                 let artistArray = this.authService.getArtists();
                                 let newArtist;
                                 for (let i = 0; i < artistArray.length; i++) {
                                     if (artistArray[i].email == dataSend.currentEmail) {
                                         newArtist = artistArray[i];
                                         break;
                                     }
                                 }
                                 newArtist.email = dataSend.email;
                                 this.authService.setActive(newArtist);

                                 let tempUser = JSON.parse(this.authService.getUserLocal());
                                 for (let i = 0; i<tempUser.artists.length; i++) {
                                     if (tempUser.artists[i].email == dataSend.currentEmail) {
                                         tempUser.artists[i].email = dataSend.email;
                                         this.authService.setUser(tempUser);
                                     }
                                 }
                             }
                             else {
                                 this.errorMessage('An error has occured');
                             }
                         });

                     },
                     err => {
                         console.log(err);
                         return false;
                     });
             }
             else
             {
                 this.errorMessage('The username you have chosen is already in use');
             }
         });

     }

    toggleEditName() {
        if(this.editNameField == false) {
            this.editNameField = true;
            return false;
        }
        if(this.editNameField == true) {
            this.editNameField = false;
            return false;
        }
    }

    toggleEditEmail() {
        if(this.editEmailField == false) {
            this.editEmailField = true;
            return false;
        }

        if(this.editEmailField == true) {
            this.editEmailField = false;
            return false;
        }
    }

    errorMessage(message) {
        this.flashMessage.show(message, {
            cssClass: 'alert-danger',
            timeout: 5000});
    }

}

