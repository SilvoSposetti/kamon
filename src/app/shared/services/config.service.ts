import {Injectable} from '@angular/core';
import {Configuration} from '../../../assets/config/config';
import {HttpClient} from "@angular/common/http";



@Injectable()
export class ConfigService {
  private config: Configuration;

  constructor(private http: HttpClient) {
  }
  // used at application startup and loads, maps and returns what is inside the JSON file
  load(url: string) {
    return new Promise((resolve) => {
      this.http.get(url).subscribe((res: any) => {
          this.config = res;
          resolve();
        });
    });
  }

  getConfig(): Configuration {
    return this.config;
  }
}
