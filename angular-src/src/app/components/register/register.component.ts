import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import {ValidateService} from '../../services/validate.service'
import {AuthService} from '../../services/auth.service'
import {Router} from '@angular/router';
import { ViewEncapsulation } from '@angular/core';


//Dialog Stuff
import { RegisterDialog } from '../register/register.dialog';
import {DOCUMENT} from '@angular/platform-browser';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']

})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;

  //Dialog values
  dialogRef: MatDialogRef<RegisterDialog>;
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

  constructor(
    private validateService: ValidateService,
    private authService:AuthService,
    private router: Router,
    public dialog: MatDialog,
    @Inject(DOCUMENT) doc: any
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.password
    };


    // Register user
    this.authService.registerUser(user).subscribe(data => {
      if(data.success){
        this.router.navigate(['/login']);
      } else {
        //Open dialog here
        this.config.data = data;
        this.dialogRef = this.dialog.open(RegisterDialog, this.config);
      }
    });

  }

}
