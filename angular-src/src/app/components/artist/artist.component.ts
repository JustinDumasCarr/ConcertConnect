import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AuthService} from '../../services/auth.service';

//Dialog Stuff
import { EditArtist } from '../artist/edit.artist';
import {DOCUMENT} from '@angular/platform-browser';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';

@Component({
    selector: 'app-artist',
    templateUrl: './artist.component.html',
    styleUrls: ['./artist.component.css'],
})
export class ArtistComponent implements OnInit
{
    id: string;
    artist: Object;
    //Having two separate values ensures that the 'Not found' message does not show up while it's loading
    artistExist: boolean;
    artistNotExist: boolean;
    isArtistDisplay: boolean;

    nameField: string;
    emailField: string;

    //Dialog values
    dialogRef: MdDialogRef<EditArtist>;
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
        }
    };
    numTemplateOpens = 0;
    @ViewChild(TemplateRef) template: TemplateRef<any>;

    constructor(private route: ActivatedRoute,private authService: AuthService, public dialog: MdDialog,
                @Inject(DOCUMENT) doc: any)
    {
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
        this.route.params.forEach(params => {
            this.id = params['id'];
            this.artist = {"_id": this.id};
            this.artist = JSON.stringify(this.artist);
            this.authService.getArtistProfile(this.artist).subscribe(data => {
                    if (data == "") {
                        this.artistNotExist = true;
                    }
                    else {
                        this.artist = data;
                        this.config.data = data;
                        this.artistExist = true;
                    }
                    this.isArtist();
                },
                err => {
                    console.log(err);
                    return false;
                }
            );
        })
    }

    isArtist() {
        let artists = this.authService.getArtists();
        for(let i=0; i<artists.length; i++) {
            if(artists[i].name==this.artist['name']) {
                this.isArtistDisplay = true;
            }
        }
    }

    messageArtist(){
    }

    openEdit() {
        this.dialogRef = this.dialog.open(EditArtist, this.config);
        const sub = this.dialogRef.componentInstance.updateProfile.subscribe((data) => {
            this.artist = data;
            this.config.data = data;
        });
        this.dialogRef.afterClosed().subscribe((result: string) => {
            this.lastCloseResult = result;
            this.dialogRef = null;
            sub.unsubscribe();
        });
    }
}