import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: Object;

  editUsernameField: boolean;
  editEmailField: boolean;

  usernameField: string;
  emailField: string;


  constructor(private authService: AuthService, private router: Router,private flashMessage:FlashMessagesService)
  { }

  ngOnInit()
  {

    this.editUsernameField = false;
    this.editEmailField = false;

    this.authService.getProfile().subscribe(profile => {
          this.user = profile.user;
    },
    err => {
      console.log(err);
      return false;
    });

  }

  toggleEditUsername()
  {

    if(this.editUsernameField == false)
    {
      this.editUsernameField = true;
      return false;
    }

    if(this.editUsernameField == true)
    {
      this.editUsernameField = false;
      return false;
    }

  }

  toggleEditEmail()
  {
    if(this.editEmailField == false)
    {
      this.editEmailField = true;
      return false;
    }

    if(this.editEmailField == true)
    {
      this.editEmailField = false;
      return false;
    }
  }

  changeUsername()
  {
    if(this.usernameField == undefined || this.usernameField == "" || this.usernameField == null)
    {
      this.errorMessage("Please do not leave any empty fields");
      return false;
    }

    //Backend code here
    const data = {
      username: this.usernameField,
      currentUsername: this.authService.getCurrentUsername()
    };

    this.authService.changeUsername(data).subscribe(data => {
      if(data.success)
      {
        this.flashMessage.show('You have successfully changed your username', {cssClass: 'alert-success', timeout: 3000});
      }
      else
      {
        this.errorMessage('The username you have chosen is already in use');
      }
    });

    //Need to reload local storage data here



  }

  changeEmail()
  {

    if(this.emailField == undefined || this.emailField == "" || this.emailField == null)
    {
      this.errorMessage("Please do not leave any empty fields");
      return false;
    }

    //Backend code here

  }

  errorMessage(message)
  {
    this.flashMessage.show(message, {
      cssClass: 'alert-danger',
      timeout: 5000});
  }

}
