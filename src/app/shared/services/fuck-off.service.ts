import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class FuckOffService {

  private fuckOffArraySubject: Subject<string[]> = new Subject<string[]>();
  private fuckOffList: string[];

  constructor(private http: Http) {
    this.createList();
  }

  public getFuckOff(): Observable<string[]> {
    this.requestRandomFuckOff();
    return this.fuckOffArraySubject.asObservable();
  }

  public requestRandomFuckOff(): void {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');
    let randomEndpoint = this.fuckOffList[Math.floor(Math.random() * this.fuckOffList.length)];
    this.http.get('https://www.foaas.com' + randomEndpoint + '/FOAAS', headers).map(res => res.json()).subscribe(response => {
      this.fuckOffArraySubject.next([response.message, response.subtitle]);
    });
  }

  private createList(): void {
    this.fuckOffList = [
      '/asshole', '/awesome', '/bag', '/because', '/bucket', '/bye', '/cool', '/cup', '/diabetes', '/everyone',
      '/everything', '/family', '/fascinating', '/flying', '/fyyff', '/give', '/horse', '/immensity', '/life',
      '/looking', '/maybe', '/me', '/mornin', '/no', '/pink', '/programmer', '/retard', '/ridiculous', '/rtfm', '/sake',
      '/shit', '/single', '/thanks', '/that', '/this', '/too', '/tucker', '/what', '/zayn', '/zero'
    ];
  }


}
