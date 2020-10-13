import { Component, ElementRef, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExportAsService } from 'ngx-export-as';
import { InAppMessageService, RestService } from 'src/app/_service';
import {
  MessageType, mm_customer, ShowMessage, td_def_trans_trf,
  mm_acc_type, TranApprovalVM, tm_deposit
} from '../../Models';

@Component({
  selector: 'app-transactionapproval',
  templateUrl: './transactionapproval.component.html',
  styleUrls: ['./transactionapproval.component.css'],

})
export class TransactionapprovalComponent implements OnInit {

  constructor(private svc: RestService, private elementRef: ElementRef,
    private msg: InAppMessageService) { }
  static accType: mm_acc_type[] = [];
  vm: TranApprovalVM[] = [];
  selectedTransactionCd: number;
  isLoading = false;
  showMsg: ShowMessage;
  tdDepTrans = new td_def_trans_trf();
  // tdDepTransRet: td_def_trans_trf[] = [];
  tdDepTransGroup: any;
  custTitle: string;
  cust: mm_customer;

  ngOnInit(): void {
    debugger;
    // this.elementRef.nativeElement.style.setProperty('--bkcolor', 'white');
    this.getAcctTypeMaster();

  }

  private getAcctTypeMaster(): void {
    this.isLoading = true;
    if (undefined !== TransactionapprovalComponent.accType &&
      null !== TransactionapprovalComponent.accType &&
      TransactionapprovalComponent.accType.length > 0) {
      this.isLoading = false;
      this.GetUnapprovedDepTrans();
    } else {
      this.svc.addUpdDel<mm_acc_type[]>('Mst/GetAccountTypeMaster', null).subscribe(
        res => {
          TransactionapprovalComponent.accType = res;
          this.isLoading = false;
          this.GetUnapprovedDepTrans();
        },
        err => {this.isLoading = false; }
      );
    }
  }
  public selectTransaction(vm: TranApprovalVM): void {
    this.selectedTransactionCd = vm.td_def_trans_trf.trans_cd;
    this.getTranAcctInfo(vm.td_def_trans_trf.acc_num);
    this.getDepTrans(vm.td_def_trans_trf);
  }

  private getDepTrans(depTras: td_def_trans_trf): void {
    this.isLoading = true;
    // this.showCust = false; // this is done to forcibly rebind the screen
    // const defTransaction = new td_def_trans_trf();
    // defTransaction.trans_cd = this.selectedTransactionCd;
    // defTransaction.brn_cd = localStorage.getItem('__brnCd');
    this.svc.addUpdDel<td_def_trans_trf>('Common/GetDepTrans', depTras).subscribe(
      res => {
        debugger;
        this.msg.sendCommonTransactionInfo(res[0]); // show transaction details
        this.isLoading = false;
      },
      err => { this.isLoading = false; }
    );
  }
  private getCustInfo(cust_cd: number): void {
    this.isLoading = true;
    // this.showCust = false; // this is done to forcibly rebind the screen
    const cust = new mm_customer(); cust.cust_cd = cust_cd;
    this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
      res => {
        this.cust = res[0];
        this.msg.sendCommonCustInfo(res[0]);
        this.isLoading = false;
      },
      err => { this.isLoading = false; }
    );
  }

  private getTranAcctInfo(forAcc: string): void {
    this.isLoading = false;
    let acc = new tm_deposit();
    acc.acc_num = forAcc; acc.brn_cd = localStorage.getItem('__brnCd');
    this.svc.addUpdDel<tm_deposit>('Deposit/GetDepositView', acc).subscribe(
      res => {
        acc = res;
        debugger;
        this.msg.sendCommonAcctInfo(res[0]);
        this.isLoading = false;
        this.getCustInfo(acc.cust_cd);
      },
      err => { this.isLoading = false; }
    );
  }

  /** Below method handles message show/hide */
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

  private GetUnapprovedDepTrans(): void {
    this.isLoading = true;
    this.tdDepTrans.brn_cd = localStorage.getItem('__brnCd');
    this.svc.addUpdDel<any>('Common/GetUnapprovedDepTrans', this.tdDepTrans).subscribe(
      res => {
        debugger;
        const tdDepTransRet = res as td_def_trans_trf[];
        tdDepTransRet.forEach(element => {
          const vm = new TranApprovalVM();
          vm.mm_acc_type = TransactionapprovalComponent.accType.filter(e => e.acc_type_cd === element.acc_type_cd)[0];
          vm.td_def_trans_trf = element;
          this.vm.push(vm);
        });
        // this.tdDepTransGroup = this.groupBy(this.tdDepTransRet, (c) => c.acc_type_cd);
        this.isLoading = false;
      },
      err => { this.isLoading = false; }
    );
  }

  // groupBy(xs, f) {
  //   const gc = xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {})
  //   return Object.keys(gc).map(acc_type_cd => ({ acc_type_cd: acc_type_cd, events: gc[acc_type_cd] }));;
  // }
  // toggleSelection(i) {
  //   this.tdDepTransGroup[i].open = !this.tdDepTransGroup[i].open;
  // }
  // OnSelectTransaction(ev: any) {
  //   debugger;
  //   this.elementRef.nativeElement.style.setProperty('--bkcolor', 'red');
  // }

}
