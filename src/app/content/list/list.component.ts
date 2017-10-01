import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../shared/services/config.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  private configList = this.configService.getConfig().list;
  public categories: string[] = [];
  public searchEngine: string[] = [];

  constructor(private configService: ConfigService) {
  }

  ngOnInit() {
    this.readList();
  }

  readList(): void {
    // Extracts categories (without duplicates) and info about search engine from the list.
    for (let i = 0; i < this.configList.length; i++) {
        if (this.categories.indexOf(this.configList[i][0]) === -1 && this.configList[i][0] !== null) {
          this.categories.push(this.configList[i][0]);
        }

    }
    console.log('categories: ' + this.categories);
  }

}
