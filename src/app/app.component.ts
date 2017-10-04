import {Component, HostListener} from '@angular/core';
import {ConfigService} from './shared/services/config.service';
import {SearchService} from './shared/services/search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'kamon';

  private keyboardEvent: any;
  //private altKeyAction: boolean;
  public listIsVisible: boolean = this.configService.getConfig().listIsVisible;

  constructor(private configService: ConfigService,
              private searchService: SearchService) {
  }

  // listens and deals with function calling and propagation of keypresses.
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {

    if (event.ctrlKey) {
      // do not stopPropagation and preventDefault because it is needed for Ctrl+Shift+i (open browser console)
      this.listIsVisible = !this.listIsVisible;
    }
    else if (event.which === 27) {
      event.preventDefault();
      event.stopPropagation();
      console.log('escape');
      this.searchService.resetSearchString();
    }
    else if (event.which === 13) { //
      event.preventDefault();
      event.stopPropagation();
      console.log('enter');
      // ToDo: launch search here
    }

    //this.keyboardEvent = event;
    //console.log(this.keyboardEvent);


    // EXAMPLES:
    //this.altKey = event.altKey;
    //this.charCode = event.charCode;
    //this.code = event.code;
    //this.ctrlKey = event.ctrlKey;
    //this.keyCode = event.keyCode;
    //this.keyIdentifier = event.keyIdentifier;
    //this.metaKey = event.metaKey;
    //this.shiftKey = event.shiftKey;
    //this.timeStamp = event.timeStamp;
    //this.type = event.type;
    //this.which = event.which;

  }
}
