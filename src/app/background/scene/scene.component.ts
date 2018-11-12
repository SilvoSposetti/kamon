import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ScreenSizeService} from '../../shared/services/screen-size.service';
import {ScenesService} from '../../shared/services/scenes.service';
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs/internal/Subject";

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit, OnDestroy {
  @Input() showFPS: boolean;

  //TODO: adjust subscription
  @Input() screenWidth: number;
  @Input() public screenHeight: number;
  @Input() public isWide: boolean;
  @Input() public isTall: boolean;
  public sceneName: string;
  public scenesArray: string[];

  private ngUnsubscribe: Subject<any> = new Subject<any>();

  constructor(private screenSizeService: ScreenSizeService, private scenesService: ScenesService) {
  }

  ngOnInit() {
    this.getSceneName();
    this.scenesService.wake();
    this.scenesArray = this.scenesService.getSceneArray();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private getSceneName(): void {
    this.scenesService.getSceneName().pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.sceneName = value;
    });
  }
}
