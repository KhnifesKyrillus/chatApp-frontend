import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// Material imports
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatCardModule } from '@angular/material/card'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar'; 
import {MatSidenavModule} from '@angular/material/sidenav';
import { RoomManagementComponent } from './room-management/room-management.component'; 
import { LoginComponent } from './login/login.component'; // CLI imports 
import { AppRoutingModule } from './app-routing/app-routing.module';
import { ChatComponent } from './chat/chat.component';

const materialImports = [ MatSidenavModule, MatSnackBarModule, MatInputModule, MatToolbarModule, MatSliderModule, MatIconModule, MatButtonModule, MatCardModule, MatFormFieldModule ];

@NgModule({
    declarations: [
        AppComponent,
        RoomManagementComponent,
        LoginComponent,
        ChatComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        materialImports
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
