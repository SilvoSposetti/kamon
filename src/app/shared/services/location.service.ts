import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs';
import {HttpClient} from "@angular/common/http";
import {ConfigService} from './config.service';

@Injectable()
export class LocationService {

  private latitudeSubject = new Subject<number>();
  private longitudeSubject = new Subject<number>();
  private locationNameSubject = new Subject<string>();
  private weatherSubject = new Subject<string>();
  private sunriseSubject = new Subject<string>();
  private sunsetSubject = new Subject<string>();
  private temperatureSubject = new Subject<number>();
  private weatherIconSubject = new Subject<string>();
  private allDataGatheredSubject = new Subject<boolean>();

  private latitude: number = 0;
  private longitude: number = 0;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.allDataGatheredSubject.next(false);
  }

  public getLocation(): void {
    if (this.configService.getConfig().allowLocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = +position.coords.latitude;
        this.longitude = +position.coords.longitude;
        this.locationNameSubject.next('');
        this.getWeatherFromEndPoint();
      });
    }
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

  public getSunrise(): Observable<string> {
    return this.sunriseSubject.asObservable();
  }

  public getSunset(): Observable<string> {
    return this.sunsetSubject.asObservable();
  }

  public getTemperature(): Observable<number> {
    return this.temperatureSubject.asObservable();
  }

  public getWeatherIcon(): Observable<string> {
    return this.weatherIconSubject.asObservable();
  }

  public getAllDataGathered(): Observable<boolean> {
    return this.allDataGatheredSubject.asObservable();
  }


  public getWeatherFromEndPoint(): void {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    this.http.get('https://fcc-weather-api.glitch.me/api/current?lat=' + this.latitude + '&lon=' + this.longitude).subscribe((response: any) => {
      this.locationNameSubject.next(response.name + ' - ' + response.sys.country);
      this.weatherSubject.next(response.weather[0].description);
      this.sunriseSubject.next(this.dateInSecondsToTime(response.sys.sunrise));
      this.sunsetSubject.next(this.dateInSecondsToTime(response.sys.sunset));
      this.temperatureSubject.next(Math.round(response.main.temp));
      this.weatherIconSubject.next(this.selectIcon(response.weather[0].id, response.sys.sunrise, response.sys.sunset));
      this.latitudeSubject.next(+this.latitude.toFixed(5));
      this.longitudeSubject.next(+this.longitude.toFixed(5));
      this.allDataGatheredSubject.next(true);
    });
  }

  private dateInSecondsToTime(secondsDate: number): string {
    let date = new Date(secondsDate * 1000);
    let hours = this.correctLength(date.getHours().toString());
    let minutes = this.correctLength(date.getMinutes().toString());
    let seconds = this.correctLength(date.getSeconds().toString());
    return hours + ' : ' + minutes + ' : ' + seconds;
  }

  private correctLength(digits: string): string {
    if (digits.length <= 1) {
      return '0' + digits;
    }
    else {
      return digits;
    }
  }

  private selectIcon(statusId: string, sunriseTime: number, sunsetTime: number): string {
    let path = '../../../assets/img/weather/';
    let isDay = false;
    let now = new Date().getTime();
    if (sunriseTime * 1000 <= now && now <= sunsetTime * 1000) {
      isDay = true;
    }
    // Switch-case below follows IDs of API defined by OpenWeatherMap
    // Uses fall-through for each code that has the same image.
    switch (statusId.toString()) {

      case '800': {
        if (isDay) {
          return path + 'day-clear-sky.png';
        }
        else {
          return path + 'night-clear-sky.png';
        }
      }
      case '801': {
        if (isDay) {
          return path + 'day-few-clouds.png';
        }
        else {
          return path + 'night-few-clouds.png';
        }
      }
      case '802': {
        return path + 'scattered-clouds.png';
      }
      case '803':
      case '804': {
        return path + 'broken-clouds.png';
      }
      case '300':
      case '301':
      case '302':
      case '310':
      case '311':
      case '312':
      case '313':
      case '314':
      case '321':
      case '520':
      case '521':
      case '522':
      case '531': {
        return path + 'shower-rain.png';
      }
      case '500':
      case '501':
      case '502':
      case '503':
      case '504': {
        if (isDay) {
          return path + 'day-rain.png';
        }
        else {
          return path + 'night-rain.png';
        }
      }
      case '200':
      case '201':
      case '202':
      case '210':
      case '211':
      case '212':
      case '221':
      case '230':
      case '231':
      case '232': {
        return path + 'thunderstorm.png';
      }
      case '511':
      case '600':
      case '601':
      case '602':
      case '6011':
      case '612':
      case '615':
      case '616':
      case '620':
      case '621':
      case '622': {
        return path + 'snow.png';
      }
      case '701':
      case '711':
      case '721':
      case '731':
      case '741':
      case '751':
      case '761':
      case '762':
      case '771':
      case '781': {
        return path + 'mist.png';
      }
    }
    return path + 'empty.png';
  }
}
