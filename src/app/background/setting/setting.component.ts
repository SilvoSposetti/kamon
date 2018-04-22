import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ColorService} from '../../shared/services/color.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})
export class SettingComponent implements OnInit {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  @Input() screenWidth: number;
  @Input() public screenHeight: number;
  @Input() public isWide: boolean;
  @Input() public isTall: boolean;

  private backgroundGradient: CanvasGradient;


  constructor(private colorService: ColorService) {
  }

  ngOnInit() {
    requestAnimationFrame(() => this.drawBackground());
  }

  private drawBackground() {
    let ctx: CanvasRenderingContext2D = this.canvasRef.nativeElement.getContext('2d');

    this.backgroundGradient = ctx.createLinearGradient(0, 0, this.screenWidth, this.screenHeight);
    this.backgroundGradient.addColorStop(0, this.colorService.getBackgroundFirstStopHEX());
    this.backgroundGradient.addColorStop(1, this.colorService.getBackgroundSecondStopHEX());

    ctx.fillStyle = this.backgroundGradient;
    ctx.fillRect(0,0,this.screenWidth, this.screenHeight);
  }

}
