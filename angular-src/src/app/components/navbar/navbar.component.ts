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


  toggleValue: String;

  constructor(
    private authService:AuthService,
    private router:Router,
    private flashMessage:FlashMessagesService)
    {

      if (JSON.parse(localStorage.getItem('active')) == null) {
        this.toggleValue = "Toggle User";
      }
      else {
        this .toggleValue = JSON.parse(localStorage.getItem('active')).name;}
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

    console.log(selectedVenue);
    this.router.navigate(['/venue',newName]);
    return false;
  }

}
