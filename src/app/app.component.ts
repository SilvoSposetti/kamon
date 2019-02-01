import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ConfigService} from './shared/services/config.service';
import {SearchService} from './shared/services/search.service';
import {ScreenSizeService} from './shared/services/screen-size.service';
import {Subject} from 'rxjs';
import {environment} from '../environments/environment';
import {ColorService} from './shared/services/color.service';
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  // private keyboardEvent: any;
  // private altKeyAction: boolean;
  public selectionSuggestion: number = -1;
  public showFPS = this.configService.getConfig().showFPS;
  public useScene = this.configService.getConfig().useScene;

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
              private screenSizeService: ScreenSizeService,
              private colorService: ColorService) {
  }

  ngOnInit() {
    this.colorService.initialize();
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
      //console.log('pageDown');
    }
    else if (event.which === 27) {
      event.preventDefault();
      event.stopPropagation();
      //console.log('escape');
      //this.searchService.resetSearchString();
    }
    else if (event.which === 13) {
      event.preventDefault();
      event.stopPropagation();
      //console.log('enter');
      //this.searchService.launchSearch(this.selectionSuggestion);
    }
    else if (event.which === 37 || event.which === 38) {
      //event.preventDefault();
      event.stopPropagation();
      //console.log('arrowLeft');
      //this.searchService.selectLeft();
    }
    else if (event.which === 39 || event.which === 40) {
      //event.preventDefault();
      event.stopPropagation();
      //console.log('arrowRight');
      //this.searchService.selectRight();
    }
    else if (event.which === 36) {
      event.preventDefault();
      event.stopPropagation();
      //console.log('home');
    }
    else if (event.which === 33) {
      event.preventDefault();
      event.stopPropagation();
      //console.log('pageUp');
    }

    //this.keyboardEvent = event;
    //console.log(this.keyboardEvent);


  }

  private listenForSelection() {
  //  this.searchService.getSelectionIndex().pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) =>
  //    this.selectionSuggestion = value);
  }


  updateWindowSize(): void {
    this.screenSizeService.getWidth().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      value => {
        this.screenWidth = value;
        this.isWide = value >= this.widthThreshold || !environment.production;
        // If in production env then the screen is always wide.
        // This is because most of the development process is done for wide screens.
      }
    );
    this.screenSizeService.getHeight().pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      value => {
        this.screenHeight = value;
        this.isTall = value >= this.heightThreshold || !environment.production;
        // If in production env then the screen is always tall.
        // This is because most of the development process is done for tall screens.

      }
    );
  }
}
