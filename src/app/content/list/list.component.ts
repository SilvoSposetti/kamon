import {Component, Input, OnInit} from '@angular/core';
import {ConfigService} from '../../shared/services/config.service';
import {SearchService} from '../../shared/services/search.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Input() categories: string[];
  @Input() elements: string[][][]; // Tri-dimensional array!
  // First level are categories, second the element of each category, and third the values of each element

  constructor(private configService: ConfigService, private searchService: SearchService) {
  }

  ngOnInit() {
  }



  openLink(i: number, j: number) {
    if (this.configService.getConfig().openLinkInNewTab) {
      window.open(this.elements[i][j][2], '_blank');
    }
    else {
      window.location.href = this.elements[i][j][2];
    }
  }
}
