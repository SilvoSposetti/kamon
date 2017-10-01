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
  public elements: any[][][] = []; // Triple array!
  // First level are categories, second the element of each category, and third the values of each element

  constructor(private configService: ConfigService) {
  }

  ngOnInit() {
    this.readList();
  }

  readList(): void {
    // Extracts categories (without duplicates) and info about search engine from the list.
    for (let i = 0; i < this.configList.length; i++) {
      if (this.categories.indexOf(this.configList[i][0]) === -1) {
        this.categories.push(this.configList[i][0]);
      }
    }

    // Initializes the elements array to have the correct amount of categories
    for (let i = 0; i < this.categories.length; i++) {
      this.elements.push([]);
    }

    // Inserts a list of values for each element under its correct category in elements array
    for (let i = 0; i < this.configList.length; i++) {
      const indexOfCategory = this.categories.indexOf(this.configList[i][0]);
      const elementValues: any[] = [];
      for (let j = 1; j < this.configList[i].length; j++) { // ElementValues does not have the 'category' parameter
        // (starts from 1 instead of 0)
        elementValues.push(this.configList[i][j]);
      }
      this.elements[indexOfCategory].push(elementValues);
    }
  }

}
