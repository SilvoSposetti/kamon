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

  private backgroundStyle = document.createElement('style');
  private firstStop: string;
  private secondStop: string;

  constructor(private colorService: ColorService) {
  }

  ngOnInit() {
    this.firstStop = this.colorService.getBackgroundFirstStopHEX();
    this.secondStop = this.colorService.getBackgroundSecondStopHEX();
    this.generateBackgroundGradient();
  }

  private generateBackgroundGradient(): void {
    this.backgroundStyle.innerHTML = '.setting-parent{ background: linear-gradient(141deg, ' + this.firstStop + ' 0%, ' + this.secondStop + ' 100%)}';
    document.getElementsByTagName('app-setting')[0].appendChild(this.backgroundStyle);
  }
}
