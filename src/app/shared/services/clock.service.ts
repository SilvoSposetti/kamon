import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {DaysOfWeek} from '../models/DaysOfWeek';

@Injectable()
export class ClockService {
  baseUrl$: Observable<string>;

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
  oldSecondsFirst = '0';
  oldSecondsSecond = '0';
  oldMinutesFirst = '0';
  oldMinutesSecond = '0';
  oldHoursFirst = '0';
  oldHoursSecond = '0';
  oldDate = '0';
  oldMonth = '0';
  oldYear = '0';
  oldDay = '0';

  private daysOfWeek = new DaysOfWeek();

  constructor() {
    //this.fillAtLoad(); // The setInterval of startTime() starts only after 1 second.
    this.startTime();
  }

  startTime() {
    setInterval(() => {
      this.updateSubjects();
    }, 1000); // can be set higher and the subjects will only get updated when they change.
  }

  // Creates new date and extracts data. Then updates values only if they are different.
  updateSubjects() {
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


  getSecondsFirstDigit(): Observable<any> {
    return this.secondsFirstDigitSubject.asObservable();
  }

  getSecondsSecondDigit(): Observable<any> {
    return this.secondsSecondDigitSubject.asObservable();
  }

  getMinutesFirstDigit(): Observable<any> {
    return this.minutesFirstDigitSubject.asObservable();
  }

  getMinutesSecondDigit(): Observable<any> {
    return this.minutesSecondDigitSubject.asObservable();
  }

  getHoursFirstDigit(): Observable<any> {
    return this.hoursFirstDigitSubject.asObservable();
  }

  getHoursSecondDigit(): Observable<any> {
    return this.hoursSecondDigitSubject.asObservable();
  }

  getDate(): Observable<any> {
    return this.dateSubject.asObservable();
  }

  getMonth(): Observable<any> {
    return this.monthSubject.asObservable();
  }

  getYear(): Observable<any> {
    return this.yearSubject.asObservable();
  }

  getDay(): Observable<any> {
    return this.daySubject.asObservable();
  }

  // used to transform the day of the week number into human readable weekdays.
  translateDayToLanguage(dayNr: string): string {
    return this.daysOfWeek.days[Number(dayNr) - 1]; // new Date() returns a day number starting from 1.
  }

  correctLength(digits: string): string {
    if (digits.length < 2) {
      return '0' + digits;
    }
    else {
      return digits;
    }

  }

  fillAtLoad(): void {
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

    this.secondsFirstDigitSubject.next(secondsFirstDigit);
    this.secondsSecondDigitSubject.next(secondsSecondDigit);
    this.minutesFirstDigitSubject.next(minutesFirstDigit);
    this.minutesSecondDigitSubject.next(minutesSecondDigit);
    this.hoursFirstDigitSubject.next(hoursFirstDigit);
    this.hoursSecondDigitSubject.next(hoursSecondDigit);
    this.dateSubject.next(date);
    this.monthSubject.next(month);
    this.yearSubject.next(year);
    this.daySubject.next(day);
  }

}
