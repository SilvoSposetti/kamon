import {Component, Input, OnInit} from '@angular/core';
import {SearchService} from '../shared/services/search.service';
import {Subscription} from 'rxjs/Subscription';
import {trigger, animate, style, transition} from '@angular/animations';
import {ConfigService} from '../shared/services/config.service';

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
          animate(400, style({opacity: 0}))
        ])
      ]
    )
  ],
})
export class ContentComponent implements OnInit {

  @Input() showList: boolean;
  @Input() selectionSuggestion: number;
  @Input() showSceneSelector: number;
  @Input() showClock: boolean;
  @Input() showCitations: boolean;
  @Input() citations: string[][];

  public showSearch: boolean;
  public searchText: string;
  public searchSuggestions: string[];
  public shortcut: string[];
  private searchSubscription: Subscription;
  private suggestionsSubscription: Subscription;
  private shortcutSubscription: Subscription;

  private configList : string[][];
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

  private listenForSearch(): void {
    this.searchSubscription = this.searchService.getSearch().subscribe((value) => {
      this.searchText = value;
      if (value.length === 0) {
        this.checkShowSearch();
      }
    });
    this.suggestionsSubscription = this.searchService.getSuggestions().subscribe((value) => {
      this.searchSuggestions = value;
    });
    this.shortcutSubscription = this.searchService.getShortcut().subscribe((value) => {
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

}
