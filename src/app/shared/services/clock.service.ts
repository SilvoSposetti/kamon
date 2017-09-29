import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {DaysOfWeek} from '../models/DaysOfWeek';

@Injectable()
export class ClockService {

  // Need a subject for every element to make sure that each one gets updated only when it changes.
  private secondsFirstDigitSubject = new Subject<string>();
  private secondsSecondDigitSubject = new Subject<string>();
  private minutesFirstDigitSubject = new Subject<string>();
  private minutesSecondDigitSubject = new Subject<string>();
  private hoursFirstDigitSubject = new Subject<string>();
  private hoursSecondDigitSubject = new Subject<string>();
  private dateSubject = new Subject<string>();
  private monthSubject = new Subject<string>();
  private yearSubject = new Subject<string>();
  private daySubject = new Subject<string>();

  // Used to remember and check if the old value is the same as the new or not.
  private oldSecondsFirst = '';
  private oldSecondsSecond = '';
  private oldMinutesFirst = '';
  private oldMinutesSecond = '';
  private oldHoursFirst = '';
  private oldHoursSecond = '';
  private oldDate = '';
  private oldMonth = '';
  private oldYear = '';
  private oldDay = '';

  private daysOfWeek = new DaysOfWeek();

  constructor() {
    setTimeout(() => { // Need to wait 1msec probably because Subjects are not ready before execution of updateSubjects()
      this.updateSubjects();
    }, 1);
    this.startTime();
  }

  private startTime() {
    setInterval(() => {
      this.updateSubjects();
    }, 1000); // can be set higher and the subjects will only get updated when they change.
  }

  // Creates new date and extracts data. Then updates values only if they changed.
  private updateSubjects() {
    const newDate = new Date();

    // Seconds
    const seconds = this.correctLength(newDate.getSeconds().toString());
    const secondsFirstDigit = seconds.substring(0, 1);
    const secondsSecondDigit = seconds.substring(1, 2);
    // Minutes
    const minutes = this.correctLength(newDate.getMinutes().toString());
    const minutesFirstDigit = minutes.substring(0, 1);
    const minutesSecondDigit = minutes.substring(1, 2);
    // Hours
    const hours = this.correctLength(newDate.getHours().toString());
    const hoursFirstDigit = hours.substring(0, 1);
    const hoursSecondDigit = hours.substring(1, 2);
    // Rest
    const date = this.correctLength((newDate.getDate().toString()));
    const month = this.correctLength((newDate.getMonth() + 1).toString()); // Months start from 1 when new Date() is created
    const year = this.correctLength(newDate.getFullYear().toString());
    const day = this.correctLength(this.translateDayToLanguage(newDate.getDay().toString()));


    // Check if the new value has been modified before inserting it into the Observable stream
    if (secondsFirstDigit !== this.oldSecondsFirst) {
      this.oldSecondsFirst = secondsFirstDigit;
      this.secondsFirstDigitSubject.next(secondsFirstDigit);
    }
    if (secondsSecondDigit !== this.oldSecondsSecond) {
      this.oldSecondsSecond = secondsSecondDigit;
      this.secondsSecondDigitSubject.next(secondsSecondDigit);
    }
    if (minutesFirstDigit !== this.oldMinutesFirst) {
      this.oldMinutesFirst = minutesFirstDigit;
      this.minutesFirstDigitSubject.next(minutesFirstDigit);
    }
    if (minutesSecondDigit !== this.oldMinutesSecond) {
      this.oldMinutesSecond = minutesSecondDigit;
      this.minutesSecondDigitSubject.next(minutesSecondDigit);
    }
    if (hoursFirstDigit !== this.oldHoursFirst) {
      this.oldHoursFirst = hoursFirstDigit;
      this.hoursFirstDigitSubject.next(hoursFirstDigit);
    }
    if (hoursSecondDigit !== this.oldHoursSecond) {
      this.oldHoursSecond = hoursSecondDigit;
      this.hoursSecondDigitSubject.next(hoursSecondDigit);
    }
    if (date !== this.oldDate) {
      this.oldDate = date;
      this.dateSubject.next(date);
    }
    if (month !== this.oldMonth) {
      this.oldMonth = month;
      this.monthSubject.next(month);
    }
    if (year !== this.oldYear) {
      this.oldYear = year;
      this.yearSubject.next(year);
    }
    if (day !== this.oldDay) {
      this.oldDay = day;
      this.daySubject.next(day);
    }
  }

  // Getters to use externally to retrieve clock data
  public getSecondsFirstDigit(): Observable<any> {
    return this.secondsFirstDigitSubject.asObservable();
  }

  public getSecondsSecondDigit(): Observable<any> {
    return this.secondsSecondDigitSubject.asObservable();
  }

  public getMinutesFirstDigit(): Observable<any> {
    return this.minutesFirstDigitSubject.asObservable();
  }

  public getMinutesSecondDigit(): Observable<any> {
    return this.minutesSecondDigitSubject.asObservable();
  }

  public getHoursFirstDigit(): Observable<any> {
    return this.hoursFirstDigitSubject.asObservable();
  }

  public getHoursSecondDigit(): Observable<any> {
    return this.hoursSecondDigitSubject.asObservable();
  }

  public getDate(): Observable<any> {
    return this.dateSubject.asObservable();
  }

  public getMonth(): Observable<any> {
    return this.monthSubject.asObservable();
  }

  public getYear(): Observable<any> {
    return this.yearSubject.asObservable();
  }

  public getDay(): Observable<any> {
    return this.daySubject.asObservable();
  }

  // used to transform the day of the week number into human readable weekdays.
  private translateDayToLanguage(dayNr: string): string {
    return this.daysOfWeek.days[Number(dayNr) - 1]; // new Date() returns a day number starting from 1.
  }

  private correctLength(digits: string): string {
    if (digits.length <= 1) {
      return '0' + digits;
    } else {
      return digits;
    }

  }
}
