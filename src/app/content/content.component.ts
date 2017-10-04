import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  public showSearch: boolean;
  public searchText: string = '';

  constructor() {
  }

  ngOnInit() {
    this.showSearch = false;
  }

  searchInputChanged(): void {
    this.showSearch = !(this.searchText === '');
  }

  //this.renderer.selectRootElement('#myFocus').focus();
}
