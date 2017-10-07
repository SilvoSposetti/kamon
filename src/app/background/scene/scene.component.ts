import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ScreenSizeService} from '../../shared/services/screen-size.service';
import {ScenesService} from '../../shared/services/scenes.service';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {

  private widthSubscription: Subscription;
  private heightSubscription: Subscription;
  private scenesSubscription: Subscription;
  public sceneWidth: number;
  public sceneHeight: number;
  public sceneNr: number;
  public scenesArray: string[];

  constructor(private screenSizeService: ScreenSizeService, private scenesService: ScenesService) {
  }

  ngOnInit() {

    this.getSceneNr();
    this.scenesArray = this.scenesService.getSceneArray();
    this.updateWindowSize();
    this.scenesService.startScenes();

  }

  private updateWindowSize(): void {
    this.widthSubscription = this.screenSizeService.getWidth().subscribe(
      value => {
        this.sceneWidth = value;
      }
    );
    this.heightSubscription = this.screenSizeService.getHeight().subscribe(value => {
      this.sceneHeight = value;
    });
  }

  private getSceneNr(): void {
    this.scenesSubscription = this.scenesService.getSceneNr().subscribe((value) => {
      this.sceneNr = value;
    });
  }
}
