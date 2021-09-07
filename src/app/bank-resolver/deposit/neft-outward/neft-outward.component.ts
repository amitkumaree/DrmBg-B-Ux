import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from 'src/app/_service';
import { MessageType, ShowMessage, SystemValues, mm_ifsc_code, td_outward_payment } from '../../Models';

@Component({
  selector: 'app-neft-outward',
  templateUrl: './neft-outward.component.html',
  styleUrls: ['./neft-outward.component.css']
})
export class NeftOutwardComponent implements OnInit {

  constructor(private svc: RestService, private router: Router,
  ) { }

  alertMsgType: string;
  alertMsg: string;
  disabledAll = false;
  showAlert = false;
  isLoading = false;
  showMsg: ShowMessage;
  branchCode = '0';
  userName = '';
  sys = new SystemValues();
  isRetrieve = true;
  suggestedIfsc: mm_ifsc_code[];
  isOpenFromDp = false;

  neftPay = new td_outward_payment();
  neftPayRet = new td_outward_payment();

  ngOnInit(): void {

    this.branchCode = this.sys.BranchCode;
    this.userName = this.sys.UserId;
    this.neftPayRet.brn_cd = this.sys.BranchCode;
    this.neftPayRet.trans_dt = this.sys.CurrentDate;
  }


  GetNeftOutDtls() {
    this.isLoading = true;
    this.neftPay.brn_cd = this.sys.BranchCode;
    this.neftPayRet.trans_dt = this.sys.CurrentDate;
    this.neftPay.trans_cd = this.neftPayRet.trans_cd;
    this.svc.addUpdDel<any>('Deposit/GetNeftOutDtls', this.neftPay).subscribe(
      res => {
        if (res.length === 0) {
          this.neftPayRet.trans_cd = null;
          this.isLoading = false;
          this.isRetrieve = true;
          this.HandleMessage(true, MessageType.Error, 'No Data Found!!!!');
          return;
        }
        else {
          this.neftPayRet = res[0];
          this.isLoading = false;
          this.isRetrieve = true;
        }

      },
      err => {
        this.isLoading = false;
        this.isRetrieve = true;
        this.HandleMessage(true, MessageType.Error, 'No Data Found!!!!');
      }
    );
  }


  public closeAlertMsg() {
    this.showAlert = false;
    this.disabledAll = false;
  }


  public showAlertMsg(msgTyp: string, msg: string) {
    this.alertMsgType = msgTyp;
    this.alertMsg = msg;
    this.showAlert = true;
    this.disabledAll = true;
  }

  clearData() {
    this.isRetrieve = true;
    this.neftPayRet = new td_outward_payment();
  }

  retrieveData() {
    this.isRetrieve = false;
    this.neftPayRet = new td_outward_payment();
  }

  deleteData() {
    if (this.neftPayRet.trans_cd === 0 || this.neftPayRet.trans_cd == null) {
      this.HandleMessage(true, MessageType.Error, 'Retrieve a unapprove transaction for delete!!!');
      return;
    }
    if (this.neftPayRet.approval_status === 'A' && this.neftPayRet.trans_cd > 0) {
      this.HandleMessage(true, MessageType.Error, 'Already Approved Transaction!!!');
      return;
    }
    if (!(confirm('Are you sure you want to Delete The Transaction '))) {
      return;
    }

    this.isRetrieve = true;
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/DeleteNeftOutDtls', this.neftPayRet).subscribe(
      res => {

        this.isLoading = false;
        if (res === 0) {
          this.HandleMessage(true, MessageType.Sucess, 'Deleted Successfully!!!');
          this.neftPayRet = new td_outward_payment();
        }
        else {
          this.HandleMessage(true, MessageType.Error, 'Delete Failed!!!');
        }

      },
      err => {
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, 'Delete Failed!!!');
      }
    );

  }

  approveData() {
    if (this.neftPayRet.trans_cd === 0 || this.neftPayRet.trans_cd == null) {
      this.HandleMessage(true, MessageType.Error, 'Retrieve a unapprove transaction first!!!');
      return;
    }
    if (this.neftPayRet.approval_status === 'A' && this.neftPayRet.trans_cd > 0) {
      this.HandleMessage(true, MessageType.Error, 'Already Approved Transaction!!!');
      return;
    }

    this.isRetrieve = true;
    this.isLoading = true;
    this.neftPayRet.approval_status = 'A';
    this.neftPayRet.approved_by = this.sys.UserId;
    this.neftPayRet.approved_dt = this.sys.CurrentDate;
    this.svc.addUpdDel<any>('Deposit/ApproveNeftPaymentTrans', this.neftPayRet).subscribe(
      res => {

        this.isLoading = false;
        if (res === 0) {
          this.HandleMessage(true, MessageType.Sucess, 'Approved Successfully!!!');
        }
        else {
          this.HandleMessage(true, MessageType.Error, 'Approve Failed!!!');
        }
      },
      err => {
        this.isLoading = false;
        this.HandleMessage(true, MessageType.Error, 'Approve Failed!!!');
      }
    );
  }

  setPaymentType(accType: string) {

    this.neftPayRet.payment_type = accType;
  }
  saveData() {

    if (this.neftPayRet.approval_status === 'A' && this.neftPayRet.trans_cd > 0) {
      this.HandleMessage(true, MessageType.Error, 'Already Approved Transaction!!!');
      return;
    }
    if (this.neftPayRet.payment_type == null || this.neftPayRet.payment_type === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Payment Type Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bene_name == null || this.neftPayRet.bene_name === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Beneficiary Name Can not be Blank');
      return;
    }
    else if (this.neftPayRet.amount == null || this.neftPayRet.amount === 0) {
      this.HandleMessage(true, MessageType.Error, 'Amount Can not be Blank');
      return;
    }
    else if (this.neftPayRet.date_of_payment == null) {
      this.HandleMessage(true, MessageType.Error, 'Date of Payment Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bene_acc_no == null || this.neftPayRet.bene_acc_no === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Beneficiary Account No Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bene_ifsc_code == null || this.neftPayRet.bene_ifsc_code === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Beneficiary IFSC Can not be Blank');
      return;
    }
    else if (this.neftPayRet.dr_acc_no == null || this.neftPayRet.dr_acc_no === 0) {
      this.HandleMessage(true, MessageType.Error, 'Dr. A/C No Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bank_dr_acc_type == null || this.neftPayRet.bank_dr_acc_type === 0) {
      this.HandleMessage(true, MessageType.Error, 'Beneficiary A/C Type Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bank_dr_acc_no == null || this.neftPayRet.bank_dr_acc_no === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Bank Dr. A/C No Can not be Blank');
      return;
    }
    else if (this.neftPayRet.bank_dr_acc_name == null || this.neftPayRet.bank_dr_acc_name === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Bank Dr. A/C name Can not be Blank');
      return;
    }
    else if (this.neftPayRet.credit_narration == null || this.neftPayRet.credit_narration === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Credit Narration Can not be Blank');
      return;
    }
    this.isRetrieve = true;

    this.neftPayRet.created_by = this.sys.UserId;
    this.neftPayRet.modified_by = this.sys.UserId;
    if (this.neftPayRet.trans_cd > 0) {
      this.svc.addUpdDel<any>('Deposit/UpdateNeftOutDtls', this.neftPayRet).subscribe(
        res => {

          this.isLoading = false;
          this.HandleMessage(true, MessageType.Sucess, 'Transaction Updated Successfully!!!');
        },
        err => {
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Error, 'Updated Failed!!!');
        }
      );

    }
    else {
      this.neftPayRet.approval_status = 'U';
      this.svc.addUpdDel<any>('Deposit/InsertNeftOutDtls', this.neftPayRet).subscribe(
        res => {

          this.neftPayRet.trans_cd = res;
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Sucess,
            'Transaction Saved Successfully. Trans Code : '
            + this.neftPayRet.trans_cd.toString());
        },
        err => {
          this.isLoading = false;
          this.HandleMessage(true, MessageType.Error, 'Insert Failed!!!');
        }
      );
    }

  }
  suggestIfsc(): void {


    if (this.neftPayRet.bene_ifsc_code.length > 3) {
      const ifscentred = this.neftPayRet.bene_ifsc_code;
      let neftPaySearch = new td_outward_payment();
      neftPaySearch.bene_ifsc_code = ifscentred;
      this.isLoading = true;
      this.svc.addUpdDel<any>('Deposit/GetIfscCode', neftPaySearch).subscribe(
        res => {

          this.isLoading = false;
          if (undefined !== res && null !== res && res.length > 0) {
            this.suggestedIfsc = res.slice(0, 10);
          } else {
            this.suggestedIfsc = [];
          }
        },
        err => { this.isLoading = false; }
      );
    } else {
      this.suggestedIfsc = null;
      this.isLoading = false;
    }
  }
  public SelectedIfsc(cust: any): void {
    this.neftPayRet.bene_ifsc_code = (cust.ifsc);
    this.suggestedIfsc = null;
  }


  backScreen() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }

}
