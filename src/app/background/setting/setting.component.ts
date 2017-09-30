import {Component, OnInit} from '@angular/core';
import {ConfigService} from '../../shared/services/config.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css'],
})
export class SettingComponent implements OnInit {

  public useBackground = this.configService.getConfig().useCustomBackgroundImage;
  public backgroundImage = '/assets/img/background/background.jpg';

  constructor(private configService: ConfigService) {

  }

  ngOnInit() {
  }



}
