import { Component } from '@angular/core';

declare let jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';


  onToggle() {
    jQuery('.ui.sidebar').sidebar('setting', 'transition', 'push').sidebar('toggle');
  }




}

