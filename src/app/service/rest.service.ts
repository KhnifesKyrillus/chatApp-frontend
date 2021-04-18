import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Room, User } from '../chat/chat.component';
import { Globals } from '../generic/globals';

@Injectable({
  providedIn: 'root'
})
export class RestService {

    constructor(private router: Router, private client: HttpClient) { }

    async getProtectedResource<T>(url: string): Promise<any> {
        return this.client.get<T>(url, { headers: new HttpHeaders({
                    Authorization: "Bearer " + localStorage.getItem("__bearer"),
                    'Content-Type':'application/json',
                }) 
            })
            .toPromise()
            .catch(
                async (error: HttpErrorResponse) => {
                    if (error.status == 401) { // 401 = Unauthorized
                        this.router.navigate(['/login']);
                    }
                    return "";
                }
            );
    }

    async postProtectedResource<T, P>(url: string, body: P): Promise<T> {
        const promise = this.client.post(url, body, { headers: new HttpHeaders({
                    Authorization: "Bearer " + localStorage.getItem("__bearer"),
                    'Content-Type':'application/json',
                }) 
            })
            .toPromise()
            .catch(
                async (error: HttpErrorResponse) => {
                    if (error.status == 401) { // 401 = Unauthorized
                        this.router.navigate(['/login']);
                    }
                    return "";
                }
            );

        const promiseResult = await promise;
        return promiseResult as T;
    }

    async getRoomMembers(room: Room): Promise<User[]> {
        return this.postProtectedResource<User[], Room>(Globals.API_URL + "getRoomMembers", room);
    }

    async removeRoomMember(room: Room, member: User) {
        return this.postProtectedResource<any, any>(Globals.API_URL + "removeRoomMember", {room: room, member: member});
    }

    async addRoomMember(room: Room, member: User) {
        return this.postProtectedResource<any, any>(Globals.API_URL + "addRoomMember", {room: room, member: member});
    }
}
