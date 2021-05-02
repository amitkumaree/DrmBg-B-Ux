import { Component, OnInit, ViewChild, ElementRef,TemplateRef} from '@angular/core';
import { Router } from '@angular/router';
import { InAppMessageService, RestService } from 'src/app/_service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { mm_customer } from 'src/app/bank-resolver/Models';
import { SystemValues } from  './../../../Models/SystemValues'
import { tm_loan_all } from 'src/app/bank-resolver/Models/loan/tm_loan_all';
import { mm_acc_type } from 'src/app/bank-resolver/Models/deposit/mm_acc_type';


@Component({
  selector: 'app-open-loan-account',
  templateUrl: './open-loan-account.component.html',
  styleUrls: ['./open-loan-account.component.css']
})
export class OpenLoanAccountComponent implements OnInit {

  @ViewChild('kycContent', { static: true }) kycContent: TemplateRef<any>;

  constructor(private svc: RestService,
    private modalService: BsModalService,
    private router: Router,
    private msg: InAppMessageService,
    ) {   }


    branchCode = '0';
    createUser = '';
    updateUser = '';
    createDate: Date;
    updateDate: Date;

    isLoading = true;

    customerList: mm_customer[] = [];
    accountTypeList: mm_acc_type[] = [];

    tm_loan_all = new tm_loan_all();

    sys = new SystemValues();

    relationship = [
      { id: 1, val: 'Father' },
      { id: 2, val: 'Mother' },
      { id: 3, val: 'Sister' },
      { id: 4, val: 'Brother' },
      { id: 5, val: 'Friend' },
      { id: 6, val: 'Son' },
      { id: 7, val: 'Daughter' },
      { id: 8, val: 'Others' }];

  ngOnInit(): void {

    this.branchCode = this.sys.BranchCode;
    this.createUser = this.sys.UserId;
    this.updateUser = this.sys.UserId;
    this.createDate = this.sys.CurrentDate;
    this.updateDate = this.sys.CurrentDate;

    this.getCustomerList();
    this.getAccountTypeList();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template , {class: 'modal-lg'});
  }

  modalRef: BsModalRef;
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };

  showAlert = false;
  alertMsg: string;
  alertMsgType: string;
  suggestedCustomer: mm_customer[];
  suggestedJointCustomer: mm_customer[];
  isOpenDOBdp = false;

  getCustomerList() {
    debugger;
    const cust = new mm_customer();
    cust.cust_cd = 0;
    cust.brn_cd = this.branchCode;

    if (this.customerList === undefined || this.customerList === null || this.customerList.length === 0) {
      this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
        res => {
          debugger;
          this.isLoading = false;
          this.customerList = res;
        },
        err => {
          this.isLoading = false;
          debugger;
        }
      );
    }
    else
    {this.isLoading = false;}
  }


  getAccountTypeList() {
    debugger;
    if (this.accountTypeList.length > 0) {
      return;
    }
    this.accountTypeList = [];

    this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
      res => {
        debugger;
        this.accountTypeList = res;
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'L');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {
        debugger;
      }
    );
  }

  public suggestCustomer(): void {
    this.suggestedCustomer = this.customerList
        .filter(c => c.cust_name.toLowerCase().startsWith(this.tm_loan_all.cust_name.toLowerCase())
          || c.cust_cd.toString().startsWith(this.tm_loan_all.cust_name)
          || ( c.phone !== null && c.phone.startsWith(this.tm_loan_all.cust_name)))
        .slice(0, 20);
    }

    public setCustDtls(cust_cd: number): void {
      this.tm_loan_all.party_cd = cust_cd;
      this.msg.sendcustomerCodeForKyc(cust_cd);
      this.populateCustDtls(cust_cd);
      this.suggestedCustomer = null;
    }

    populateCustDtls(cust_cd: number) {
      debugger;
      var temp_mm_cust = new mm_customer();
      temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
      this.tm_loan_all.cust_name = temp_mm_cust.cust_name;
    }

    public suggestJointCustomer(): void {
      this.suggestedJointCustomer = this.customerList
          .filter(c => c.cust_name.toLowerCase().startsWith(this.tm_loan_all.joint_cust_name.toLowerCase())
            || c.cust_cd.toString().startsWith(this.tm_loan_all.joint_cust_name)
            || ( c.phone !== null && c.phone.startsWith(this.tm_loan_all.joint_cust_name)))
          .slice(0, 20);
      }

    public setJointCustDtls(cust_cd: number): void {
      this.tm_loan_all.joint_cust_code = cust_cd;
     // this.msg.sendcustomerCodeForKyc(cust_cd);
      this.populateJointCustDtls(cust_cd);
      this.suggestedJointCustomer = null;
    }

    populateJointCustDtls(cust_cd: number) {
      debugger;
      var temp_mm_cust = new mm_customer();
      temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
      this.tm_loan_all.joint_cust_name = temp_mm_cust.cust_name;
    }


  public closeAlertMsg() {
    this.showAlert = false;
  }

  public setLoanAccountType(accType: number): void {
    this.tm_loan_all.acc_cd = Number(accType);
    this.tm_loan_all.loan_acc_type = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0].acc_type_desc;
  }


  public setLoanType(accType: number): void {
    this.tm_loan_all.acc_cd = Number(accType);
    this.tm_loan_all.loan_acc_type = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0].acc_type_desc;
  }

  public onDobChange(value: Date): number {
    debugger;
    if (null !== value) {
      const timeDiff = Math.abs(Date.now() - value.getTime());
      const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25)
      // this.f.age.setValue(age);
      return age;
    }
  }



  // setRelationship(relation: string, idx: number) {
  //   debugger;
  //   this.td_accholderList[idx].cust_cd = Number(this.td_accholderList[idx].cust_cd);
  //   this.td_accholderList[idx].relation = relation;
  //   this.td_accholderList[idx].relationId = this.relationship.filter(x => x.val.toString() === relation)[0].id;
  //   debugger;
  // }




}

