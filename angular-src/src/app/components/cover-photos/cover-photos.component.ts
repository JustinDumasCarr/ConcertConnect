import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cover-photos',
  templateUrl: './cover-photos.component.html',
  styleUrls: ['./cover-photos.component.css'],
  inputs: ['imageArray']
})
export class CoverPhotosComponent implements OnInit {

 imageArray: String;

  constructor() { }

  ngOnInit() {
  }

}
