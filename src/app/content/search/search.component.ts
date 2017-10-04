import {Component, OnInit} from '@angular/core';
import {SearchService} from '../../shared/services/search.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  public searchText: string;
  private searchSubscription: Subscription;
  constructor(private searchService: SearchService) {
  }

  ngOnInit() {
    this.listenForSearch();
  }
  listenForSearch(): void {
    this.searchSubscription = this.searchService.getSearch().subscribe((value)=>{
      this.searchText = value;
    });
  }

}
