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

  public elements: string[][][] = []; // Tri-dimensional array!
  // First level are categories, second the element of each category, and third the values of each element

  private shortcutSubject: Subject<string[]> = new Subject<string[]>();
  private shortcut: string[] = [];
  private regex = new RegExp('^\\s*$');

  constructor(private jsonP: Jsonp, private configService: ConfigService) {
  }

  public setSearchString(newSearchString: string): void {
    if (newSearchString.match(this.regex)) {
      this.searchString = '';
      this.searchStringSubject.next(this.searchString);
      this.updateShortcut();
      this.requestSuggestions();
      this.resetSelection();
    }
    else {
      this.searchStringSubject.next(newSearchString);
      this.searchString = newSearchString;
      this.updateShortcut();
      this.requestSuggestions();
      this.resetSelection();
    }
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

  public getShortcut(): Observable<string[]> {
    return this.shortcutSubject.asObservable();
  }

  public setList(elements: string[][][]): void {
    this.elements = elements;
  }

  private requestSuggestions(): void {
    if (this.searchString.length < 1) {
      // Do not send an empty suggestion request.
      // Thus return empty array.
      this.suggestionsArray = [];
      this.suggestionsArraySubject.next(this.suggestionsArray);

    }
    else {
      if (!this.configService.getConfig().suggestions) {
        // Config file says suggestions are unnecessary.
      }
      else {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');
        this.jsonP.request('https://suggestqueries.google.com/complete/search?client=firefox&hl=en&callback=JSONP_CALLBACK&q=' + this.searchString, headers).map(res => res.json()).subscribe(response => {
          this.suggestionsArray = response[1].slice(0, this.configService.getConfig().amountOfSuggestions);
          this.suggestionsArraySubject.next(this.suggestionsArray);
          // Reset suggestions styled and elaborate the new ones;
          this.suggestionsArrayStyledSubject.next([]);
          let newSuggestionsStyled = [];
          for (let i = 0; i < this.suggestionsArray.length; i++) {
            let suggestion = this.suggestionsArray[i];
            suggestion = suggestion.replace(this.searchString, '<i><b>' + this.searchString + '</i></b>');
            newSuggestionsStyled.push(suggestion);
          }
          this.suggestionsArrayStyledSubject.next(newSuggestionsStyled);
        });
      }
    }
  }

  public launchSearch(index: number): void {
    if (this.searchString.length < 1) {
      //do nothing because empty search string
    }
    else {
      if (this.shortcut[0] !== '') { // Checks if a shortcut has been detected
        if (this.searchString.length === 1) { //Need to open start page of shortcut
          this.openShortcut();
        }
        else { // Need to open custom search in shortcut
          this.openSearchInShortcut();
        }
      }
      else { // No shortcut detected fires normal search engine search.
        this.standardSearch(index);
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

  public updateShortcut(): void {
    if (this.searchString.length < 1) {
      // Do nothing because empty search string;
    }
    else {
      if (this.searchString.length === 1 || this.searchString.substring(1, 2) === this.configService.getConfig().searchDelimiter) {
        // Update shortcut only if the string is 1 char long or the delimiter is found in the second position of the string.
        let elementFound: string[] = [];
        let found = false;
        let firstChar = this.searchString.substring(0, 1);
        for (let i = 0; i < this.elements.length; i++) {
          for (let j = 0; j < this.elements[i].length; j++) {
            if (this.elements[i][j][1] === firstChar) {
              elementFound = this.elements[i][j];
              found = true;
            }
          }
        }
        if (found) {
          this.shortcut = elementFound;
          this.shortcutSubject.next(this.shortcut);
        }
        else {
          this.setStandardShortcut();
        }
      }
      else {
        this.setStandardShortcut();
      }
    }
  }

  private setStandardShortcut(): void {
    this.shortcut = ['', '', '', '', 'rgba(0,0,0,0.8)'];
    this.shortcutSubject.next(this.shortcut);
  }

  private standardSearch(index: number): void {
    let keyword: string = '';
    if (index === -1) { // No suggestion was selected
      keyword = this.searchString;
    }
    else { // A suggestion was selected
      keyword = this.suggestionsArray[index];
    }
    let link = this.configService.getConfig().searchEngine[1] + this.configService.getConfig().searchEngine[2] + keyword;
    this.openLink(link);
  }

  private openShortcut(): void {
    let link = this.shortcut[2];
    this.openLink(link);
  }

  private openSearchInShortcut(): void {
    let link = this.shortcut[2];
    if (this.shortcut[3] !== null) {
      link += this.shortcut[3];
      link = link.replace('{}', this.searchString.substring(2));
    }
    this.openLink(link);
  }

  private openLink(link: string): void {
    this.resetSearchString();
    if (this.configService.getConfig().openLinkInNewTab) {
      window.open(link, '_blank');
    }
    else {
      window.location.href = link;
    }
  }

  public clickedSuggestion(index: number): void {
    this.standardSearch(index);
  }
}

