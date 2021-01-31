import { p_gen_param } from './../../Models/p_gen_param';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExportAsService } from 'ngx-export-as';
import { InAppMessageService, RestService } from 'src/app/_service';
import {
  MessageType, mm_customer, ShowMessage, td_def_trans_trf,
  mm_acc_type, tm_deposit, SystemValues
} from '../../Models';
import { TranApprovalVM } from '../../Models/TranApprovalVM';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-transactionapproval',
  templateUrl: './transactionapproval.component.html',
  styleUrls: ['./transactionapproval.component.css'],

})
export class TransactionapprovalComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  constructor(private svc: RestService, private elementRef: ElementRef,
    private msg: InAppMessageService, private modalService: BsModalService) { }
  static accType: mm_acc_type[] = [];
  selectedAccountType: number;
  selectedTransactionMode: string;
  vm: TranApprovalVM[] = [];
  filteredVm: TranApprovalVM[] = [];
  selectedVm: TranApprovalVM;
  selectedTransactionCd: number;
  isLoading = false;
  showMsg: ShowMessage;
  tdDepTrans = new td_def_trans_trf();
  tdDepTransGroup: any;
  custTitle: string;
  uniqueAccTypes: mm_acc_type[] = [];
  modalRef: BsModalRef;
  sys = new SystemValues();
  // cust: mm_customer;
  // tdDepTransRet: td_def_trans_trf[] = [];

  ngOnInit(): void {
    debugger;
    this.getAcctTypeMaster();

  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  public onClickRefreshList() {
    this.msg.sendCommonTransactionInfo(null);
    this.msg.sendCommonCustInfo(null);
    this.msg.sendCommonAcctInfo(null);
    this.msg.sendCommonAccountNum(null);

    this.getAcctTypeMaster();
  }

  private getAcctTypeMaster(): void {
    this.isLoading = true;
    if (undefined !== TransactionapprovalComponent.accType &&
      null !== TransactionapprovalComponent.accType &&
      TransactionapprovalComponent.accType.length > 0) {
      this.isLoading = false;
      this.uniqueAccTypes = TransactionapprovalComponent.accType;
      this.GetUnapprovedDepTrans();
    } else {
      this.svc.addUpdDel<mm_acc_type[]>('Mst/GetAccountTypeMaster', null).subscribe(
        res => {
          TransactionapprovalComponent.accType = res;
          this.isLoading = false;
          // this.uniqueAccTypes = TransactionapprovalComponent.accType;
          this.GetUnapprovedDepTrans();
        },
        err => { this.isLoading = false; }
      );
    }
  }
  public selectTransaction(vm: TranApprovalVM): void {
    this.selectedVm = vm;
    this.selectedTransactionCd = vm.td_def_trans_trf.trans_cd;
    this.selectedAccountType = vm.td_def_trans_trf.acc_type_cd;
    this.selectedTransactionMode = vm.td_def_trans_trf.trans_mode;
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
        this.selectedVm.td_def_trans_trf = res[0];
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
        this.selectedVm.mm_customer = res[0];
        this.msg.sendCommonCustInfo(res[0]);
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
        debugger;
        this.msg.sendCommonAcctInfo(acc);
        this.msg.sendCommonAccountNum(acc.acc_num);
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
    this.tdDepTrans.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    this.svc.addUpdDel<any>('Common/GetUnapprovedDepTrans', this.tdDepTrans).subscribe(
      res => {
        const tdDepTransRet = res as td_def_trans_trf[];
        this.vm = [];
        tdDepTransRet.forEach(element => {
          const vm = new TranApprovalVM();
          vm.mm_acc_type = TransactionapprovalComponent.accType.
            filter(e => e.acc_type_cd === element.acc_type_cd)[0];
          vm.td_def_trans_trf = element;
          this.vm.push(vm);
          // add and check account type in unique account type list
          const isAcctTypePresent = this.uniqueAccTypes.filter(e => e.acc_type_cd === vm.mm_acc_type.acc_type_cd)[0];
          if (undefined === isAcctTypePresent) {
            this.uniqueAccTypes.push(vm.mm_acc_type);
          }

        });
        this.filteredVm = this.vm;
        // this.tdDepTransGroup = this.groupBy(this.tdDepTransRet, (c) => c.acc_type_cd);
        this.isLoading = false;
      },
      err => { this.isLoading = false; }
    );
  }

  public onApproveClick(): void {
    if (this.selectedVm.td_def_trans_trf.trans_type.toLocaleLowerCase() === 'W') {
      if (this.selectedVm.tm_deposit.acc_type_cd === 1 ||
        this.selectedVm.tm_deposit.acc_type_cd === 7) {
        if ((this.selectedVm.tm_deposit.clr_bal - this.selectedVm.td_def_trans_trf.amount) < 0) {
          this.HandleMessage(true, MessageType.Warning, 'Balance Will Be Negative....So Operation Rejected.' +
            'You First Approve The Deposit Vouchers Then Approve This Voucher.');
          return;
        }
      }
    }

    debugger;
    this.isLoading = true;
    let param = new p_gen_param();
    param.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    param.ad_trans_cd = this.selectedVm.td_def_trans_trf.trans_cd;
    // const dt = this.sys.CurrentDate;
    param.adt_trans_dt = this.sys.CurrentDate;
    param.ad_acc_type_cd = this.selectedVm.mm_acc_type.acc_type_cd;
    param.as_acc_num = this.selectedVm.tm_deposit.acc_num;
    param.flag = this.selectedVm.td_def_trans_trf.trans_type === 'D' ? 'D' : 'W';
    param.gs_user_id = this.sys.UserId;
    this.svc.addUpdDel<any>('Deposit/ApproveAccountTranaction', param).subscribe(
      res => {
        this.isLoading = false;
        if (res === 0) {
          this.selectedVm.td_def_trans_trf.approval_status = 'A';
          this.HandleMessage(true, MessageType.Sucess, this.selectedVm.tm_deposit.acc_num
            + '\'s Transaction with Transancation Cd ' + this.selectedVm.td_def_trans_trf.trans_cd
            + ' is approved.');
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
    // this.svc.addUpdDel<any>('Common/P_UPDATE_TD_DEP_TRANS', param).subscribe(
    //   res => {
    //     this.isLoading = false;
    //     const n: number = res;
    //     if (n !== 0) {
    //       this.HandleMessage(true, MessageType.Warning, 'Failed Execute approval P_UPDATE_TD_DEP_TRANS.');
    //     }
    //     if (null !== this.selectedVm.td_def_trans_trf.trans_type) {
    //       param.flag = this.selectedVm.td_def_trans_trf.trans_type === 'D' ? 'D' : 'W';
    //       this.svc.addUpdDel<any>('Common/P_UPDATE_DENOMINATION', param).subscribe(
    //         res => {
    //           const n: number = res;
    //           if (n !== 0) {
    //             this.HandleMessage(true, MessageType.Warning, 'Failed to update denomination.');
    //           }
    //         },
    //         err => {
    //           this.HandleMessage(true, MessageType.Warning, JSON.stringify(err));
    //         }
    //       );
    //     }
    //     // update the Un approved flag with approved.
    //     // TODO below not woking
    //     this.selectedVm.td_def_trans_trf.approval_status = 'A';
    //   },
    //   err => {
    //     this.isLoading = false;
    //     this.HandleMessage(true, MessageType.Warning, JSON.stringify(err));
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

  onDeleteClick(): void {
    debugger;
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
