import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ChatApp';

  userNameFormControl = new FormControl('', [
    Validators.required,
]);
constructor(private router: Router) {

}

public setUsername():void{
  environment.username=this.userNameFormControl.value;
  this.router.navigateByUrl('/chat-view');}
}
