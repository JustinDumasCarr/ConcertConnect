import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SearchArtistComponent } from './components/search-artist/search-artist.component';
import { RegisterArtistComponent } from './components/register-artist/register-artist.component';
import { RegisterVenueComponent } from './components/register-venue/register-venue.component';

import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { SearchService } from './services/search.service';
import {CalendarService} from './services/calendar.service';
import {MessageService} from './services/message-service.service';

import { AuthGuard } from './guards/auth.guard';
import { ArtistComponent } from './components/artist/artist.component';
import { VenueComponent } from './components/venue/venue.component';
import { ArtistResultComponent } from './components/artist-result/artist-result.component';

import { ImageUploadModule } from 'angular2-image-upload';
import { DiscoverComponent } from './components/discover/discover.component';
import { SearchVenueComponent } from './components/search-venue/search-venue.component';
import { VenueResultComponent } from './components/venue-result/venue-result.component';

//Dialogs
import { EditProfile } from './components/profile/edit.profile';
import { EditArtist } from './components/artist/edit.artist';
import { MessageArtist } from './components/artist/message.artist';
import { EditVenue } from './components/venue/edit.venue';
import { MessageVenue } from './components/venue/message.venue';
import { LoginDialog } from './components/login/login.dialog';
import { RegisterDialog } from './components/register/register.dialog';

import { CovalentLayoutModule, CovalentStepsModule, CovalentExpansionPanelModule, CovalentChipsModule /*, any other modules */ } from '@covalent/core';
// (optional) Additional Covalent Modules imports

import { FlashMessagesModule } from 'angular2-flash-messages';

import { CovalentHttpModule } from '@covalent/http';
import { CovalentDialogsModule } from '@covalent/core';
import { CovalentHighlightModule } from '@covalent/highlight';
import { CovalentMarkdownModule } from '@covalent/markdown';
import { CovalentDynamicFormsModule } from '@covalent/dynamic-forms';
import { CovalentMessageModule } from '@covalent/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CoverPhotosComponent } from './components/cover-photos/cover-photos.component';
import { MatButtonModule, MatCheckboxModule, MatInputModule, MatToolbarModule, MatIconModule, MatMenuModule, MatCardModule, MatDialogModule, MatProgressSpinnerModule, MatChipsModule, MatSelectModule, MatSidenavModule, MatListModule} from '@angular/material';
import 'hammerjs';
import { CalendarModule } from 'angular-calendar';
import { MessagesComponent } from './components/messages/messages.component';




const appRoutes: Routes =  [
  {path:'', component: HomeComponent},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  {path:'dashboard', component: DashboardComponent, canActivate:[AuthGuard]},
  {path:'profile', component: ProfileComponent, canActivate:[AuthGuard]},
  {path:'messages', component: MessagesComponent, canActivate: [AuthGuard]},
  {path:'discover', component: DiscoverComponent},
  {path:'search/artist', component: SearchArtistComponent},
  {path:'search/venue', component: SearchVenueComponent},
  {path:'registerArtist', component: RegisterArtistComponent, canActivate:[AuthGuard]},
  {path:'registerVenue', component: RegisterVenueComponent, canActivate:[AuthGuard]},
  {path:'artist/:id', component: ArtistComponent},
  {path:'venue/:id', component: VenueComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,
    SearchArtistComponent,
    RegisterArtistComponent,
    RegisterVenueComponent,
    ArtistComponent,
    VenueComponent,
    ArtistResultComponent,
    DiscoverComponent,
    SearchVenueComponent,
    VenueResultComponent,
    CoverPhotosComponent,
    EditProfile,
    EditArtist,
    EditVenue,
    MessageArtist,
    MessageVenue,
    LoginDialog,
    RegisterDialog,
    MessagesComponent

  ],
  imports: [
    BrowserModule,
    FlashMessagesModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    ImageUploadModule.forRoot(),
    ReactiveFormsModule,
    CovalentLayoutModule,
    CovalentStepsModule,
    CovalentExpansionPanelModule,
    CovalentChipsModule,
    // (optional) Additional Covalent Modules imports
    CovalentHttpModule.forRoot(),
    CovalentHighlightModule,
    CovalentMarkdownModule,
    CovalentDynamicFormsModule,
    CovalentDialogsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatToolbarModule,
    CovalentMessageModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    CalendarModule.forRoot()
  ],
  entryComponents: [EditProfile,   ArtistComponent, VenueComponent, EditArtist, EditVenue, MessageArtist, MessageVenue, LoginDialog, RegisterDialog],
  providers: [ValidateService, AuthService, SearchService, CalendarService,  AuthGuard, EditProfile, EditArtist, EditVenue,MessageArtist, LoginDialog, RegisterDialog, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
