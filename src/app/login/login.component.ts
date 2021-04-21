import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Globals } from '../generic/globals';

export class LoginModel {
    constructor(public jwt: string, public userName: string, public password: string) {}
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(private router: Router, private client: HttpClient, private snackBar: MatSnackBar) { }

    loginModel: LoginModel = new LoginModel("jwt", null, null);
    hide = true;

    async ngOnInit() {
        //await this.performLogin(); // TODO: Comment this lime
    }

    async performLogin() {
        if (this.loginModel.userName.trim().length < 5) {
            this.snackBar.open("Username must not be shorter than 5 characters.", "Dismiss");
            return;
        }

        this.loginModel.jwt = localStorage.getItem("__bearer");
        const jwtPromise = this.client.post(Globals.API_URL + "login", 
            this.loginModel,
            {responseType: 'text'})
            .toPromise()
            .catch(
                async (error: HttpErrorResponse) => {
                    if (error.status == 500) {
                        this.snackBar.open("This username is already taken!", "Dismiss");
                    }
                    else if (error.status == 401) {
                        this.snackBar.open("The given password is invalid.", "Dismiss");
                    }
                    return "";
                }
            );

        var jwt = await jwtPromise;
        localStorage.setItem("__bearer", jwt);
        localStorage.setItem("__user", this.loginModel.userName);
        await this.router.navigate(['/chat']);
    }
}
