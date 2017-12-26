import {Component, HostListener, OnInit} from '@angular/core';
import {ConfigService} from './shared/services/config.service';
import {SearchService} from './shared/services/search.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private keyboardEvent: any;
  //private altKeyAction: boolean;
  public showList: boolean = this.configService.getConfig().showList;
  private selectionSubscription: Subscription;
  public selectionSuggestion: number = -1;
  public showSceneSelector = false;
  public showClock = this.configService.getConfig().showClock;
  public showCitations = this.configService.getConfig().showCitations;
  public citations = this.configService.getConfig().citations;

  constructor(private configService: ConfigService,
              private searchService: SearchService) {
  }

  ngOnInit() {
    this.listenForSelection();
  }


  // listens and deals with function calling and propagation of keypresses.
  @HostListener('window:keydown', ['$event'])
  keyboardInput(event: any) {

    if (event.which === 34) {
      event.preventDefault();
      event.stopPropagation();
      console.log('pageDown');
      this.showList = !this.showList;
    }
    else if (event.which === 27) {
      event.preventDefault();
      event.stopPropagation();
      console.log('escape');
      this.searchService.resetSearchString();
    }
    else if (event.which === 13) {
      event.preventDefault();
      event.stopPropagation();
      console.log('enter');
      this.searchService.launchSearch(this.selectionSuggestion);
    }
    else if (event.which === 37 || event.which === 38) {
      event.preventDefault();
      event.stopPropagation();
      console.log('arrowLeft');
      this.searchService.selectLeft();
    }
    else if (event.which === 39 || event.which === 40) {
      event.preventDefault();
      event.stopPropagation();
      console.log('arrowRight');
      this.searchService.selectRight();
    }
    else if (event.which === 36) {
      event.preventDefault();
      event.stopPropagation();
      console.log('home');
      this.showSceneSelector = !this.showSceneSelector;
    }
    else if (event.which === 33) {
      event.preventDefault();
      event.stopPropagation();
      console.log('pageUp');
      this.showClock = !this.showClock;
    }

    //this.keyboardEvent = event;
    //console.log(this.keyboardEvent);


  }

  private listenForSelection() {
    this.selectionSubscription = this.searchService.getSelection().subscribe((value) =>
      this.selectionSuggestion = value);
  }

}
