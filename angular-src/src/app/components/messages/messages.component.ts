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
  requestData: any;
  currentRequest: any;

  constructor(private authService: AuthService) {

  }

  ngOnInit() {

    this.inboxEmpty = true;

    // Currently only checks for incoming requests, add messages later
    let currentUser = JSON.parse(this.authService.getActiveLocal());

    // Check if current user is artist or venue
    if(currentUser['type'] == 'artist') {
        let artist = { artistId: currentUser['_id'], artistName: currentUser['name']};
        this.authService.getCurrentRequestsArtist(artist).subscribe(response => {
          if(response['requestData'].length > 0) {
            this.inboxEmpty = false;
            this.requestData = response['requestData'];
            this.currentRequest = this.requestData[0];
          }
        });
    } else if(currentUser['type'] == 'venue') {
      // Fetch venue request here the same way artist was done
    } else {
      // Not sure if normal user is going to have messages
    }
  }

  setCurrentRequest(request) {
    this.currentRequest = request;
  }

  acceptRequest() {
    // Delete request and create contract
  }

  declineRequest() {
    // Delete request
  }

}
