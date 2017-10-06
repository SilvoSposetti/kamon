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
  private suggestionsArray: string[] = [];

  private suggestionsArrayStyledSubject: Subject<string[]> = new Subject<string[]>();

  private selectionSuggestionSubject: Subject<number> = new Subject<number>();
  private selectionSuggestion: number = -1; // Updated and used only here in the service

  constructor(private jsonP: Jsonp, private configService: ConfigService) {
  }

  public setSearchString(newSearchString: string): void {
    this.searchStringSubject.next(newSearchString);
    this.searchString = newSearchString;
    this.requestSuggestions();
    this.resetSelection();
  }

  public resetSearchString() {
    this.searchStringSubject.next('');
    this.searchString = '';
    this.suggestionsArraySubject.next([]);
    this.resetSelection();
  }

  private resetSelection(): void {
    this.selectionSuggestion = -1;
    this.selectionSuggestionSubject.next(this.selectionSuggestion);
  }

  public getSearch(): Observable<string> {
    return this.searchStringSubject.asObservable();
  }

  public getSelection(): Observable<number> {
    return this.selectionSuggestionSubject.asObservable();
  }

  public getSuggestions(): Observable<string[]> {
    return this.suggestionsArrayStyledSubject.asObservable();
  }

  private requestSuggestions(): void {
    if (this.searchString.length < 1) {
      // Do not send an empty suggestion request.
      // Thus return empty array.
      this.suggestionsArray = [];
      this.suggestionsArraySubject.next(this.suggestionsArray);

    }
    else {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Access-Control-Allow-Origin', '*');
      this.jsonP.request('http://suggestqueries.google.com/complete/search?client=firefox&hl=en&callback=JSONP_CALLBACK&q=' + this.searchString, headers).map(res => res.json()).subscribe(response => {
        this.suggestionsArray = response[1].slice(0, this.configService.getConfig().amountOfSuggestions);
        this.suggestionsArraySubject.next(this.suggestionsArray);
        // Reset suggestions styled and elaborate the new ones;
        this.suggestionsArrayStyledSubject.next([]);
        let newSuggestionsStyled = [];
        for (let i = 0; i < this.suggestionsArray.length; i++) {
          let suggestion = this.suggestionsArray[i];
          suggestion = suggestion.replace(this.searchString, '<i><b>'+this.searchString + '</i></b>');
          newSuggestionsStyled.push(suggestion);
        }
        this.suggestionsArrayStyledSubject.next(newSuggestionsStyled);


      });
    }
  }

  public launchSearch(index: number): void {
    if (this.searchString.length < 1) {
      // do nothing because empty search string
    }
    else {
      let keyword: string = '';
      if (index === -1) {
        keyword = this.searchString;
      }
      else {
        keyword = this.suggestionsArray[index];
      }
      let link = this.configService.getConfig().searchEngine[1] + this.configService.getConfig().searchEngine[2] + keyword;
      if (this.configService.getConfig().openLinkInNewTab) {
        window.open(link, '_blank');
      }
      else {
        window.location.href = link;
      }
    }
  }

  public selectLeft(): void {
    if (this.suggestionsArray.length < 1) {
      this.selectionSuggestion = -1;
      this.selectionSuggestionSubject.next(this.selectionSuggestion);
    }
    else {
      if (this.selectionSuggestion <= 0) { // At leftmost part of array.
        this.selectionSuggestion = 0;
        this.selectionSuggestionSubject.next(this.selectionSuggestion);
      }
      else {
        this.selectionSuggestion--;
        this.selectionSuggestionSubject.next(this.selectionSuggestion);
      }
    }
  }

  public selectRight(): void {
    if (this.suggestionsArray.length < 1) {
      this.selectionSuggestion = -1;
      this.selectionSuggestionSubject.next(this.selectionSuggestion);
    }
    else {
      if (this.selectionSuggestion >= this.suggestionsArray.length - 1) { // At leftmost part of array.
        this.selectionSuggestion = this.suggestionsArray.length - 1;
        this.selectionSuggestionSubject.next(this.selectionSuggestion);
      }
      else {
        this.selectionSuggestion++;
        this.selectionSuggestionSubject.next(this.selectionSuggestion);
      }
    }
  }
}
