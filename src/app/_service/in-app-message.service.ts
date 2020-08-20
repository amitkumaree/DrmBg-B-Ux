import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InAppMessageService {
  private SubjectExample = new BehaviorSubject<string>(null);
  private isLoggedInShowHeader = new BehaviorSubject<boolean>(null);

  constructor() { }
  /* Below code is example code */
  sendSubjectExample(message: string) { this.SubjectExample.next(message); }
  getSubjectExample() { return this.SubjectExample.asObservable(); }

  sendisLoggedInShowHeader(message: boolean) { this.isLoggedInShowHeader.next(message); }
  getisLoggedInShowHeader() { return this.isLoggedInShowHeader.asObservable(); }
}
