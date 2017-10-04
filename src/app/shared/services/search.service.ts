import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SearchService {

  private searchString: Subject<string> = new Subject<string>();

  constructor() {
  }

  public setSearchString(newSearchString: string): void {
    this.searchString.next(newSearchString);
  }

  public resetSearchString() {
    this.searchString.next('');
  }

  public getSearch(): Observable<string> {
    return this.searchString.asObservable();
  }


}
