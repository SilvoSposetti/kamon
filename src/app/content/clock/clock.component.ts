import {Component, OnInit} from '@angular/core';
import {ClockService} from '../../shared/services/clock.service';
import {Subscription} from 'rxjs/Subscription';
import {LocationService} from '../../shared/services/location.service';
import {ConfigService} from '../../shared/services/config.service';

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

  public latitude: number = 0;
  public longitude: number = 0;
  public locationName: string = '';
  public weather: string = '';
  public sunrise: number = 0;
  public sunset: number = 0;
  public temperature: number = 0;
  public tempMin: number = 0;
  public tempMax: number = 0;
  public windSpeed: number = 0;
  public windDirection: number = 0;

  public allowLocation: boolean = false;
  public showWeather: boolean = false;

  private timeSubscription: Subscription;
  private locationSubscription: Subscription;

  constructor(private clockService: ClockService,
              private locationService: LocationService,
              private configService: ConfigService) {
  }

  ngOnInit() {
    this.allowLocation = this.configService.getConfig().allowLocation;
    this.showWeather = this.configService.getConfig().showWeather;
    this.updateData();
  }

  updateData(): void {

    // CLOCK
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

    this.clockService.resetClock();

    // LOCATION & WEATHER:
    if(this.allowLocation){
      this.locationSubscription = this.locationService.getLatitude().subscribe( value =>{
        this.latitude = value;
      });
      this.locationSubscription = this.locationService.getLongitude().subscribe( value =>{
        this.longitude = value;
      });
      this.locationSubscription = this.locationService.getLocationName().subscribe( value =>{
        this.locationName = value;
      });
      this.locationSubscription = this.locationService.getWeather().subscribe( value =>{
        this.weather = value;
      });
      this.locationSubscription = this.locationService.getLongitude().subscribe( value =>{
        this.longitude = value;
      });
      this.locationSubscription = this.locationService.getSunrise().subscribe( value =>{
        this.sunrise = value;
      });
      this.locationSubscription = this.locationService.getSunset().subscribe( value =>{
        this.sunset = value;
      });
      this.locationSubscription = this.locationService.getTemperature().subscribe( value =>{
        this.temperature = value;
      });
      this.locationSubscription = this.locationService.getMaxTemperature().subscribe( value =>{
        this.tempMax = value;
      });
      this.locationSubscription = this.locationService.getMinTemperature().subscribe( value =>{
        this.tempMin = value;
      });
      this.locationSubscription = this.locationService.getWindSpeed().subscribe( value =>{
        this.windSpeed = value;
      });
      this.locationSubscription = this.locationService.getWindDirection().subscribe( value =>{
        this.windDirection = value;
      });


    }
  }

}
