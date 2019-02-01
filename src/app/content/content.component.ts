import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})
export class ContentComponent implements OnInit {

  @Input() useScene: boolean;
  @Input() public screenWidth: number;
  @Input() public screenHeight: number;
  @Input() public isWide: boolean;
  @Input() public isTall: boolean;


  constructor() {
  }

  ngOnInit() {
  }

}
