import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { RestService } from '../service/rest.service';
import { WebsocketService } from '../websocket.service';
import { Globals } from '../generic/globals';
import { RoomManagementComponent } from '../room-management/room-management.component';

export class Room {
    constructor(public id: string, public name: string) {}
}

export class User {
    constructor(public id: string, public name: string) {}
}

export class Message {
    constructor(public id: string, public message: string, public timestamp: Date, public user: User) {}
}

export class CreateRoomModel {
    constructor(public roomName: string) {}
}

@Component({
    selector: 'app-root',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {

    constructor(private router: Router, private rest: RestService, private client: HttpClient, private snackBar: MatSnackBar, private websocket: WebsocketService) { }
    
    async ngOnInit(): Promise<any> {
        await this.getRooms();

        this.managementComponent.windowClosed.subscribe(() => {
            this.getRooms();
        });
    }

    createRoomModel: CreateRoomModel = new CreateRoomModel("");
    rooms: Array<Room> = new Array<Room>();
    selectedRoom: Room;
    chat: string;
    messagePrompt: string;

    @ViewChild(RoomManagementComponent)
    managementComponent: RoomManagementComponent;

    private subject: Subject<MessageEvent>;

    async createRoom() {
        if (this.createRoomModel.roomName.trim().length > 3) {
            const createdRoom = await this.rest.postProtectedResource<Room, CreateRoomModel>(Globals.API_URL + "createRoom", this.createRoomModel);
            this.rooms.push(createdRoom);
            this.createRoomModel.roomName = "";
        }
        else {
            this.snackBar.open("Room name must be longer than 3 characters!", "Dismiss");
        }
    }

    async getRooms() {
        this.rooms = await this.rest.getProtectedResource<Room[]>(Globals.API_URL + "getRooms");
        if (this.rooms.length > 0) {
            this.switchRoom(this.rooms[0]);
        }
    }

    async switchRoom(newRoom: Room) {
        console.log("switching")
        this.selectedRoom = newRoom;
        if (this.subject != null) {
            this.subject.unsubscribe();
            this.subject = null;
        }

        this.subject = this.websocket.connect(
            Globals.API_URL.replace("http", "ws") + "chat/" + this.selectedRoom.name + "/" + localStorage.getItem("__user")
        );

        this.subject.subscribe(
            msg => this.refreshMessages(),
            err => console.log("WS error: " + err),
            () => console.log("WS is closing ...")
        );

        this.refreshMessages();
    }

    async deleteRoom(room: Room) {
        this.rooms = await this.rest.postProtectedResource<Room, Room>(Globals.API_URL + "deleteRoom", room)
            .then(deletedRoom => this.rooms = this.rooms.filter(r => r !== room));
    }

    async editRoom(room: Room) {
        this.managementComponent.dialogOpened.emit(room);
    }

    async sendMessage() {
        if (this.messagePrompt.trim().length > 0) {
            await this.rest.postProtectedResource(Globals.API_URL + "sendMessage", 
                { room: this.selectedRoom, text: this.messagePrompt.trim() });
            this.messagePrompt = ""; // Clear prompt
        }
    }

    async refreshMessages() {
        this.rest.postProtectedResource<Message[], Room>(Globals.API_URL + "getMessages", this.selectedRoom)
            .then(messages => {
                this.chat = ""; // Clear the chat
                for (let entry of messages) {
                    const message: Message = entry as Message;
                    this.chat += "[" + this.formatTimestamp(message.timestamp) + "] " + message.user.name + ": " + message.message + "\n";
                }
            });
    }

    formatTimestamp(timeStamp: Date): string {
        return  timeStamp[3] + ":" + timeStamp[4] + ":" + timeStamp[5];
    }
}
