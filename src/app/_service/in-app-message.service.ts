import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { mm_customer, td_def_trans_trf, td_rd_installment, tm_deposit,
  tm_depositall } from '../bank-resolver/Models';

@Injectable({
  providedIn: 'root'
})
export class InAppMessageService {
  private SubjectExample = new BehaviorSubject<string>(null);
  private isLoggedInShowHeader = new BehaviorSubject<boolean>(null);
  private commonCustInfo = new BehaviorSubject<mm_customer>(null);
  private commonAcctInfo = new BehaviorSubject<tm_deposit>(null);
  private commonTmdepositAll = new BehaviorSubject<tm_depositall>(null);
  private commonTranInfo = new BehaviorSubject<td_def_trans_trf>(null);
  private commonAccountNumDtl = new BehaviorSubject<string>(null);
  private hideTitleOnHeader = new BehaviorSubject<boolean>(null);

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

  sendCommonTmDepositAll(acctDtl: tm_depositall) { this.commonTmdepositAll.next(acctDtl); }
  getCommonTmDepositAll() { return this.commonTmdepositAll.asObservable(); }

  sendCommonTransactionInfo(TranDtl: td_def_trans_trf) { this.commonTranInfo.next(TranDtl); }
  getCommonTransactionInfo() { return this.commonTranInfo.asObservable(); }

  sendCommonAccountNum(AccountNum: string) { this.commonAccountNumDtl.next(AccountNum); }
  getCommonAccountNum() { return this.commonAccountNumDtl.asObservable(); }


  sendhideTitleOnHeader(hide: boolean) { this.hideTitleOnHeader.next(hide); }
  gethideTitleOnHeader() { return this.hideTitleOnHeader.asObservable(); }
}
