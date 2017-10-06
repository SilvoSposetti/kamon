import {Component, OnInit} from '@angular/core';
import {FuckOffService} from '../../shared/services/fuck-off.service';

@Component({
  selector: 'app-fuck-off',
  templateUrl: './fuck-off.component.html',
  styleUrls: ['./fuck-off.component.css']
})
export class FuckOffComponent implements OnInit {

  public fuckOffArray: string[] = ['', ''];

  constructor(private fuckOffService: FuckOffService) {
  }

  ngOnInit() {
    this.requestFuckOff();
  }

  public requestFuckOff(): void {
    this.fuckOffService.getFuckOff().subscribe((value) => {
      this.fuckOffArray = value;
    });
  }

}
