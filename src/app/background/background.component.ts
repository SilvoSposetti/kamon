import {Component, Input, OnInit} from '@angular/core';
import {ConfigService} from '../shared/services/config.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css']
})
export class BackgroundComponent implements OnInit {
  @Input() public showFPS: boolean;
  @Input() public screenWidth: number;
  @Input() public screenHeight: number;
  @Input() public isWide: boolean;
  @Input() public isTall: boolean;
  @Input() public useScene = this.configService.getConfig().useScene;

  constructor(private configService: ConfigService) {
  }

  ngOnInit() {
  }


}
