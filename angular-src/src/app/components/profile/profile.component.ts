import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

//Dialog Stuff
import { EditProfile } from '../profile/edit.profile';
import {DOCUMENT} from '@angular/platform-browser';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: Object;

  editUsernameField: boolean;
  editEmailField: boolean;
  usernameField: string;
  emailField: string;

  //Dialog values
  dialogRef: MdDialogRef<EditProfile>;
  lastCloseResult: string;
  actionsAlignment: string;
  config: MdDialogConfig = {
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
      message: ''
    }
  };
  numTemplateOpens = 0;
  @ViewChild(TemplateRef) template: TemplateRef<any>;

  constructor(private authService: AuthService, private router: Router, public dialog: MdDialog,
              @Inject(DOCUMENT) doc: any) {

    dialog.afterOpen.subscribe((ref: MdDialogRef<any>) => {
      if (!doc.body.classList.contains('no-scroll')) {
        doc.body.classList.add('no-scroll');
      }
    });
    dialog.afterAllClosed.subscribe(() => {
      doc.body.classList.remove('no-scroll');
    });
  }

  ngOnInit() {
    this.editUsernameField = false;
    this.editEmailField = false;

    this.authService.getProfile().subscribe(profile => {
          this.user = profile.user;
    },
    err => {
      console.log(err);
      return false;
    });
  }

  openEdit() {
    this.dialogRef = this.dialog.open(EditProfile, this.config);
    this.dialogRef.afterClosed().subscribe((result: string) => {
      this.lastCloseResult = result;
      this.dialogRef = null;
    });
  }
}
