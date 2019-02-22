import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../../shared/services/config.service';
import {SearchService} from '../../../shared/services/search.service';

@Component({
  selector: 'app-shortcut-list',
  templateUrl: './shortcut-list.component.html',
  styleUrls: ['./shortcut-list.component.css']
})
export class ShortcutListComponent implements OnInit {
  public shortcutList: string[][];

  constructor(private configService: ConfigService, private searchService: SearchService) {
    this.shortcutList = this.configService.getConfig().shortcuts;
  }

  ngOnInit() {

  }

  public openLink(index: number) {
    this.searchService.openLink(this.shortcutList[index][2]);
  }
}
