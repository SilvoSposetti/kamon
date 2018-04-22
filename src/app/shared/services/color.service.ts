import {Injectable} from '@angular/core';
import {ConfigService} from './config.service';


@Injectable()
export class ColorService {

  private backgroundGradientFirstStop: number[];
  private backgroundGradientSecondStop: number[];
  private foregroundGradientFirstStop: number[];
  private foregroundGradientSecondStop: number[];
  private paintColor: number[];

  constructor(private configService: ConfigService) {
  }

  public initialize(): void {
    // obtain gradients parameters
    this.backgroundGradientFirstStop = this.configService.getConfig().backgroundGradientFirstStop;
    this.backgroundGradientSecondStop = this.configService.getConfig().backgroundGradientSecondStop;
    this.foregroundGradientFirstStop = this.configService.getConfig().foregroundGradientFirstStop;
    this.foregroundGradientSecondStop = this.configService.getConfig().foregroundGradientSecondStop;
    this.paintColor = this.configService.getConfig().paintColor;
  }

  //********************************************************************************************************************
  // HEX
  public getBackgroundFirstStopHEX(): string {
    return this.getHex(this.backgroundGradientFirstStop);
  }

  public getBackgroundSecondStopHEX(): string {
    return this.getHex(this.backgroundGradientSecondStop);
  }

  public getForegroundFirstStopHEX(): string {
    return this.getHex(this.foregroundGradientFirstStop);
  }

  public getForegroundSecondStopHEX(): string {
    return this.getHex(this.foregroundGradientSecondStop);
  }

  public getPaintColorHEX(): string{
    return this.getHex(this.paintColor);
  }


  private getHex(color: number[]): string { // Color values must be inside interval [0, 255]
    let returnString = '';
    for (let i = 0; i < 3; i++) {
      let str = color[i].toString(16);
      if (str.length < 1) {
        str = '0' + str;
      }
      if (str.length < 2) {
        str = '0' + str;
      }
      returnString += str;
    }
    return '#' + returnString.toUpperCase();
  }

  //********************************************************************************************************************
  // RGBA
  public getBackgroundFirstStopRGBA(alpha: number): string {
    return this.getRGBA(this.backgroundGradientFirstStop, alpha);
  }

  public getBackgroundSecondStopRGBA(alpha: number): string {
    return this.getRGBA(this.backgroundGradientSecondStop, alpha);
  }

  public getForegroundFirstStopRGBA(alpha: number): string {
    return this.getRGBA(this.foregroundGradientSecondStop, alpha);
  }

  public getForegroundSecondStopRGBA(alpha: number): string {
    return this.getRGBA(this.foregroundGradientSecondStop, alpha);
  }

  private getRGBA(color: number[], alpha: number): string { // Color are rgb integers between [0, 255]. Alpha is a float within [0, 1]
    let mappedAlpha = Math.floor(alpha * 255) / 255;
    console.log([alpha, mappedAlpha]);

    // console.log('rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', ' + alpha + ')');
    return 'rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', ' + alpha + ')';
  }
}
