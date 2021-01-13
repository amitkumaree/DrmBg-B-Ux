import Utils from "src/app/_utility/utils";

export class SystemValues {
  private __brnCd: string;
  private __brnName: string;
  private __currentDate: string;
  private __cashaccountCD: string;
  private __ddsPeriod: string;
  private __userId: string;
  private __bName: string;

  constructor() {
    this.__brnCd = localStorage.getItem('__brnCd');
    this.__brnName = localStorage.getItem('__brnName');
    this.__currentDate = localStorage.getItem('__currentDate');
    this.__cashaccountCD = localStorage.getItem('__cashaccountCD');
    this.__ddsPeriod = localStorage.getItem('__ddsPeriod');
    this.__userId = localStorage.getItem('__userId');
    this.__bName = localStorage.getItem('__bName');
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
  get DdsPeriod(): number {
    return +this.__ddsPeriod;
  }
  get UserId(): string {
    return this.__userId;
  }
  get BankName(): string {
    return this.__bName;
  }

  /** expected format of the string is dd/mm/yyyy */
  // private convertStringToDt(str: string): Date {
  //   const dateParts = str.split('/');
  //   return new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
  // }
}
