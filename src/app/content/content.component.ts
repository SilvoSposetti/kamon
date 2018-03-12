import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SearchService} from '../shared/services/search.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {ConfigService} from '../shared/services/config.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
  animations: [
    trigger(
      'myEnter',
      [
        transition(':enter', [
          style({opacity: 0}),
          animate(400, style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate(400, style({opacity: 0}))
        ])
      ]
    )
  ],
})
export class ContentComponent implements OnInit, OnDestroy {

  @Input() showList: boolean;
  @Input() selectionSuggestion: number;
  @Input() showClock: boolean;
  @Input() showCitations: boolean;
  @Input() citations: string[][];
  @Input() useToDoList: boolean;
  @Input() useCredits: boolean;
  @Input() useScene: boolean;
  @Input() public screenWidth: number;
  @Input() public screenHeight: number;
  @Input() public isWide: boolean;
  @Input() public isTall: boolean;

  public showSceneSelector: boolean = false;
  public showCredits: boolean = false;
  public showToDo: boolean = false;
  public showSearch: boolean;
  public searchText: string;
  public searchSuggestions: string[];
  public shortcut: string[];
  private ngUnsubscribe: Subject<any> = new Subject<any>();


  private configList: string[][];
  public elements: string[][][] = [];
  public categories: string[] = [];



  constructor(private searchService: SearchService, private configService: ConfigService) {
  }

  ngOnInit() {
    this.showSearch = false;
    this.listenForSearch();
    this.configList = this.configService.getConfig().list;
    this.readList();
    this.searchService.setList(this.elements);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private listenForSearch(): void {
    this.searchService.getSearch().takeUntil(this.ngUnsubscribe).subscribe((value) => {
      this.searchText = value;
      if (value.length === 0) {
        this.checkShowSearch();
      }
    });
    this.searchService.getSuggestions().takeUntil(this.ngUnsubscribe).subscribe((value) => {
      this.searchSuggestions = value;
    });
    this.searchService.getShortcut().takeUntil(this.ngUnsubscribe).subscribe((value) => {
      this.shortcut = value;
    });
  }

  public searchInputChanged(): void {
    this.searchService.setSearchString(this.searchText); // Update content of searchString
    this.checkShowSearch();
  }

  private checkShowSearch(): void {
    this.showSearch = !(this.searchText.length === 0);
  }

  private readList(): void {
    // Extracts categories (without duplicates) and info about search engine from the list.
    for (let i = 0; i < this.configList.length; i++) {
      if (this.categories.indexOf(this.configList[i][0]) === -1) {
        this.categories.push(this.configList[i][0]);
      }
    }

    // Initializes the elements array to have the correct amount of categories
    for (let i = 0; i < this.categories.length; i++) {
      this.elements.push([]);
    }

    // Inserts a list of values for each element under its correct category in elements array
    for (let i = 0; i < this.configList.length; i++) {
      const indexOfCategory = this.categories.indexOf(this.configList[i][0]);
      const elementValues: any[] = [];
      for (let j = 1; j < this.configList[i].length; j++) { // ElementValues does not have the 'category' parameter
        // (starts from 1 instead of 0)
        elementValues.push(this.configList[i][j]);
      }
      this.elements[indexOfCategory].push(elementValues);
    }
  }

  public sceneSelectorHoverIn(): void {
    this.showSceneSelector = true;
  }

  public sceneSelectorHoverOut(): void {
    this.showSceneSelector = false;
  }

  public creditsHoverIn(): void {
    this.showCredits = this.useCredits;
  }

  public creditsHoverOut(): void {
    this.showCredits = false && this.useCredits;
  }

  public toDoHoverIn(): void {
    this.showToDo = this.useToDoList;
  }

  public toDoHoverOut(): void {
    this.showToDo = false && this.useToDoList;
  }

}
