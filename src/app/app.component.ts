import { Component } from '@angular/core';
import {ClockService} from './shared/services/clock.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  providers: [ClockService];
}
