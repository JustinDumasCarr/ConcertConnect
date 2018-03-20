import { ChatAdapter, User, Message, UserStatus } from 'ng-chat';
import { Observable } from "rxjs/Rx";
import { Socket } from 'ng-socket-io';
import { Http, Response } from '@angular/http';

export class SocketIOAdapter extends ChatAdapter
{
    private socket: Socket;
    private http: Http;
    private userId: string;

    constructor(userId: string, socket: Socket, http: Http) {
        super();
        this.socket = socket;
        this.http = http;
        this.userId = userId;

        this.InitializeSocketListerners();  
    }

    listFriends(): Observable<User[]> {
        // List connected users to show in the friends list
        // Sending the userId from the request body as this is just a demo 
        return this.http.post("http://localhost:3000/listFriends", { userId: this.userId })
        .map((res:Response) => res.json())
        //...errors if any
        .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    getMessageHistory(userId: any): Observable<Message[]> {
        // This could be an API call to your NodeJS application that would go to the database
        // and retrieve a N amount of history messages between the users.
        return this.http.post("http://localhost:3000/getMessages", { toId : userId, fromId : this.userId})
            .map((res) => res.json().messageArray)
            //...errors if any
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }
    
    sendMessage(message: Message): void {
        this.socket.emit("sendMessage", {message:message,username:this.userId}
        );
    }

    public InitializeSocketListerners(): void
    {
        this.socket.emit("room", this.userId);


      this.socket.on("messageReceived", (messageWrapper) => {
        // Handle the received message to ng-chat
        this.onMessageReceived(messageWrapper.user, messageWrapper.message);
      });

      this.socket.on("friendsListChanged", (usersCollection: Array<User>) => {
        // Handle the received message to ng-chat
        this.onFriendsListChanged(usersCollection.filter(x => x.id != this.userId));
      });
    }
}