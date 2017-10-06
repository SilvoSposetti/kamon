import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ScreenSizeService} from '../../shared/services/screen-size.service';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {

  private widthSubscription: Subscription;
  private heightSubscription: Subscription;
  public sceneWidth: number;
  public sceneHeight: number;

  constructor(private screenSizeService: ScreenSizeService) {
  }

  ngOnInit() {
    this.updateWindowSize();
  }

  updateWindowSize(): void {
    this.widthSubscription = this.screenSizeService.getWidth().subscribe(
      value => {
        this.sceneWidth = value;
      }
    );
    this.heightSubscription = this.screenSizeService.getHeight().subscribe(value => {
      this.sceneHeight = value;
    });

  }

}
