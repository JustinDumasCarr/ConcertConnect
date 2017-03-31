import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  //Possibly delete later
  profileCurrent: boolean;
  profileValue: String;
  toggleValue: String;

  constructor(
    private authService:AuthService,
    private router:Router,
    private flashMessage:FlashMessagesService) {


    //Possible receive this value later
    this.profileCurrent = false;
    this.profileValue = '';



    if (JSON.parse(localStorage.getItem('active')) == null) {
      this.toggleValue = "Toggle User";
    }
    else {
      this.toggleValue = JSON.parse(localStorage.getItem('active')).name;
    }



    router.events.subscribe(event =>
    {
      if(event.constructor.name === "NavigationEnd")
      {
        console.log(event.url);
        if(event.url =="/profile")
        {
          this.profileValue = 'active';
        }
        if(event.url.includes("/venue"))
        {
          this.profileValue = 'active';
        }
        if(event.url.includes("/artist"))
        {
          this.profileValue = 'active';
        }
        if(!(event.url =="/profile" || event.url.includes("/venue") || event.url.includes("/artist")))
        {
          this.profileValue = '';
        }

      }
    });

  }

  ngOnInit()
  {
  }

  onLogoutClick(){
    this.authService.logout();
    this.flashMessage.show('You are logged out', {
      cssClass:'alert-success',
      timeout: 3000
    });
    this.router.navigate(['/login']);
    return false;
  }


  changeUserArtist(selectedArtist,newName)
  {
    this.toggleValue = newName;
    this.authService.setActive(selectedArtist);

    console.log(selectedArtist);
    this.router.navigate(['/artist',newName]);
    return false;
  }

  changeUserVenue(selectedVenue,newName)
  {
    this.toggleValue = newName;
    this.authService.setActive(selectedVenue);

    this.router.navigate(['/venue',newName]);
    return false;
  }

  profileClick()
  {
    console.log("CURRENT PROFILE TYPE");
    console.log(JSON.parse(localStorage.getItem('active')).type);

    console.log("CURRENT PROFILE NAME");
    let profileName = JSON.parse(localStorage.getItem('active')).name;
    console.log(profileName);

    if(JSON.parse(localStorage.getItem('active')).type == 'user')
    {
      this.router.navigate(['/profile']);
    }

    if(JSON.parse(localStorage.getItem('active')).type == 'artist')
    {
      this.router.navigate(['/artist'],profileName);
    }

    if(JSON.parse(localStorage.getItem('active')).type == 'venue')
    {
      this.router.navigate(['/venue'],profileName);
    }


  }


}
