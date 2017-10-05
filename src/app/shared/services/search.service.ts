import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Headers, Jsonp} from '@angular/http';
import {ConfigService} from './config.service';

@Injectable()
export class SearchService {

  private searchStringSubject: Subject<string> = new Subject<string>(); // Passed to components as observable
  private searchString: string = ''; // Updated and used only here for getSuggestions();

  private suggestionsArraySubject: Subject<string[]> = new Subject<string[]>();

  constructor(private jsonp: Jsonp, private configService: ConfigService) {
  }


  public setSearchString(newSearchString: string): void {
    this.searchStringSubject.next(newSearchString);
    this.searchString = newSearchString;
    this.getSuggestions();
  }

  public resetSearchString() {
    this.searchStringSubject.next('');
    this.searchString = '';
  }

  public getSearch(): Observable<string> {
    return this.searchStringSubject.asObservable();
  }

  public getSuggestions(): string[] {
    if (this.searchString.length < 1) {
      // Do not send an empty suggestion request.
      // Thus return empty array.
      return [];
    }
    else {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      this.jsonp.request('http://suggestqueries.google.com/complete/search?client=firefox&hl=en&callback=JSONP_CALLBACK&q=' + this.searchString, headers).map(res => res.json()).subscribe(response => {
        let resultArray = response[1];
        console.log(resultArray);
        resultArray = resultArray.slice(0, this.configService.getConfig().amountOfSuggestions);
        this.suggestionsArraySubject.next(resultArray);
      });
    }
  }


}
