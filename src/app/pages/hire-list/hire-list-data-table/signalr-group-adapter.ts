import { ChatAdapter, IChatGroupAdapter, User, Group, Message, ChatParticipantStatus, ParticipantResponse, ParticipantMetadata, ChatParticipantType, IChatParticipant } from 'ng-chat';
import { Observable, of } from 'rxjs';
import { delay } from "rxjs/operators";
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as signalR from "@microsoft/signalr";
import { HireServiceService } from '../hire-service.service';
import { toInteger } from 'lodash';
import { Messages } from '@app/models/messages';

export class SignalRGroupAdapter extends ChatAdapter implements IChatGroupAdapter {
  public userId: string;

  public _id;
  public _userId;
  public historyMessages: Array<Message> = [];
  public _historyMessages: Array<Message> = [];

  private hubConnection: signalR.HubConnection
  public static serverBaseUrl: string = 'https://rozrobnyk.com/'; // Set this to 'https://localhost:5001/' if running locally

  constructor(private username: string, private http: HttpClient, public hireService: HireServiceService, private id: string, private email: string, private isRecruiter: boolean) {
    super();
    // console.log("this.id", this.id);    
    this.initializeConnection();
  }

  private initializeConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${SignalRGroupAdapter.serverBaseUrl}groupchat`)
      .build();

    this.hubConnection
      .start()
      .then(() => {
        this.joinRoom();
        this.initializeListeners();
        // this.getChatsFromDB();
        // this.listFriends()
        this.loadHistoryMessages();
      })
      // .catch(err => console.log(`Error while starting SignalR connection: ${err}`));
  }

  private initializeListeners(): void {
    this.hubConnection.on("generatedUserId", (userId) => {
      // With the userId set the chat will be rendered
      this.userId = ""+userId+"";
      // console.log("generatedUserId this.userId", this.userId);  
    });

    this.hubConnection.on("messageReceived", (participant, message) => {
      // console.log("participant", participant, message);
      // console.log("message", message);

      message.fromId = participant.userId
      this.historyMessages.push(message)      
      let user = {
        userId: participant.userId,
        id: participant.id
      }
      this.openChat(user)
      this.onMessageReceived(participant, message);
    });

    this.hubConnection.on("friendsListChanged", (participantsResponse: Array<ParticipantResponse>) => {
      this.onFriendsListChanged(participantsResponse.filter(x => x.participant.id != this.userId));
    });

    this.hubConnection.on("updateListFriends", (resp) => {
      // console.log("updateListFriends", resp);
      this.listFriends();  
      // this.loadHistoryMessages()
    });
  }

  joinRoom(): void {
    if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected) {
      this.hubConnection.send("join", this.username, this.id, this.isRecruiter);
    }
  }

  listFriends(): Observable<ParticipantResponse[]> {
    // console.log("listFriends");
    let s = { currentUserId: ""+this.userId+"" }
    // this.loadHistoryMessages()
    
    return this.http
      .post(`${SignalRGroupAdapter.serverBaseUrl}api/Home/listFriends`, s)
      .pipe(
        map((res: any) => { /*console.log("res", res);*/ return res}),
        // catchError((error: any) => {return Observable.throw(console.log("2"))})
        catchError((error: any) => {return of([]);}) 
      );
  }

  getMessageHistory(destinataryId: any): Observable<Message[]> {
    
    let mockedHistory: Array<Message>;
    mockedHistory = []
    mockedHistory = this._historyMessages; 
    // console.log("getMessageHistory  onParticipantChatOpened", this._historyMessages);
    
    return of(this._historyMessages).pipe(delay(1500));    
  }

  sendMessage(message: Message): void {

    if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected){
      this.hubConnection.send("sendMessage", message, this.isRecruiter);

      let m = {
        fromId: message.fromId,
        toId: this._userId,
        message: message.message,
        dateSent: new Date(message.dateSent),
        fromUserId: '',
        toUserId: ''
      }

      // console.log("this._userId", this._userId);
      // console.log("m", m);
      this.historyMessages.push(m)
      // console.log("this.historyMessages", this.historyMessages);
      this.getChatsFromDB()
    }
  }
  groupCreated(){}

  openChat(user: any){
    this._userId = user.userId
    this._historyMessages = this.historyMessages.filter(x => x.toId == user.userId || x.fromId == user.userId);
    // console.log("onParticipantClicked historyMessages", this.historyMessages);
  }

  loadHistoryMessages(): Array<Message>{
    this.historyMessages = []
    this.hireService.getListMessages().finally(() => {
      // console.log(this.hireService.allMessages)
      this.hireService.allMessages.map(user => {
          let m = {
            fromId: user.fromId == this.id ? this.userId : user.fromId,
            toId: user.toId == this.id ? this.userId : user.toId,
            message: user.message,
            dateSent: new Date(user.dateSent),
            fromUserId: '',
            toUserId: ''
          }
          this.historyMessages.push(m)
      })
    });
    return this.historyMessages
  }

  getChatsFromDB(){
    if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected){
      this.hubConnection.send("getChatsFromDB", this.id, this.isRecruiter);
    }
    // console.log("getChatsFromDB");    
  }

  setMessagesRead(){
    if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected){
      this.hubConnection.send("setMessagesRead", this.id, this._userId, this.isRecruiter);
      // console.log("setMessagesRead", this.id, this._userId, this.isRecruiter);   
    }
  }
}
