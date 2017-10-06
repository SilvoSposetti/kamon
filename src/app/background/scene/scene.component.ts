import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {

  //private widthSubscription: Subscription;
  //private isWide: boolean;
  //private widthThreshold = 1250;

  constructor() { }

  ngOnInit() {
  }

  //updateWindowSize(): void {
  //  this.widthSubscription = this.screenSizeService.getWidth().subscribe(
  //    value => {
  //      this.isWide = value >= this.widthThreshold;
  //      console.log(value);
  //    }
  //  );
  //}

}
