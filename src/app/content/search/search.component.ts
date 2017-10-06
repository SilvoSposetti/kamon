import {Component, Input, OnInit} from '@angular/core';
import {SearchService} from '../../shared/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {

  @Input() searchSuggestions: string[];
  @Input() searchText: string;
  @Input() selectionSuggestion: number;
  @Input() shortcut: number;


  constructor(private searchService: SearchService) {
  }

  ngOnInit() {
  }

  public clickedSuggestion(index: number):void{
    this.searchService.clickedSuggestion(index);
  }
}
