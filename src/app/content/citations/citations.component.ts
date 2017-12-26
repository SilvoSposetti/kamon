import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-citations',
  templateUrl: './citations.component.html',
  styleUrls: ['./citations.component.css']
})
export class CitationsComponent implements OnInit {

  constructor() {
  }

  @Input() citations: string[][];

  public citation: string[] = ['', ''];

  private index = -1;
  private changeTimer: number = 1000 * 60;

  ngOnInit() {
    this.newCitation();
    setInterval(() => {
      this.newCitation();
    }, this.changeTimer);
  }

  private newCitation(): void {
    let newIndex = Math.floor(Math.random() * this.citations.length);
    if(newIndex !== this.index){ // Ensures a new citation is found which is not the same as the old one.
      this.index = newIndex;
      this.citation = this.citations[this.index];
    }
    else{
      this.newCitation();
    }
  }

}
