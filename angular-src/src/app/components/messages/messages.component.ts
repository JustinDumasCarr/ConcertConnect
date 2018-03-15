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
    console.log("Testing current request");
    console.log(this.currentRequest);


    let contract = { artistId: this.currentRequest['artistId'], venueId: this.currentRequest['venueId'], date: this.currentRequest['date'] };

    console.log("Contract Testing");
    console.log(contract);

    // Delete request and create contract
    this.authService.createContractArtist(contract).subscribe(data => {
      if(data['success'] === true) {
        console.log("Contract has been created");

        // Delete the request
        this.authService.deleteRequestArtist(this.currentRequest).subscribe(data => {
          if(data['success'] == true) {
            console.log("Request was successfully deleted");

              // Refreshing the requests

              let currentUser = JSON.parse(this.authService.getActiveLocal());
              let artist = { artistId: currentUser['_id'], artistName: currentUser['name']};
              this.authService.getCurrentRequestsArtist(artist).subscribe(response => {
                  if(response['requestData'].length > 0) {
                      this.inboxEmpty = false;
                      this.requestData = response['requestData'];
                      this.currentRequest = this.requestData[0];
                  }
                  if(response['requestData'].length == 0) {
                    this.inboxEmpty = true;
                  }
              });



          }
          if(data['success'] == false) {
            console.log("There was an error in deleting the request");
          }
        });


        // Display modal here
      }

      if(data['success'] === false) {
        console.log("Contract was not able to be created");
      }


    });


  }

  declineRequest() {
    // Delete request
  }

}
