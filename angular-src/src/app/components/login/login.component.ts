import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

//Dialog Stuff
import { LoginDialog } from '../login/login.dialog';
import {DOCUMENT} from '@angular/platform-browser';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  //Dialog values
  dialogRef: MatDialogRef<LoginDialog>;
  lastCloseResult: string;
  actionsAlignment: string;
  config: MatDialogConfig = {
      disableClose: false,
      hasBackdrop: true,
      backdropClass: '',
      width: '',
      height: '',
      position: {
          top: '',
          bottom: '',
          left: '',
          right: ''
      },
      data: {
      }
  };
  numTemplateOpens = 0;
  @ViewChild(TemplateRef) template: TemplateRef<any>;

  constructor(private authService:AuthService, private router:Router, public dialog: MatDialog,
              @Inject(DOCUMENT) doc: any) { }

  ngOnInit() {
  }

  onLoginSubmit(){
    const user = {
      username: this.username,
      password: this.password
    };

    this.authService.authenticateUser(user).subscribe(data => {
      if(data.success){
        this.authService.storeUserData(data.token, data.user);
        //Set active user data
        this.authService.setActive(data.user);

        this.router.navigate(['dashboard']);
      } else {
        this.config.data = data;
        this.dialogRef = this.dialog.open(LoginDialog, this.config);
      }
    });
  }
}
