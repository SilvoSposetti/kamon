import {Component, Input, OnInit} from '@angular/core';
import {SearchService} from '../shared/services/search.service';
import {Subscription} from 'rxjs/Subscription';
import {trigger, animate, style, transition, state} from '@angular/animations';

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
  @Input() showFuckOff: boolean;

  public showSearch: boolean;
  public searchText: string;
  public searchSuggestions: string[];
  public shortcut: string[];
  private searchSubscription: Subscription;
  private suggestionsSubscription: Subscription;
  private shortcutSubscription: Subscription;


  constructor(private searchService: SearchService) {
  }

  ngOnInit() {
    this.showSearch = false;
    this.listenForSearch();
  }

  listenForSearch(): void {
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

  searchInputChanged(): void {
    this.searchService.setSearchString(this.searchText); // Update content of searchString
    this.checkShowSearch();
  }

  private checkShowSearch(): void {
    this.showSearch = !(this.searchText.length === 0);
  }
}
