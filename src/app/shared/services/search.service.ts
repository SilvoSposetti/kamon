import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Headers, Jsonp} from '@angular/http';
import {ConfigService} from './config.service';

@Injectable()
export class SearchService {

  private searchStringSubject: Subject<string> = new Subject<string>(); // Passed to components as observable
  private searchString: string = ''; // Updated and used only here for requestSuggestions();

  private suggestionsArraySubject: Subject<string[]> = new Subject<string[]>();

  constructor(private jsonP: Jsonp, private configService: ConfigService) {
  }

  public setSearchString(newSearchString: string): void {
    this.searchStringSubject.next(newSearchString);
    this.searchString = newSearchString;
    this.requestSuggestions();
  }

  public resetSearchString() {
    this.searchStringSubject.next('');
    this.searchString = '';
    this.suggestionsArraySubject.next([]);
  }

  public getSearch(): Observable<string> {
    return this.searchStringSubject.asObservable();
  }

  public getSuggestions(): Observable<string[]> {
    return this.suggestionsArraySubject.asObservable();
  }

  private requestSuggestions(): void {
    if (this.searchString.length < 1) {
      // Do not send an empty suggestion request.
      // Thus return empty array.
      this.suggestionsArraySubject.next([]);
    }
    else {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      this.jsonP.request('http://suggestqueries.google.com/complete/search?client=firefox&hl=en&callback=JSONP_CALLBACK&q=' + this.searchString, headers).map(res => res.json()).subscribe(response => {
        let resultArray = response[1].slice(0, this.configService.getConfig().amountOfSuggestions);
        this.suggestionsArraySubject.next(resultArray);
      });
    }
  }

  launchSearch(): void {
    if (this.searchString.length < 1) {
      // do nothing because empty search string
    }
    else {
      let link = this.configService.getConfig().searchEngine[1] + this.configService.getConfig().searchEngine[2] + this.searchString;
      if (this.configService.getConfig().openLinkInNewTab) {
        window.open(link, '_blank');
      }
      else {
        window.location.href = link;
      }
    }
  }
}
