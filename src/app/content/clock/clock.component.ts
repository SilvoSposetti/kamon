
import {Component, OnInit} from '@angular/core';
import {ClockService} from '../../shared/services/clock.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css']
})
export class ClockComponent implements OnInit {

  public secondsFirstDigit: string;
  public secondsSecondDigit: string;
  public minutesFirstDigit: string;
  public minutesSecondDigit: string;
  public hoursFirstDigit: string;
  public hoursSecondDigit: string;
  public day: string;
  public month: string;
  public year: string;
  public dayOfWeek: string;

  private timeSubscription: Subscription;

  constructor(private clockService: ClockService) {
  }

  ngOnInit() {
    this.updateTime();
  }

  updateTime(): void {
    this.timeSubscription = this.clockService.getSecondsFirstDigit().subscribe(value => {
      this.secondsFirstDigit = value;
    });
    this.timeSubscription = this.clockService.getSecondsSecondDigit().subscribe(value => {
      this.secondsSecondDigit = value;
    });
    this.timeSubscription = this.clockService.getMinutesFirstDigit().subscribe(value => {
      this.minutesFirstDigit = value;
    });
    this.timeSubscription = this.clockService.getMinutesSecondDigit().subscribe(value => {
      this.minutesSecondDigit = value;
    });
    this.timeSubscription = this.clockService.getHoursFirstDigit().subscribe(value => {
      this.hoursFirstDigit = value;
    });
    this.timeSubscription = this.clockService.getHoursSecondDigit().subscribe(value => {
      this.hoursSecondDigit = value;
    });
    this.timeSubscription = this.clockService.getDate().subscribe(value => {
      this.day = value;
    });
    this.timeSubscription = this.clockService.getMonth().subscribe(value => {
      this.month = value;
    });
    this.timeSubscription = this.clockService.getYear().subscribe(value => {
      this.year = value;
    });
    this.timeSubscription = this.clockService.getDay().subscribe(value => {
      this.dayOfWeek = value;
    });
  }

}
