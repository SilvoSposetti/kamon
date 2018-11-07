import {Component, OnDestroy, OnInit} from '@angular/core';
import {ScenesService} from '../../shared/services/scenes.service';
import {Subject} from 'rxjs';
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-scene-selector',
  templateUrl: './scene-selector.component.html',
  styleUrls: ['./scene-selector.component.css'],
})
export class SceneSelectorComponent implements OnInit, OnDestroy {

  private scenesNamesList: string[];
  public selectedSceneNr: number;
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  public scenesAlphabeticalList: string [][] = [];

  // First element contains first letter, other elements contain scene names.


  constructor(private scenesService: ScenesService) {
  }

  ngOnInit() {
    this.getSceneNr();
    this.scenesNamesList = this.scenesService.getSceneArray();
    this.generateAlphabeticalList();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public clickScene(i: number, j: number): void {
    this.scenesService.setSceneFromNr(this.getSceneNrFromIAndJ(i, j));
  }

  private getSceneNr(): void {
    this.scenesService.getSceneNr().pipe(takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      this.selectedSceneNr = value;
    });
    this.scenesService.wake();
  }

  private generateAlphabeticalList(): void {
    let initial = '';
    let sameInitialBlock: string[] = [];
    for (let i = 0; i < this.scenesNamesList.length; i++) {
      if (this.scenesNamesList[i][0].toUpperCase() !== initial) {
        initial = this.scenesNamesList[i][0].toUpperCase();
        if (sameInitialBlock.length !== 0) {
          this.scenesAlphabeticalList.push(sameInitialBlock);
        }
        sameInitialBlock = [];
        sameInitialBlock.push(this.scenesNamesList[i]);
      }
      else {
        sameInitialBlock.push(this.scenesNamesList[i]);
      }
    }
    this.scenesAlphabeticalList.push(sameInitialBlock);
  }

  public getSceneNrFromIAndJ(indexI: number, indexJ: number): number {
    let result = 0;
    for (let k = 0; k < indexI; k++) {
      result += this.scenesAlphabeticalList[k].length;
    }
    return result + indexJ;
  }

  public deactivate(): void {
    this.scenesService.setNone();
  }
}
