import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ScenesService {

  private scenesArray: string[];
  private selectedSceneName: string;
  private selectedSceneNameSubject: Subject<string> = new Subject<string>();
  private selectedSceneNr: number;
  private selectedSceneNrSubject: Subject<number> = new Subject<number>();

  constructor(private configService: ConfigService) {
  }

  public setSceneFromName(sceneName: string): void {
    this.selectedSceneName = sceneName;
    this.selectedSceneNr = this.scenesArray.indexOf(this.selectedSceneName);
    this.selectedSceneNrSubject.next(this.selectedSceneNr);
    this.selectedSceneNameSubject.next(this.selectedSceneName);
  }

  public setSceneFromNr(sceneNr: number): void {
    this.selectedSceneNr = sceneNr;
    this.selectedSceneName = this.scenesArray[this.selectedSceneNr];
    this.selectedSceneNrSubject.next(this.selectedSceneNr);
    this.selectedSceneNameSubject.next(this.selectedSceneName);
  }

  public getSceneName(): Observable<string> {
    return this.selectedSceneNameSubject.asObservable();
  }
  public getSceneNr(): Observable<number> {
    return this.selectedSceneNrSubject.asObservable();
  }

  public getSceneArray(): string[] {
    return this.scenesArray;
  }


  public startScenes(): void {
    // Add new scenes in array below!
    this.scenesArray = [
      'asteroids',
      'phyllotaxy',
      'maze',
      'perlin-field',
      'rain',
      'lissajous',
      'functions',
      'harmonic-functions',
      'tree-map',
      'sorting-algorithms',
      'boids'
    ];
    this.scenesArray.sort();
    this.setSceneFromName(this.configService.getConfig().defaultScene);
  }


}
