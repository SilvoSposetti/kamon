import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ConfigService} from './config.service';

@Injectable()
export class SearchService {

  private searchStringSubject: Subject<string> = new Subject<string>(); // Passed to components as Observable
  private searchString: string = ''; // Updated and used only here for requestSuggestions();
  private searchStringEncoded: string = '';

  private suggestionsArraySubject: Subject<string[]> = new Subject<string[]>();
  private suggestionsArray: string[] = [];
  private suggestionsArrayStyledSubject: Subject<string[]> = new Subject<string[]>();

  private selectedSuggestionIndexSubject: Subject<number> = new Subject<number>();
  private selectedSuggestionIndex: number = -1;

  private shortcutSubject: Subject<string[]> = new Subject<string[]>();
  public shortcut: string[] = [];


  readonly configList: string[][];

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.configList = this.configService.getConfig().shortcuts;
  }



  public setSearchString(newSearchString: string): void {
    this.updateSearchString(newSearchString);
    this.lookForShortcut();
    this.requestSuggestions();
    this.resetSelection();
  }

  public resetSearch() {
    this.setSearchString('');
  }

  private resetSelection(): void {
    this.updateSelectedSuggestionIndex(-1);
  }

  public getSearch(): Observable<string> {
    return this.searchStringSubject.asObservable();
  }

  public getSelectionIndex(): Observable<number> {
    return this.selectedSuggestionIndexSubject.asObservable();
  }

  public getSuggestions(): Observable<string[]> {
    return this.suggestionsArrayStyledSubject.asObservable();
  }

  public getShortcut(): Observable<string[]> {
    return this.shortcutSubject.asObservable();
  }

  private requestSuggestions(): void {
    if (this.searchStringEncoded.length < 1 && this.searchString.length < 1) {
      // Do not send an empty suggestion request. Thus return empty array.
      this.suggestionsArray = [];
      this.suggestionsArraySubject.next(this.suggestionsArray);
      this.suggestionsArrayStyledSubject.next(this.suggestionsArray);
    } else {
      if (!this.configService.getConfig().suggestions) {
        // Config file says suggestions are unnecessary.
      } else {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Access-Control-Allow-Origin', '*');

        this.http.jsonp('https://suggestqueries.google.com/complete/search?client=firefox&hl=en&callback=JSONP_CALLBACK&q=' + this.searchStringEncoded, 'f').subscribe(response => {
          this.suggestionsArray = response[1].slice(0, this.configService.getConfig().amountOfSuggestions);
          this.suggestionsArraySubject.next(this.suggestionsArray);
          // Reset suggestions styled and elaborate the new ones;
          //this.suggestionsArrayStyledSubject.next([]);
          let newSuggestionsStyled = [];
          for (let i = 0; i < this.suggestionsArray.length; i++) {
            let suggestion = this.suggestionsArray[i];
            suggestion = suggestion.replace(this.searchString.toLowerCase(), '<i><b> ' + this.searchString.toLowerCase() + '</b></i>');
            newSuggestionsStyled.push(suggestion);
          }
          this.suggestionsArrayStyledSubject.next(newSuggestionsStyled);
        });
      }
    }
  }


  public launchSearch(): void {
    if (this.searchStringEncoded.length < 1) {
      //do nothing because empty search string
    } else {
      if (this.shortcut[0] !== '') { // Checks if a shortcut has been detected
        if (this.searchStringEncoded.length === 1) { //Need to open shortcut
          this.openShortcut();
        } else { // Need to open custom search in shortcut
          this.openSearchInShortcut();
        }
      } else { // No shortcut detected fires normal search engine search.
        this.standardSearch(this.selectedSuggestionIndex);
      }
    }
  }

  private lookForShortcut(): void {
    if (this.searchStringEncoded.length < 1) {
      // Do nothing because empty search string;
      this.setStandardShortcut();
    } else {
      if (this.searchStringEncoded.length === 1 || this.searchStringEncoded.substring(1, 2) === this.configService.getConfig().searchDelimiter) {
        // Update shortcut only if the string is 1 char long or the delimiter is found in the second position of the string.
        let elementFound: string[] = [];
        let found = false;
        let firstChar = this.searchStringEncoded.substring(0, 1);
        for (let i = 0; i < this.configList.length; i++) {
          if (this.configList[i][1] === firstChar) {
            elementFound = this.configList[i];
            found = true;
          }
        }
        if (found) {
          this.updateShortcut(elementFound);
        } else {
          this.setStandardShortcut();
        }
      } else {
        this.setStandardShortcut();
      }
    }
  }



  private standardSearch(index: number): void {
    let keyword: string = '';
    if (index === -1) { // No suggestion was selected
      keyword = this.searchStringEncoded;
    } else { // A suggestion was selected
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
      link = link.replace('{}', this.searchStringEncoded.substring(2));
    }
    this.openLink(link);
  }

  public openLink(link: string): void {
    this.resetSearch();
    if (this.configService.getConfig().openLinkInNewTab) {
      window.open(link, '_blank');
    } else {
      window.location.href = link;
    }
  }

  public selectDown(): void {
    this.updateSelectedSuggestionIndex(this.selectedSuggestionIndex + 1);
  }

  public selectUp(): void {
    this.updateSelectedSuggestionIndex(this.selectedSuggestionIndex - 1);
  }

  public searchSuggestion(index: number) {
    this.standardSearch(index);
  }

  private updateSearchString(newString: string): void {
    this.searchString = newString;
    this.searchStringEncoded = newString.split('+').join('%2B');
    this.searchStringSubject.next(this.searchString);
  }

  private updateShortcut(newShortcut: string[]): void {
    this.shortcut = newShortcut;
    this.shortcutSubject.next(this.shortcut);
  }

  private updateSelectedSuggestionIndex(newIndex: number): void {
    if (newIndex > this.configService.getConfig().amountOfSuggestions - 1 || newIndex < -1) {
      // Don't do anything
    } else {
      this.selectedSuggestionIndex = newIndex;
      this.selectedSuggestionIndexSubject.next(this.selectedSuggestionIndex);
    }
  }

  private setStandardShortcut(): void {
    this.updateShortcut(['', '', '', '', '', 'rgba(0,0,0,0.8)']);
  }

}

