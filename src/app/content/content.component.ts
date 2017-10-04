import {Component, Input, OnInit} from '@angular/core';
import {ConfigService} from '../shared/services/config.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {

  @Input() listIsVisible: boolean;

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
