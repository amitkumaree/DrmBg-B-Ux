import { p_loan_param } from 'src/app/bank-resolver/Models/loan/p_loan_param';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { InAppMessageService, RestService } from 'src/app/_service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TranApprovalVM } from 'src/app/bank-resolver/Models/TranApprovalVM';
import {
  MessageType, mm_acc_type, mm_customer,
  ShowMessage, SystemValues,
  td_def_trans_trf, tm_deposit
} from 'src/app/bank-resolver/Models';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { Router } from '@angular/router';
import { tm_loan_all } from 'src/app/bank-resolver/Models/loan/tm_loan_all';
import { LoanOpenDM } from 'src/app/bank-resolver/Models/loan/LoanOpenDM';


@Component({
  selector: 'app-loan-transaction-approval',
  templateUrl: './loan-transaction-approval.component.html',
  styleUrls: ['./loan-transaction-approval.component.css']
})
export class LoanTransactionApprovalComponent implements OnInit {
  constructor(private svc: RestService, private elementRef: ElementRef,
    private msg: InAppMessageService, private modalService: BsModalService,
    private router: Router) { }

  static accType: mm_acc_type[] = [];
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('kycContent', { static: true }) kycContent: TemplateRef<any>;
  selectedAccountType: number;
  selectedTransactionMode: string;
  vm: TranApprovalVM[] = [];
  filteredVm: TranApprovalVM[] = [];
  selectedVm: TranApprovalVM;
  selectedTransactionCd: number;
  isLoading = false;
  showMsg: ShowMessage;
  disableApprove = true;
  tdDepTrans = new td_def_trans_trf();
  tdDepTransGroup: any;
  custTitle: string;
  uniqueAccTypes: mm_acc_type[] = [];
  modalRef: BsModalRef;
  sys = new SystemValues();
  // cust: mm_customer;
  // tdDepTransRet: td_def_trans_trf[] = [];

  ngOnInit(): void {
    ;
    this.getAcctTypeMaster();

  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }
  public onClickRefreshList() {
    this.HandleMessage(false);
    this.msg.sendCommonTransactionInfo(null);
    this.msg.sendCommonCustInfo(null);
    this.msg.sendCommonAcctInfo(null);
    this.msg.sendCommonAccountNum(null);

    this.getAcctTypeMaster();
  }

  private getAcctTypeMaster(): void {
    ;
    this.isLoading = true;
    if (undefined !== LoanTransactionApprovalComponent.accType &&
      null !== LoanTransactionApprovalComponent.accType &&
      LoanTransactionApprovalComponent.accType.length > 0) {
      this.isLoading = false;
      // this.uniqueAccTypes = TransactionapprovalComponent.accType;
      this.GetUnapprovedDepTrans();
    } else {
      this.svc.addUpdDel<mm_acc_type[]>('Mst/GetAccountTypeMaster', null).subscribe(
        res => {
          LoanTransactionApprovalComponent.accType = res;
          this.isLoading = false;
          // this.uniqueAccTypes = TransactionapprovalComponent.accType;
          this.GetUnapprovedDepTrans();
        },
        err => { this.isLoading = false; }
      );
    }
  }
  public selectTransaction(vm: TranApprovalVM): void {
    this.disableApprove = false;
    this.selectedVm = vm;
    this.selectedTransactionCd = vm.td_def_trans_trf.trans_cd;
    this.selectedAccountType = vm.td_def_trans_trf.acc_type_cd;
    this.selectedTransactionMode = vm.td_def_trans_trf.trans_mode;
    // this.getTranAcctInfo(vm.td_def_trans_trf.acc_num);
    this.getDepTrans(vm.td_def_trans_trf);
  }

  private getDepTrans(depTras: td_def_trans_trf): void {
    this.isLoading = true;
    let tmLoanAll = new tm_loan_all();
    let loanOpnDm = new LoanOpenDM();

    tmLoanAll.loan_id = '' + depTras.acc_num;
    tmLoanAll.brn_cd = this.sys.BranchCode;
    tmLoanAll.acc_cd = depTras.acc_type_cd;

    this.svc.addUpdDel<any>('Loan/GetLoanData', tmLoanAll).subscribe(
      res => {
        ;
        loanOpnDm = res;
        this.selectedVm.loan = loanOpnDm;
        this.msg.sendCommonLoanTransactionInfo(res); // show transaction details
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
        this.selectedVm.mm_customer = res[0];
        this.msg.sendCommonCustInfo(res[0]);
        this.msg.sendcustomerCodeForKyc(this.selectedVm.mm_customer.cust_cd);
        this.isLoading = false;
      },
      err => { this.isLoading = false; }
    );
  }

  private getTranAcctInfo(forAcc: string): void {
    this.isLoading = false;
    let acc = new tm_deposit();
    acc.acc_num = forAcc; acc.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    this.svc.addUpdDel<tm_deposit>('Deposit/GetDepositView', acc).subscribe(
      res => {
        acc = res[0];
        this.selectedVm.tm_deposit = acc;
        ;
        this.msg.sendCommonAcctInfo(acc);
        this.msg.sendCommonAccountNum(acc.acc_num);
        this.isLoading = false;
        // this.getCustInfo(acc.cust_cd);
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
    ;
    this.isLoading = true;
    this.tdDepTrans.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    this.tdDepTrans.trans_type = 'L';
    this.svc.addUpdDel<any>('Common/GetUnapprovedDepTrans', this.tdDepTrans).subscribe(
      res => {
        ;
        const tdDepTransRet = res as td_def_trans_trf[];
        this.vm = [];
        tdDepTransRet.forEach(element => {
          const vm = new TranApprovalVM();
          vm.mm_acc_type = LoanTransactionApprovalComponent.accType.
            filter(e => e.acc_type_cd === element.acc_type_cd && e.dep_loan_flag === 'L')[0];
          vm.td_def_trans_trf = element;
          this.vm.push(vm);
          // add and check account type in unique account type list
          const isAcctTypePresent = this.uniqueAccTypes.filter(e => e.acc_type_cd === vm.mm_acc_type.acc_type_cd)[0];
          if (undefined === isAcctTypePresent) {
            this.uniqueAccTypes.push(vm.mm_acc_type);
          }

        });

        this.uniqueAccTypes = this.uniqueAccTypes.sort((a, b) => (a.acc_type_cd < b.acc_type_cd ? -1 : 1));
        this.filteredVm = this.vm;
        this.filteredVm = this.filteredVm.sort((a, b) => (a.td_def_trans_trf.trans_cd < b.td_def_trans_trf.trans_cd ? -1 : 1));
        // this.tdDepTransGroup = this.groupBy(this.tdDepTransRet, (c) => c.acc_type_cd);
        this.isLoading = false;
      },
      err => { this.isLoading = false; }
    );
  }

  public onApproveClick(): void {
    debugger;
    // if (this.selectedVm.td_def_trans_trf.trans_type.toLocaleLowerCase() === 'W') {
    //   if (this.selectedVm.tm_deposit.acc_type_cd === 1 ||
    //     this.selectedVm.tm_deposit.acc_type_cd === 7) {
    //     if ((this.selectedVm.tm_deposit.clr_bal - this.selectedVm.td_def_trans_trf.amount) < 0) {
    //       this.HandleMessage(true, MessageType.Warning, 'Balance Will Be Negative....So Operation Rejected.' +
    //         'You First Approve The Deposit Vouchers Then Approve This Voucher.');
    //       return;
    //     }
    //   }
    // }

    ;
    this.isLoading = true;
    let param = new p_loan_param();
    param.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    // param.intt_dt = this.selectedVm.loan.tmloanall.intt_dt;
    // const dt = this.sys.CurrentDate;
    param.loan_id = this.selectedVm.loan.tmloanall.loan_id;
    param.acc_type_cd = this.selectedVm.mm_acc_type.acc_type_cd;
    // param.recov_amt = this.selectedVm.loan.tddeftrans.rec;
    param.curr_intt_rate = this.selectedVm.loan.tmloanall.curr_intt_rate;
    param.curr_prn_recov = this.selectedVm.loan.tmloanall.curr_prn;
    param.curr_intt_recov = this.selectedVm.loan.tmloanall.curr_intt;
    param.ovd_intt_recov = this.selectedVm.loan.tmloanall.ovd_intt;
    // param.gs_user_type = this.sys.u;
    param.gs_user_id = this.sys.UserId;
    param.commit_roll_flag = 1;

    this.svc.addUpdDel<any>('Loan/CalculateLoanInterest', param).subscribe(
      loanRes => {
        this.isLoading = false;
        // if (res === 0) {
        //   this.selectedVm.td_def_trans_trf.approval_status = 'A';
        //   this.HandleMessage(true, MessageType.Sucess, this.selectedVm.tm_deposit.acc_num
        //     + '\'s Transaction with Transancation Cd ' + this.selectedVm.td_def_trans_trf.trans_cd
        //     + ' is approved.');
        //   setTimeout(() => {
        //     this.onClickRefreshList();
        //   }, 3000);
        // } else {
        //   this.HandleMessage(true, MessageType.Error, JSON.stringify(res));
        // }

        // ON SUCCESS
        this.isLoading = true;
        const trnParam = new p_gen_param();
        trnParam.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
        trnParam.ad_trans_cd = this.selectedVm.td_def_trans_trf.trans_cd;
        // const dt = this.sys.CurrentDate;
        trnParam.adt_trans_dt = this.sys.CurrentDate;
        // trnParam.ad_acc_type_cd = this.selectedVm.mm_acc_type.acc_type_cd;
        // trnParam.as_acc_num = this.selectedVm.td_def_trans_trf.acc_num;
        trnParam.flag = this.selectedVm.td_def_trans_trf.trans_type === 'R' ? 'D' : 'W';
        trnParam.gs_user_id = this.sys.UserId;
        this.svc.addUpdDel<any>('Loan/ApproveLoanAccountTranaction', trnParam).subscribe(
          res => {
            this.isLoading = false;
            if (res === 0) {
              this.selectedVm.td_def_trans_trf.approval_status = 'A';
              this.HandleMessage(true, MessageType.Sucess,
                `Transaction with Transancation Cd ${this.selectedVm.td_def_trans_trf.trans_cd} is approved.`);
              setTimeout(() => {
                this.onClickRefreshList();
              }, 3000);
            } else {
              this.HandleMessage(true, MessageType.Error, JSON.stringify(res));
            }
          },
          err => {
            this.isLoading = false;
            this.HandleMessage(true, MessageType.Error, err.error.text);
          }
        );


      },
      loanErr => {
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, loanErr.error.text);
      }
    );

    // this.svc.addUpdDel<any>('Deposit/ApproveAccountTranaction', param).subscribe(
    //   res => {
    //     this.isLoading = false;
    //     if (res === 0) {
    //       this.selectedVm.td_def_trans_trf.approval_status = 'A';
    //       this.HandleMessage(true, MessageType.Sucess, this.selectedVm.tm_deposit.acc_num
    //         + '\'s Transaction with Transancation Cd ' + this.selectedVm.td_def_trans_trf.trans_cd
    //         + ' is approved.');
    //       setTimeout(() => {
    //         this.onClickRefreshList();
    //       }, 3000);
    //     } else {
    //       this.HandleMessage(true, MessageType.Error, JSON.stringify(res));
    //     }
    //   },
    //   err => {
    //     this.isLoading = false;
    //     this.HandleMessage(true, MessageType.Error, err.error.text);
    //   }
    // );

  }

  public onChangeAcctType(acctTypeCd: number): void {
    acctTypeCd = +acctTypeCd;
    if (acctTypeCd === -99) {
      this.filteredVm = this.vm;
    } else {
      this.filteredVm = this.vm.filter(e => e.mm_acc_type.acc_type_cd === acctTypeCd);
    }
  }

  public acctNumberAndTrnCdFilter(searchValue: string): void {
    if (null !== searchValue && '' !== searchValue) {
      this.filteredVm = this.vm.filter(e => e.td_def_trans_trf.acc_num.includes(searchValue) ||
        e.td_def_trans_trf.trans_cd.toString().includes(searchValue));
    } else {
      this.filteredVm = this.vm;
    }
  }

  public ShowOnlyRecovery(e: any): void {
    ;
    if (e.target.checked) {
      this.filteredVm = this.vm.filter(f => f.td_def_trans_trf.trans_type === 'R');
    } else {
      this.filteredVm = this.vm;
    }
  }

  onDeleteClick(): void {
    ;
    if (!(confirm('Are you sure you want to Delete Transaction of Acc ' + this.selectedVm.tm_deposit.acc_num
      + ' with Transancation Cd ' + this.selectedVm.td_def_trans_trf.trans_cd))) {
      return;
    }

    this.isLoading = true;
    let param = new td_def_trans_trf();
    param.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    param.trans_cd = this.selectedVm.td_def_trans_trf.trans_cd;
    // const dt = this.sys.CurrentDate;
    param.trans_dt = this.sys.CurrentDate;
    param.acc_type_cd = this.selectedVm.mm_acc_type.acc_type_cd;
    param.acc_num = this.selectedVm.tm_deposit.acc_num;

    this.svc.addUpdDel<any>('Deposit/DeleteAccountOpeningData ', param).subscribe(
      res => {
        this.isLoading = false;
        if (res === 0) {
          this.onClickRefreshList();
          this.HandleMessage(true, MessageType.Sucess, this.selectedVm.tm_deposit.acc_num
            + '\'s Transaction with Transancation Cd ' + this.selectedVm.td_def_trans_trf.trans_cd
            + ' is deleted.');
        } else {
          this.HandleMessage(true, MessageType.Error, JSON.stringify(res));
        }
      },
      err => {
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, err.error.text);
      }
    );
  }

  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  // groupBy(xs, f) {
  //   const gc = xs.reduce((r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r), {})
  //   return Object.keys(gc).map(acc_type_cd => ({ acc_type_cd: acc_type_cd, events: gc[acc_type_cd] }));;
  // }
  // toggleSelection(i) {
  //   this.tdDepTransGroup[i].open = !this.tdDepTransGroup[i].open;
  // }
  // OnSelectTransaction(ev: any) {
  //   ;
  //   this.elementRef.nativeElement.style.setProperty('--bkcolor', 'red');
  // }

}
