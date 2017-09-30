import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../shared/services/config.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  private configList = this.configService.getConfig().list;

  constructor(private configService: ConfigService) {
  }

  ngOnInit() {
    this.readList();
  }

  readList(): void {
    let searchEngine: string[] = [];
    let categories: string[] = [];
    // Extracts categories (without duplicates) from the list.
    for (let i = 0; i < this.configList.length; i++) {
      if (this.configList[i][0] !== null) {
        if (categories.indexOf(this.configList[i][0]) === -1) {
          categories.push(this.configList[i][0]);
        }
      } else {
        searchEngine = this.configList[i];
      }

    }
    console.log('categories: ' + categories);
    console.log('search engine: ' + searchEngine);
  }

}
