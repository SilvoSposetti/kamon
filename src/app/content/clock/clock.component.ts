import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ClockService} from '../../shared/services/clock.service';
import {LocationService} from '../../shared/services/location.service';
import {ConfigService} from '../../shared/services/config.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {Subject} from 'rxjs';
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.css'],
  animations: [
    trigger(
      'myEnter',
      [
        transition(':enter', [
          style({opacity: 0}),
          animate(400, style({opacity: 1}))
        ]),
        transition(':leave', [
          style({opacity: 1}),
          animate(400, style({opacity: 0}))
        ])
      ]
    ),
  ]
})

export class ClockComponent implements OnInit, OnDestroy {

  @Input() showList: boolean;
  @Input() isWide: boolean;
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

  public latitude: number = 0;
  public longitude: number = 0;
  public locationName: string = '';
  public weather: string = '';
  public sunrise: string = '';
  public sunset: string = '';
  public temperature: number = 0;
  public iconPath: string = '../../../assets/img/weather/empty.png';
  public allDataGathered: boolean = false;

  public allowLocation: boolean = false;

  private ngUnsubscribeTime: Subject<any> = new Subject<any>();
  private ngUnsubscribeLocation: Subject<any> = new Subject<any>();

  constructor(private clockService: ClockService,
              private locationService: LocationService,
              private configService: ConfigService) {
  }

  ngOnInit() {
    this.allowLocation = this.configService.getConfig().allowLocation;
    this.updateData();
  }

  ngOnDestroy() {
    this.ngUnsubscribeLocation.next();
    this.ngUnsubscribeLocation.complete();
    this.ngUnsubscribeTime.next();
    this.ngUnsubscribeTime.complete();
  }

  updateData(): void {

    // CLOCK
    this.clockService.getSecondsFirstDigit().pipe(takeUntil(this.ngUnsubscribeTime)).subscribe(value => {
      this.secondsFirstDigit = value;
    });
    this.clockService.getSecondsSecondDigit().pipe(takeUntil(this.ngUnsubscribeTime)).subscribe(value => {
      this.secondsSecondDigit = value;
    });
    this.clockService.getMinutesFirstDigit().pipe(takeUntil(this.ngUnsubscribeTime)).subscribe(value => {
      this.minutesFirstDigit = value;
    });
    this.clockService.getMinutesSecondDigit().pipe(takeUntil(this.ngUnsubscribeTime)).subscribe(value => {
      this.minutesSecondDigit = value;
    });
    this.clockService.getHoursFirstDigit().pipe(takeUntil(this.ngUnsubscribeTime)).subscribe(value => {
      this.hoursFirstDigit = value;
    });
    this.clockService.getHoursSecondDigit().pipe(takeUntil(this.ngUnsubscribeTime)).subscribe(value => {
      this.hoursSecondDigit = value;
    });
    this.clockService.getDate().pipe(takeUntil(this.ngUnsubscribeTime)).subscribe(value => {
      this.day = value;
    });
    this.clockService.getMonth().pipe(takeUntil(this.ngUnsubscribeTime)).subscribe(value => {
      this.month = value;
    });
    this.clockService.getYear().pipe(takeUntil(this.ngUnsubscribeTime)).subscribe(value => {
      this.year = value;
    });
    this.clockService.getDay().pipe(takeUntil(this.ngUnsubscribeTime)).subscribe(value => {
      this.dayOfWeek = value;
    });

    this.clockService.resetClock();


    // LOCATION & WEATHER:
    if (this.allowLocation) {
      this.locationService.getLocation();
      this.locationService.getLatitude().pipe(takeUntil(this.ngUnsubscribeLocation)).subscribe(value => {
        this.latitude = value;
      });
      this.locationService.getLongitude().pipe(takeUntil(this.ngUnsubscribeLocation)).subscribe(value => {
        this.longitude = value;
      });
      this.locationService.getLocationName().pipe(takeUntil(this.ngUnsubscribeLocation)).subscribe(value => {
        this.locationName = value;
      });
      this.locationService.getWeather().pipe(takeUntil(this.ngUnsubscribeLocation)).subscribe(value => {
        this.weather = value;
      });
      this.locationService.getLongitude().pipe(takeUntil(this.ngUnsubscribeLocation)).subscribe(value => {
        this.longitude = value;
      });
      this.locationService.getSunrise().pipe(takeUntil(this.ngUnsubscribeLocation)).subscribe(value => {
        this.sunrise = value;
      });
      this.locationService.getSunset().pipe(takeUntil(this.ngUnsubscribeLocation)).subscribe(value => {
        this.sunset = value;
      });
      this.locationService.getTemperature().pipe(takeUntil(this.ngUnsubscribeLocation)).subscribe(value => {
        this.temperature = value;
      });
      this.locationService.getWeatherIcon().pipe(takeUntil(this.ngUnsubscribeLocation)).subscribe(value => {
        this.iconPath = value;
      });
      this.locationService.getAllDataGathered().pipe(takeUntil(this.ngUnsubscribeLocation)).subscribe(value => {
        this.allDataGathered = value && this.isWide;
      });
    }
  }

}
