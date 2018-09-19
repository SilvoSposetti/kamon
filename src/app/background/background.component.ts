import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ScenesService} from '../shared/services/scenes.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements OnInit, OnDestroy {
  @Input() public showFPS: boolean;
  @Input() public screenWidth: number;
  @Input() public screenHeight: number;
  @Input() public isWide: boolean;
  @Input() public isTall: boolean;
  @Input() public useScene: boolean;

  public useFpsGraph: boolean = false;
  private ngUnsubscribe: Subject<any> = new Subject<any>();


  constructor(private sceneService: ScenesService) {
  }

  ngOnInit() {
    this.sceneService.getSceneName().takeUntil(this.ngUnsubscribe).subscribe(value => {
      this.useFpsGraph = this.useScene && value !== '';
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
