import {Injectable} from '@angular/core';
import {Configuration} from '../../../assets/config/config';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';



@Injectable()
export class ConfigService {
  private config: Configuration;

  constructor(private http: Http) {
  }
  // used at application startup and loads, maps and returns what is inside the JSON file
  load(url: string) {
    return new Promise((resolve) => {
      this.http.get(url).map(res => res.json())
        .subscribe(config => {
          this.config = config;
          resolve();
        });
    });
  }

  getConfig(): Configuration {
    return this.config;
  }
}
