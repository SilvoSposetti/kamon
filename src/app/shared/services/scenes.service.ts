import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs';

@Injectable()
export class ScenesService {

  private scenesArray: string[];
  private selectedSceneName: string;
  private selectedSceneNameSubject: Subject<string> = new Subject<string>();
  private selectedSceneNr: number;
  private selectedSceneNrSubject: Subject<number> = new Subject<number>();

  constructor(private configService: ConfigService) {
    this.startScenes();
    if (this.configService.getUseScene() === false) {
      this.setNone();
    }
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

  public wake(): void {
    // Used to re-push the same value once;
    this.setSceneFromNr(this.selectedSceneNr);
  }

  public getSceneArray(): string[] {
    return this.scenesArray;
  }

  public setNone(): void {
    this.selectedSceneName = '';
    this.selectedSceneNr = -1;
    this.selectedSceneNrSubject.next(this.selectedSceneNr);
    this.selectedSceneNameSubject.next(this.selectedSceneName);
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
      'harmonic-functions',
      'tree-map',
      'sorting-algorithms',
      'boids',
      'infinite-zoom',
      'modular-multiplication',
      'drops',
      'diffusion-limited-aggregation',
      'game-of-life',
      'kaleidoscope',
      'polar-functions',
      'langtons-ant',
      'quad-tree',
      'plexus',
      'refraction',
      'parallax',
      'visual-clock',
      'hexagons',
      'recursive-tree',
      'stacked-plot'
    ];
    this.scenesArray.sort();
    this.setSceneFromName(this.configService.getDefaultScene());
  }


}
