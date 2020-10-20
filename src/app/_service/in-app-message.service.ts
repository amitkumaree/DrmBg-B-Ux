import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { mm_customer, td_def_trans_trf, tm_deposit } from '../bank-resolver/Models';

@Injectable({
  providedIn: 'root'
})
export class InAppMessageService {
  private SubjectExample = new BehaviorSubject<string>(null);
  private isLoggedInShowHeader = new BehaviorSubject<boolean>(null);
  private commonCustInfo = new BehaviorSubject<mm_customer>(null);
  private commonAcctInfo = new BehaviorSubject<tm_deposit>(null);
  private commonTranInfo = new BehaviorSubject<td_def_trans_trf>(null);

  constructor() { }
  /* Below code is example code */
  sendSubjectExample(message: string) { this.SubjectExample.next(message); }
  getSubjectExample() { return this.SubjectExample.asObservable(); }

  sendisLoggedInShowHeader(message: boolean) { this.isLoggedInShowHeader.next(message); }
  getisLoggedInShowHeader() { return this.isLoggedInShowHeader.asObservable(); }

  sendCommonCustInfo(cust: mm_customer) { this.commonCustInfo.next(cust); }
  getCommonCustInfo() { return this.commonCustInfo.asObservable(); }

  sendCommonAcctInfo(acctDtl: tm_deposit) { this.commonAcctInfo.next(acctDtl); }
  getCommonAcctInfo() { return this.commonAcctInfo.asObservable(); }

  sendCommonTransactionInfo(TranDtl: td_def_trans_trf) { this.commonTranInfo.next(TranDtl); }
  getCommonTransactionInfo() { return this.commonTranInfo.asObservable(); }
}
