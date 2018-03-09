import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ConfigService} from './shared/services/config.service';
import {SearchService} from './shared/services/search.service';
import {ScreenSizeService} from './shared/services/screen-size.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private keyboardEvent: any;
  //private altKeyAction: boolean;
  public showList: boolean = this.configService.getConfig().showList;
  public selectionSuggestion: number = -1;
  public showClock = this.configService.getConfig().showClock;
  public showCitations = this.configService.getConfig().showCitations;
  public citations = this.configService.getConfig().citations;
  public useToDoList = this.configService.getConfig().useToDoList;
  public showFPS = this.configService.getConfig().showFPS;
  public useCredits = this.configService.getConfig().useCredits;

  private widthThreshold = 769; // Values bigger or equal threshold are considered wide.
  private heightThreshold = 500; // Values bigger or equal threshold are considered tall.
  public screenWidth: number;
  public screenHeight: number;
  public isWide: boolean;
  public isTall: boolean;
  // env = environment.envName;

  private ngUnsubscribe: Subject<any> = new Subject<any>();


  constructor(private configService: ConfigService,
              private searchService: SearchService,
              private screenSizeService: ScreenSizeService) {
  }

  ngOnInit() {
    this.listenForSelection();
    this.updateWindowSize();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
      //event.preventDefault();
      event.stopPropagation();
      console.log('arrowLeft');
      this.searchService.selectLeft();
    }
    else if (event.which === 39 || event.which === 40) {
      //event.preventDefault();
      event.stopPropagation();
      console.log('arrowRight');
      this.searchService.selectRight();
    }
    else if (event.which === 36) {
      event.preventDefault();
      event.stopPropagation();
      console.log('home');
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
    this.searchService.getSelection().takeUntil(this.ngUnsubscribe).subscribe((value) =>
      this.selectionSuggestion = value);
  }


  updateWindowSize(): void {
    this.screenSizeService.getWidth().takeUntil(this.ngUnsubscribe).subscribe(
      value => {
        this.screenWidth = value;
        this.isWide = value >= this.widthThreshold;
      }
    );
    this.screenSizeService.getHeight().takeUntil(this.ngUnsubscribe).subscribe(
      value => {
        this.screenHeight = value;
        this.isTall = value >= this.heightThreshold;
      }
    );
  }
}
