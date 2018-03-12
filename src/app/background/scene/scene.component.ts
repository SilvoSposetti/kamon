import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ScreenSizeService} from '../../shared/services/screen-size.service';
import {ScenesService} from '../../shared/services/scenes.service';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit {
  @Input() showFPS: boolean;

  //TODO: adjust subscription
  private scenesSubscription: Subscription;
  @Input() screenWidth: number;
  @Input() public screenHeight: number;
  @Input() public isWide: boolean;
  @Input() public isTall: boolean;
  public sceneName: string;
  public scenesArray: string[];

  constructor(private screenSizeService: ScreenSizeService, private scenesService: ScenesService) {
  }

  ngOnInit() {
    this.getSceneName();
    this.scenesService.wake();
    this.scenesArray = this.scenesService.getSceneArray();
  }

  private getSceneName(): void {
    this.scenesSubscription = this.scenesService.getSceneName().subscribe((value) => {
      this.sceneName = value;
    });
  }
}
