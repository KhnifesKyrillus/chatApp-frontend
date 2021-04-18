import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Room, User } from '../chat/chat.component';
import { RestService } from '../service/rest.service';

@Component({
    selector: 'app-room-management',
    templateUrl: './room-management.component.html',
    styleUrls: ['./room-management.component.css']
})
export class RoomManagementComponent implements OnInit {

    @Output() windowClosed = new EventEmitter<any>();
    @Output() userAdded = new EventEmitter<any>();
    @Input() dialogOpened = new EventEmitter<any>();

    addUserModel: string;
    currentRoom: Room;
    visible: boolean;
    addMemberModel: string;
    
    roomMembers: User[];

    constructor(public rest: RestService) { }

    async ngOnInit() {
        this.dialogOpened.subscribe((room) => {
            this.visible = true;
            this.currentRoom = room;
            this.loadData();
        });
    }

    async loadData() {
        this.roomMembers = await this.rest.getRoomMembers(this.currentRoom);
        console.log("Loaded");
    }

    async removeMember(member: User) {
        await this.rest.removeRoomMember(this.currentRoom, member);
        await this.loadData();
    }

    async addMember() {
        if (this.addMemberModel.trim().length > 0) {
            await this.rest.addRoomMember(this.currentRoom, { id: "",  name: this.addMemberModel });
            await this.loadData();
        }
    }

    @HostListener('document:keydown.escape', ['$event'])
    public closeWindow(event: KeyboardEvent) {
        this.visible = false;
        this.windowClosed.emit();
    }
}
