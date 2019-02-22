import {Component, OnDestroy, OnInit} from '@angular/core';
import {SearchService} from '../../shared/services/search.service';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs/internal/Subject';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  animations: [
    trigger('myDynamicHeight',
      [
        transition(':enter', [
          style({height: 0, opacity: 0}),
          animate('300ms ease', style({height: '*', opacity: 1}))
        ]),
        transition(':leave', [
          style({height: '*', opacity: 1}),
          animate('300ms ease', style({height: 0, opacity: 0}))
        ])
      ]
    ),
    trigger(
      'myDynamicWidth',
      [
        transition(':enter', [
          style({width: 0, opacity: 0}),
          animate('300ms ease', style({width: '*', opacity: 1}))
        ]),
        transition(':leave', [
          style({width: '*', opacity: 1}),
          animate('300ms ease', style({width: 0, opacity: 0}))
        ])
      ]
    )
  ],
})
export class SearchComponent implements OnInit, OnDestroy {

  public showSearch: boolean;
  public searchText: string;
  public searchSuggestions: string[];
  public shortcut: string[];
  public selectedSuggestionIndex: number = -1;
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  public showSuggestions: boolean = false;

  constructor(private searchService: SearchService) {
  }

  ngOnInit() {
    this.showSearch = false;
    this.resetSelectedSuggestionIndex();
    this.listenForSearch();
  }

  public clickedSuggestion(index: number): void {
    this.searchService.searchSuggestion(index);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }


  private listenForSearch(): void {
    this.searchService.getSearch().pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.searchText = value;
    });
    this.searchService.getSuggestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      if(this.searchText===''){
        this.searchSuggestions = [];
      }
      else{
        this.searchSuggestions = value;

      }
      this.showSuggestions = !(this.searchSuggestions.length === 0);
    });
    this.searchService.getShortcut().pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.shortcut = value;
    });
    this.searchService.getSelectionIndex().pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.selectedSuggestionIndex = value;
    });
  }

  public searchInputChanged(): void {
    this.searchService.setSearchString(this.searchText); // Update content of searchString
  }

  public launchSearch(): void {
    this.searchService.launchSearch();
    this.resetSelectedSuggestionIndex();
  }

  private resetSelectedSuggestionIndex(): void {
    this.selectedSuggestionIndex = -1;
  }

  public resetSearch(): void {
    this.searchService.resetSearch();
  }

  public selectDown(): void {
    this.searchService.selectDown();
  }

  public selectUp(): void {
    this.searchService.selectUp();
  }

}
