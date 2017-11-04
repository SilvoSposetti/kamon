import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';
import {ConfigService} from './config.service';

@Injectable()
export class LocationService {

  private latitudeSubject = new Subject<number>();
  private longitudeSubject = new Subject<number>();
  private locationNameSubject = new Subject<string>();
  private weatherSubject = new Subject<string>();
  private sunriseSubject = new Subject<number>();
  private sunsetSubject = new Subject<number>();
  private temperatureSubject = new Subject<number>();
  private tempMaxSubject = new Subject<number>();
  private tempMinSubject = new Subject<number>();
  private windSpeedSubject = new Subject<number>();
  private windDirectionSubject = new Subject<number>();

  private latitude: number = 0;
  private longitude: number = 0;

  constructor(private http: Http, private configService: ConfigService) {
    if(this.configService.getConfig().allowLocation){
      this.getLocation();
    }
  }

  private getLocation(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = +position.coords.latitude;
      this.longitude = +position.coords.longitude;
      this.latitudeSubject.next(+this.latitude.toFixed(5));
      this.longitudeSubject.next(+this.longitude.toFixed(5));
      this.locationNameSubject.next('');
      if (this.configService.getConfig().showWeather){
        this.getWeatherFromEndPoint();
      }
    });
  }

  public getLatitude(): Observable<any> {
    return this.latitudeSubject.asObservable();
  }

  public getLongitude(): Observable<number> {
    return this.longitudeSubject.asObservable();
  }

  public getLocationName(): Observable<string> {
    return this.locationNameSubject.asObservable();
  }

  public getWeather(): Observable<string> {
    return this.weatherSubject.asObservable();
  }

  public getSunrise(): Observable<number> {
    return this.sunriseSubject.asObservable();
  }

  public getSunset(): Observable<number> {
    return this.sunsetSubject.asObservable();
  }

  public getTemperature(): Observable<number> {
    return this.temperatureSubject.asObservable();
  }

  public getMaxTemperature(): Observable<number> {
    return this.tempMaxSubject.asObservable();
  }

  public getMinTemperature(): Observable<number> {
    return this.tempMinSubject.asObservable();
  }

  public getWindSpeed(): Observable<number> {
    return this.windSpeedSubject.asObservable();
  }

  public getWindDirection(): Observable<number> {
    return this.windDirectionSubject.asObservable();
  }



  public getWeatherFromEndPoint(): void {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    this.http.get('https://fcc-weather-api.glitch.me/api/current?lat=' + this.latitude + '&lon=' + this.longitude, headers).map(res => res.json()).subscribe(response => {
      this.locationNameSubject.next(response.name + ' - ' + response.sys.country);
      this.weatherSubject.next(response.weather[0].main);
      this.sunriseSubject.next(response.sys.sunrise);
      this.sunsetSubject.next(response.sys.sunset);
      this.temperatureSubject.next(response.main.temp);
      this.tempMinSubject.next(response.main.temp_min);
      this.tempMaxSubject.next(response.main.temp_max);
      this.windSpeedSubject.next(response.wind.speed);
      this.windDirectionSubject.next(response.wind.deg);
    });
  }


}
