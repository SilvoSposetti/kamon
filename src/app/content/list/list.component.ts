import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../shared/services/config.service';
import {ScreenSizeService} from '../../shared/services/screen-size.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  private configList = this.configService.getConfig().list;
  public categories: string[] = [];
  public elements: string[][][] = []; // Triple array!
  // First level are categories, second the element of each category, and third the values of each element

  private widthSubscription: Subscription;
  private isWide: boolean;
  private widthThreshold = 1250;

  constructor(private configService: ConfigService,
              private screenSizeService: ScreenSizeService) {
  }

  ngOnInit() {
    //this.updateWindowSize();
    this.readList();
  }

  //updateWindowSize(): void {
  //  this.widthSubscription = this.screenSizeService.getWidth().subscribe(
  //    value => {
  //      this.isWide = value >= this.widthThreshold;
  //      console.log(value);
  //    }
  //  );
  //}

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

  openLink(i: number, j: number) {
    if (this.configService.getConfig().openLinkInNewTab) {
      window.open(this.elements[i][j][2], '_blank');
    }
    else {
      window.location.href = this.elements[i][j][2];
    }
  }
}
