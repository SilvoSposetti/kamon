import {ElementRef, Injectable, ViewChild} from '@angular/core';
import {ConfigService} from './config.service';


@Injectable()
export class ColorService {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  //TODO: see if this canvasRef can be used to send the CanvasGradient directly instead of the HEX/RGBA values

  private backgroundGradientFirstStop: string;
  private backgroundGradientSecondStop: string;
  private foregroundGradientFirstStop: string;
  private foregroundGradientSecondStop: string;

  constructor(private configService: ConfigService) {
  }

  public initialize(): void {
    // obtain gradients parameters
    this.backgroundGradientFirstStop = this.configService.getConfig().backgroundGradientFirstStop;
    this.backgroundGradientSecondStop = this.configService.getConfig().backgroundGradientSecondStop;
    this.foregroundGradientFirstStop = this.configService.getConfig().foregroundGradientFirstStop;
    this.foregroundGradientSecondStop = this.configService.getConfig().foregroundGradientSecondStop;
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


  private getHex(color: string): string { // Color values must be inside interval [0, 255]
    return '#' + color.toUpperCase();
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

  private getRGBA(color: string, alpha: number): string { // Color are rgb integers between [0, 255]. Alpha is a float within [0, 1]

    let Rstr = color.substring(0, 2);
    let Gstr = color.substring(2, 4);
    let Bstr = color.substring(4, 6);

    let R = parseInt(Rstr, 16);
    let G = parseInt(Gstr, 16);
    let B = parseInt(Bstr, 16);

    // console.log('rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', ' + alpha + ')');
    return 'rgba(' + R + ', ' + G + ', ' + B + ', ' + alpha + ')';
  }
}
