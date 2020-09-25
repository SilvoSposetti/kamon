import {Injectable} from '@angular/core';
import {Configuration} from '../../../assets/config/config';
import {HttpClient} from '@angular/common/http';



@Injectable()
export class ConfigService {
  private defaultConfig: Configuration;
  private runningConfig: Configuration;

  constructor(private http: HttpClient) {
  }

  // used at application startup and loads, maps and returns what is inside the JSON file
  public load(url: string) {
    return new Promise((resolve) => {
      this.http.get(url).subscribe((res: any) => {
        this.defaultConfig = res;
        resolve();
        this.initializeConfig();
      });
    });

  }

  private initializeConfig(): void {
    this.runningConfig = this.defaultConfig;
  }

  // Setters:
  public setUseScene(value: boolean): void {
    this.runningConfig.useScene = value;
  }

  public setDefaultScene(value: string): void {
    this.runningConfig.defaultScene = value;
  }

  public setShowUI(value: boolean): void {
    this.runningConfig.showUI = value;
  }

  public setOpenLinkInNewTab(value: boolean): void {
    this.runningConfig.openLinkInNewTab = value;
  }

  public setSuggestions(value: boolean): void {
    this.runningConfig.suggestions = value;
  }

  public setSearchDelimiter(value: string): void {
    this.runningConfig.searchDelimiter = value;
  }

  public setAmountOfSuggestions(value: number): void {
    this.runningConfig.amountOfSuggestions = value;
  }

  public setAllowLocation(value: boolean): void {
    this.runningConfig.allowLocation = value;
  }

  public setShowFPS(value: boolean): void {
    this.runningConfig.showFPS = value;
  }

  public setBackgroundGradientFirstStop(value: string): void {
    this.runningConfig.backgroundGradientFirstStop = value;
  }

  public setBackgroundGradientSecondStop(value: string): void {
    this.runningConfig.backgroundGradientSecondStop = value;
  }

  public setForegroundGradientFirstStop(value: string): void {
    this.runningConfig.foregroundGradientFirstStop = value;
  }

  public setForegroundGradientSecondStop(value: string): void {
    this.runningConfig.foregroundGradientSecondStop = value;
  }

  public setSearchEngine(value: string[]): void {
    this.runningConfig.searchEngine = value;
  }

  public setShortcuts(value: string[][]): void {
    this.runningConfig.shortcuts = value;
  }

  // Getters:
  public getUseScene(): boolean {
    return this.runningConfig.useScene;
  }

  public getDefaultScene(): string {
    return this.runningConfig.defaultScene;
  }

  public getShowUI(): boolean {
    return this.runningConfig.showUI;
  }

  public getOpenLinkInNewTab(): boolean {
    return this.runningConfig.openLinkInNewTab;
  }

  public getSuggestions(): boolean {
    return this.runningConfig.suggestions;
  }

  public getSearchDelimiter(): string {
    return this.runningConfig.searchDelimiter;
  }

  public getAmountOfSuggestions(): number {
    return this.runningConfig.amountOfSuggestions;
  }

  public getAllowLocation(): boolean {
    return this.runningConfig.allowLocation;
  }

  public getShowFPS(): boolean {
    return this.runningConfig.showFPS;
  }

  public getBackgroundGradientFirstStop(): string {
    return this.runningConfig.backgroundGradientFirstStop;
  }

  public getBackgroundGradientSecondStop(): string {
    return this.runningConfig.backgroundGradientSecondStop;
  }

  public getForegroundGradientFirstStop(): string {
    return this.runningConfig.foregroundGradientFirstStop;
  }

  public getForegroundGradientSecondStop(): string {
    return this.runningConfig.foregroundGradientSecondStop;
  }

  public getSearchEngine(): string[] {
    return this.runningConfig.searchEngine;
  }

  public getShortcuts(): string[][] {
    return this.runningConfig.shortcuts;
  }


  public getConfig(): Configuration {
    return this.runningConfig;
  }



}
