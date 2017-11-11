import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
import {
    TdBounceAnimation,
    TdFlashAnimation,
    TdHeadshakeAnimation,
    TdJelloAnimation,
    TdPulseAnimation,
} from '@covalent/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  animations: [
    TdBounceAnimation(), // using implicit anchor name 'tdBounce' in template
    TdFlashAnimation(), // using implicit anchor name 'tdFlash' in template
    TdHeadshakeAnimation(), // using implicit anchor name 'tdHeadshake' in template
    TdJelloAnimation(), // using implicit anchor name 'tdJello' in template
    TdPulseAnimation(), // using implicit anchor name 'tdPulse' in template
  ],
})
export class NavbarComponent implements OnInit {

  //Possibly delete later
  profileCurrent: boolean;
  profileValue: String;
  toggleValue: String;
  initializeCounter: number;
  subscription: any;


  userName: String;

  currentActiveAccount: string;




  items = [
    {text: 'Refresh'},
    {text: 'Settings'},
    {text: 'Help', disabled: true},
    {text: 'Sign Out'}
  ];


  //animations
  bounceState: boolean = false;
  flashState: boolean = false;
  headshakeState: boolean = false;
  jelloState: boolean = false;
  pulseState: boolean = false;


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


      this.subscription = this.authService.logChange$.subscribe(
          log => {
            if(log == true) {
              if(this.currentActiveAccount != JSON.parse(this.authService.getActiveLocal())['name']) {
                  this.currentActiveAccount = JSON.parse(this.authService.getActiveLocal())['name'];
              }
            }
          });

  }

  ngOnInit()
  {
    if(this.authService.loggedIn()) {
        this.currentActiveAccount = JSON.parse(this.authService.getActiveLocal())['name'];
        // this.userName = JSON.parse(localStorage.getItem('user')).name;
    }
  }

  onLogoutClick() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.toggleValue = "Toggle User";
    return false;
  }

  changeUser()
  {
    this.toggleValue = this.userName;
    this.router.navigate(['/profile']);
    this.authService.setActive(JSON.parse(localStorage.getItem('user')));
    this.currentActiveAccount = JSON.parse(this.authService.getActiveLocal())['name'];
    return false;
  }

  changeUserArtist(selectedArtist,newID)
  {
    console.log("Change user artist function called");
    console.log("newID: "+ newID);
    this.toggleValue = newID;
    this.authService.setActive(selectedArtist);
    this.router.navigate(['/artist',newID]);
    this.currentActiveAccount = JSON.parse(this.authService.getActiveLocal())['name'];
    return false;
  }

  trackByArtist(obj: any) {
      return obj.artistId;
  }

  trackByVenue(obj: any) {
    return obj.venueId;
  }


    changeUserVenue(selectedVenue,newID)
  {
    console.log("Change user venue function called");
    this.toggleValue = newID;
    this.authService.setActive(selectedVenue);
    this.router.navigate(['/venue',newID]);
    this.currentActiveAccount = JSON.parse(this.authService.getActiveLocal())['name'];
    return false;
  }

  settingsProfileClick(){

    this.router.navigate(['/profile']);
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
