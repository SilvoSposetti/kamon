import {Component, Input, OnInit} from '@angular/core';
import {SearchService} from '../shared/services/search.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  @Input() listIsVisible: boolean;

  public showSearch: boolean;
  public searchText: string;

  private searchSubscription: Subscription;

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
  }

  searchInputChanged(): void {
    this.searchService.setSearchString(this.searchText); // Update content of searchString
    this.checkShowSearch();

  }

  private checkShowSearch(): void {
    this.showSearch = !(this.searchText.length === 0);

  }

}
