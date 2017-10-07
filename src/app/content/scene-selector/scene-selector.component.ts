import {Component, OnInit} from '@angular/core';
import {ScenesService} from '../../shared/services/scenes.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-scene-selector',
  templateUrl: './scene-selector.component.html',
  styleUrls: ['./scene-selector.component.css']
})
export class SceneSelectorComponent implements OnInit {

  public scenesArray: string[];
  public selectedSceneNr: number;
  private scenesSubscription: Subscription;


  constructor(private scenesService: ScenesService) {
  }

  ngOnInit() {
    this.getSceneNr();
    this.scenesArray = this.scenesService.getSceneArray();
  }

  public clickScene(index: number): void {
    this.scenesService.setSceneFromNr(index);
  }

  private getSceneNr(): void {
    this.scenesSubscription = this.scenesService.getSceneNr().subscribe((value) => {
      this.selectedSceneNr = value;
    });
  }

}
