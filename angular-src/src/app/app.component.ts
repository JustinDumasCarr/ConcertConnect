import { Component } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import { ChatAdapter } from 'ng-chat';
import { SocketIOAdapter } from './socketio-adapter'
import { Socket } from 'ng-socket-io';
import { Http } from '@angular/http';
declare let jQuery: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css', '../../node_modules/angular-calendar/css/angular-calendar.css']
})
export class AppComponent {
  title = 'app works!';

    userId: string;
    username: 'justin';

    public adapter: ChatAdapter;

    constructor(private socket: Socket, private http: Http) {
        this.InitializeSocketListerners();
        this.joinRoom();
    }

    public joinRoom(): void
    {
        this.socket.emit('join', localStorage.getItem('id_token'));
    }

    public InitializeSocketListerners(): void
    {
        this.socket.on('generatedUserId', (userId) => {
            // Initializing the chat with the userId and the adapter with the socket instance
            this.adapter = new SocketIOAdapter(userId, this.socket, this.http);
            this.userId = userId;
        });
    }
}

