import Utils from "src/app/_utility/utils";

export class SystemValues {
  private __brnCd: string;
  private __brnName: string;
  private __currentDate: string;
  private __cashaccountCD: string;
  private __suspanceccountCD: string;
  private __ddsPeriod: string;
  private __userId: string;
  private __bName: string;
  private __minBalWdChq: string;
  private __minBalNoChq: string;
  private __isLoggedIn: boolean;

  constructor() {
    ;
    this.__brnCd = localStorage.getItem('__brnCd');
    this.__brnName = localStorage.getItem('__brnName');
    this.__currentDate = localStorage.getItem('__currentDate');
    this.__cashaccountCD = localStorage.getItem('__cashaccountCD');
    // this.__suspanceccountCD = localStorage.getItem('__suspanceccountCD');
    this.__suspanceccountCD = '10000';
    this.__ddsPeriod = localStorage.getItem('__ddsPeriod');
    this.__userId = localStorage.getItem('__userId');
    if (null !== this.__userId && '' !== this.__userId && this.__userId.length > 0) {
      this.__isLoggedIn = true;
    } else { this.__isLoggedIn = false; }
    this.__bName = localStorage.getItem('__bName');
    this.__minBalWdChq = localStorage.getItem('__minBalWdChq');
    this.__minBalNoChq = localStorage.getItem('__minBalNoChq');
  }

  get IsUsrLoggedIn(): boolean {
    return this.__isLoggedIn;
  }

  get BranchCode(): string {
    return this.__brnCd;
  }
  get BranchName(): string {
    return this.__brnName;
  }
  /* expected dt dd/mm/yy */
  get CurrentDate(): Date {
    return Utils.convertStringToDt(this.__currentDate);
  }
  get CashAccCode(): number {
    return +this.__cashaccountCD;
  }

  get SuspanceAccCode(): number {
    return +this.__suspanceccountCD;
  }

  get DdsPeriod(): number {
    return +this.__ddsPeriod;
  }
  get UserId(): string {
    return this.__userId;
  }
  get BankName(): string {
    return this.__bName;
  }
  get MinBalanceWithCheque(): string {
    return this.__minBalWdChq;
  }
  get MinBalanceWithOutCheque(): string {
    return this.__minBalNoChq;
  }


  /** expected format of the string is dd/mm/yyyy */
  // private convertStringToDt(str: string): Date {
  //   const dateParts = str.split('/');
  //   return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
  // }
}
