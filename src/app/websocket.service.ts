import { Injectable } from "@angular/core";
import { Observer } from "rxjs";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
    
    constructor() {}
  
    public connect(url): Subject<MessageEvent> {
        var subject = this.create(url);
        console.log("Successfully connected: " + url);
        return subject;
    }
  
    private create(url): Subject<MessageEvent> {
        let ws = new WebSocket(url);
  
        let observable = Observable.create((obs: Observer<MessageEvent>) => {
            ws.onmessage = obs.next.bind(obs);
            ws.onerror = obs.error.bind(obs);
            ws.onclose = obs.complete.bind(obs);
            return ws.close.bind(ws);
        });
        let observer = {
            next: (data: Object) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            }
        };
        return Subject.create(observer, observable);
    }
}