import {Component, Input, OnInit} from '@angular/core';
import {SearchService} from '../shared/services/search.service';
import {Subscription} from 'rxjs/Subscription';
import {ConfigService} from '../shared/services/config.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  @Input() listIsVisible: boolean;
  @Input() selectionSuggestion: number;

  public showSearch: boolean;
  public searchText: string;
  public searchSuggestions: string[];
  public shortcut: string[];
  private searchSubscription: Subscription;
  private suggestionsSubscription: Subscription;
  private shortcutSubscription: Subscription;

  public showFuckOff = this.configService.getConfig().showFuckOff;
  public showClock = this.configService.getConfig().showClock;

  constructor(private searchService: SearchService, private configService: ConfigService) {
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
    this.shortcutSubscription = this.searchService.getShortcut().subscribe((value)=>{
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
