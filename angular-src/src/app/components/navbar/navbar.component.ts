import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

declare let jQuery: any;


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
  initializeCounter: number;

  userName: String;


  constructor(private authService: AuthService,
              private router: Router,
              private flashMessage: FlashMessagesService) {

    this.initializeCounter = 0;

    //Possible receive this value later
    this.profileCurrent = false;
    this.profileValue = '';


    if (JSON.parse(localStorage.getItem('active')) == null) {
      this.toggleValue = "Toggle User";
    }
    else {
      this.toggleValue = JSON.parse(localStorage.getItem('active'))._id;
    }


    router.events.subscribe(event => {
      if (event.constructor.name === "NavigationEnd") {
        console.log(event['url']);
        if (event['url'] == "/profile") {
          this.profileValue = 'active';
        }
        if (event['url'].includes("/venue")) {
          this.profileValue = 'active';
        }
        if (event['url'].includes("/artist")) {
          this.profileValue = 'active';
        }
        if (!(event['url'] == "/profile" || event['url'].includes("/venue") || event['url'].includes("/artist"))) {
          this.profileValue = '';
        }

      }
    });

  }

  ngOnInit()
  {
    if(this.authService.loggedIn()) {
      this.userName = JSON.parse(localStorage.getItem('user')).name;
    }

//    jQuery('.ui.dropdown').dropdown();


    // setTimeout(() => {
    //   jQuery('.ui.dropdown').dropdown();
    // }, 1)
  }

  ngAfterViewInit() {
//   jQuery('.ui.dropdown').dropdown();
  }

  ngAfterViewChecked() {

  //  jQuery('.ui.dropdown').dropdown({action:'nothing'});
 //   this.initializeCounter++;

   // if ((this.initializeCounter-2) % 7 == 0) {
    //  console.log("RUN ONCE");
   //   jQuery('.ui.dropdown').dropdown();
  //  }

 //   console.log(this.initializeCounter);
  }

  onLogoutClick() {
    this.authService.logout();
    this.flashMessage.show('You are logged out', {
      cssClass: 'alert-success',
      timeout: 3000
    });
    this.router.navigate(['/login']);
    this.toggleValue = "Toggle User";
    return false;
  }

  changeUser()
  {
    this.toggleValue = this.userName;
    this.router.navigate(['/profile']);
    this.authService.setActive(JSON.parse(localStorage.getItem('user')));
    return false;
  }

  changeUserArtist(selectedArtist,newID)
  {

    console.log("newID: "+ newID);
    this.toggleValue = newID;
    this.authService.setActive(selectedArtist);
    this.router.navigate(['/artist',newID]);
    return false;
  }

  changeUserVenue(selectedVenue,newID)
  {
    this.toggleValue = newID;
    this.authService.setActive(selectedVenue);
    this.router.navigate(['/venue',newID]);
    return false;
  }

  profileClick()
  {


    if(JSON.parse(localStorage.getItem('active')).type == 'user')
    {
      let profile_id = JSON.parse(localStorage.getItem('active'))._id;
      this.router.navigate(['/profile']);
    }

    if(JSON.parse(localStorage.getItem('active')).type == 'artist')
    {
      let profile_id = JSON.parse(localStorage.getItem('active')).artistId;
      console.log(profile_id);
      this.router.navigate(['/artist',profile_id]);
    }

    if(JSON.parse(localStorage.getItem('active')).type == 'venue')
    {
      let profile_id = JSON.parse(localStorage.getItem('active')).venueId;
      console.log(profile_id);
      this.router.navigate(['/venue',profile_id]);
    }

  }


}
