
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from '../app.component';
import { ChatComponent } from '../chat/chat.component';
import { LoginComponent } from '../login/login.component';

const routes: Routes = [
    { path: 'chat', component: ChatComponent},
    { path: 'login', component: LoginComponent},
    { path: "**", redirectTo: "inbox" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { 

}