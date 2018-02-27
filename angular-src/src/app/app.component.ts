import { Component } from '@angular/core';
import {ViewEncapsulation} from '@angular/core';

declare let jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css','../../node_modules/angular-calendar/css/angular-calendar.css']
})
export class AppComponent {
  title = 'app works!';
}

