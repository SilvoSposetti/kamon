import {ElementRef, Injectable, ViewChild} from '@angular/core';
import {ConfigService} from './config.service';


@Injectable()
export class ColorService {
  @ViewChild('myCanvas') canvasRef: ElementRef;

  private backgroundGradientFirstStop: string;
  private backgroundGradientSecondStop: string;
  private foregroundGradientFirstStop: string;
  private foregroundGradientSecondStop: string;

  constructor(private configService: ConfigService) {
  }

  public initialize(): void {
    // obtain gradients parameters
    this.backgroundGradientFirstStop = this.configService.getBackgroundGradientFirstStop();
    this.backgroundGradientSecondStop = this.configService.getBackgroundGradientSecondStop();
    this.foregroundGradientFirstStop = this.configService.getForegroundGradientFirstStop();
    this.foregroundGradientSecondStop = this.configService.getForegroundGradientSecondStop();
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

  public getGreyScaleBasedOnValue(min: number, max: number, value: number) {
    let numberBaseTen = Math.floor((value - min) / (max - min) * 255);
    let str = numberBaseTen.toString(16);
    if (str.length <= 1) {
      str = '0' + str;
    }
    return '#' + str + str + str;

  }


  public getRGBAFromWavelength(wavelength: number): string {  // wavelength between 380 and 780 nm
    if (wavelength < 380) wavelength = 380;
    if (wavelength >780) wavelength = 780;
    let R: number;
    let G: number;
    let B: number;
    let alpha: number;

    if (wavelength >= 380 && wavelength < 440) {
      R = -1 * (wavelength - 440) / (440 - 380);
      G = 0;
      B = 1;
    }
    else if (wavelength >= 440 && wavelength < 490) {
      R = 0;
      G = (wavelength - 440) / (490 - 440);
      B = 1;
    }
    else if (wavelength >= 490 && wavelength < 510) {
      R = 0;
      G = 1;
      B = -1 * (wavelength - 510) / (510 - 490);
    }
    else if (wavelength >= 510 && wavelength < 580) {
      R = (wavelength - 510) / (580 - 510);
      G = 1;
      B = 0;
    }
    else if (wavelength >= 580 && wavelength < 645) {
      R = 1;
      G = -1 * (wavelength - 645) / (645 - 580);
      B = 0.0;
    }
    else if (wavelength >= 645 && wavelength <= 780) {
      R = 1;
      G = 0;
      B = 0;
    }
    else {
      R = 0;
      G = 0;
      B = 0;
    }

    // intensity is lower at the edges of the visible spectrum.
    if (wavelength > 780 || wavelength < 380) {
      alpha = 0;
    }
    else if (wavelength > 700) {
      alpha = (780 - wavelength) / (780 - 700);
    }
    else if (wavelength < 420) {
      alpha = (wavelength - 380) / (420 - 380);
    }
    else {
      alpha = 1;
    }

    R = Math.floor(R * 255);
    G = Math.floor(G * 255);
    B = Math.floor(B * 255);
    // colorSpace is an array with 5 elements.
    // The first element is the complete code as a string.
    // Use colorSpace[0] as is to display the desired color.
    // use the last four elements alone or together to access each of the individual r, g, b and a channels.

    return 'rgba(' + R + ', ' + G + ', ' + B + ', ' + alpha + ')';
  }

}
