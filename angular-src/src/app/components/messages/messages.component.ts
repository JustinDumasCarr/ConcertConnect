import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MessagesComponent implements OnInit {


  inboxEmpty: boolean;

  constructor(private authService: AuthService) {

  }

  ngOnInit() {

    this.inboxEmpty = false;

    // Currently only checks for incoming requests, add messages later
    let currentUser = JSON.parse(this.authService.getActiveLocal());

    console.log(currentUser);
    console.log("Current user id testing");
    console.log(currentUser['_id']);


    // Check if current user is artist or venue
    if(currentUser['type'] == 'artist') {
        let artist = { artistId: currentUser['_id'], artistName: currentUser['name']};
        this.authService.getCurrentRequestsArtist(artist).subscribe(response => {
          console.log("Response");
          console.log(response);
          if(response['requestData'].length > 0) {
            console.log("There is at least one request");
          }
        });
    } else if(currentUser['type'] == 'venue') {

    } else {
      // Not sure if normal user is going to have messages
    }
  }

}
