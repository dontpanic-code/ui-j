import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";  // or from "@microsoft/signalr" if you are using a new library

@Injectable({
    providedIn: 'root'
})
export class SignalRService {
    public data;
    private hubConnection: signalR.HubConnection
    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://rozrobnyk.com/chat')
            .build();
        this.hubConnection
            .start()
            .then(() => console.log())
            // .then(() => console.log('Connection started'))
            // .catch(err => console.log('Error while starting connection: ' + err))
    }
    public addTransferChartDataListener = () => {
        this.hubConnection.on('transferchartdata', (data) => {
            this.data = data;
            // console.log(data);
        });
    }
}