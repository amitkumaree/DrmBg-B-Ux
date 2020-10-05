import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from 'src/app/_service';
import { mm_customer } from '../../Models';
import { mm_acc_type } from '../../Models/deposit/mm_acc_type';
import { mm_constitution } from '../../Models/deposit/mm_constitution';
import { mm_oprational_intr } from '../../Models/deposit/mm_oprational_intr';
import { td_accholder } from '../../Models/deposit/td_accholder';
import { td_introducer } from '../../Models/deposit/td_introducer';
import { td_nominee } from '../../Models/deposit/td_nominee';
import { td_signatory } from '../../Models/deposit/td_signatory';

@Component({
  selector: 'app-acc-opening',
  templateUrl: './acc-opening.component.html',
  styleUrls: ['./acc-opening.component.css']
})


export class AccOpeningComponent implements OnInit {

  constructor(
    private frmBldr: FormBuilder,
    private svc: RestService
  ) { }

  transTypeFlg = 0;
  accountTypeDiv = 1;
  branchCode = '0';
  isLoading = false;

  savingDepositForm: FormGroup;
  fixedDepositForm: FormGroup;
  dbsForm: FormGroup;
  termDepositForm: FormGroup;
  monthlyIncomeForm: FormGroup;
  recurringDepositForm: FormGroup;

  nomineeForm: FormGroup;

  customerList: mm_customer[] = [];
  suggestedCustomer: mm_customer[] = [];
  selectedCustomer = new mm_customer();

  accountTypeList: mm_acc_type[] = [];
  selectedAccountTypeVal: number = 0;

  constitutionList: mm_constitution[] = [];
  selectedConstitutionList: mm_constitution[] = [];
  selectedConstitutionVal: number = 0;

  operationalInstrList: mm_oprational_intr[] = [];
  selectedOperationalInstrVal: number = 0;


  td_signatorylist: td_signatory[] = [];
  td_nomineelist: td_nominee[] = [];
  td_accholderlist: td_accholder[] = [];
  td_introducerlist: td_introducer[] = [];


  ngOnInit(): void {

    this.isLoading = true;
    this.branchCode = localStorage.getItem('__brnCd');

    this.getCustomerList();
    this.getConstitutionList();
    this.getAccountTypeList();
    this.getOperationalInstr();

    this.addSignatory();
    this.addNominee();
    this.addJointHolder();
    this.addIntroducer();

    this.savingDepositForm = this.frmBldr.group({
      constitution: [''],
      oprn_instr: [''],
      cheq_faci: [''],
      stand_instr: [''],
      tds_appl: [''],
      principal: [''],
      amount: [''],
      curr_bal: ['']
    });

    this.nomineeForm = this.frmBldr.group({
      nomineeList: this.frmBldr.array([
        this.frmBldr.group({ nom_name: [''], nom_addr: [''], nom_per: [''], nom_rel: [''] , nom_phone: [''] })])
    });

    // this.custMstrFrm = this.frmBldr.group({
    //   brn_cd: [''],
    //   cust_cd: [''],
    //   cust_type: ['', Validators.required],
    //   title: ['']});


  }


setTransType(val: any)
{
  this.transTypeFlg = val;
}

  setAccountType(val: number) {
    // debugger;
    if (val === 0) {
      val = 1;
    }

    this.accountTypeDiv = val;
    this.selectedAccountTypeVal = val;
    this.selectedConstitutionList = this.constitutionList.filter(x => x.acc_type_cd.toString() === val.toString());
  }

  setConstitutionType(val: number) {
    // debugger;
    this.selectedConstitutionVal = val;
  }

  setOperationalInstr(val: number) {
    // debugger;
    this.selectedOperationalInstrVal = val;

  }

xxxxxxxx(val: any)
{
   null;
}

  getCustomerList() {
    const cust = new mm_customer();
    cust.cust_cd = 0;
    cust.brn_cd = this.branchCode;

    this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
      res => {
        debugger;
        this.isLoading = false;
        this.customerList = res;
      },
      err => { this.isLoading = false; }
    );
  }


getConstitutionList()
{
      this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
        res => {
          debugger;
          this.constitutionList = res;
        },
        err => { debugger;}
      );
}

getAccountTypeList()
{
      this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
        res => {
          debugger;
          this.accountTypeList = res;
          this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D' );
          // this.accountTypeList = this.accountTypeList.sort(x => x.acc_type_cd );
          this.accountTypeList = this.accountTypeList.sort((a, b) => ( a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
        },
        err => {
          debugger;
        }
      );
}

getOperationalInstr()
{
      this.svc.addUpdDel<any>('Mst/GetOprationalInstr', null).subscribe(
        res => {
          debugger;
          this.operationalInstrList = res;
          this.operationalInstrList = this.operationalInstrList.sort( (a, b) => ( a.oprn_cd > b.oprn_cd) ? 1 : -1);
        },
        err => {
          debugger;
        }
      );
}


public suggestCustomer(): void {
  this.suggestedCustomer = this.customerList
    .filter(c => c.cust_name.toLowerCase().startsWith(this.selectedCustomer.cust_name.toLowerCase()))
    .slice(0, 20);
}

public SelectCustomer(cust: mm_customer): void {
  debugger;
  this.selectedCustomer = cust;

  // dt_of_birth: new Date(cust.dt_of_birth),

  this.suggestedCustomer = null;
}

  addSignatory() {
    var temp_td_signatory = new td_signatory();
    this.td_signatorylist.push(temp_td_signatory);
  }
  removeSignatory() {
   if ( this.td_signatorylist.length > 1 )
    this.td_signatorylist.pop();
  }

  addNominee() {
    var temp_td_nominee = new td_nominee();
    this.td_nomineelist.push(temp_td_nominee);
  }
  removeNominee() {
   if ( this.td_nomineelist.length > 1 )
    this.td_nomineelist.pop();
  }

  addJointHolder() {
    var temp_td_accholder = new td_accholder();
    this.td_accholderlist.push(temp_td_accholder);
  }
  removeJointHolder() {
   if ( this.td_accholderlist.length > 1 )
    this.td_accholderlist.pop();
  }

  addIntroducer() {
    var temp_td_introducer = new td_introducer();
    this.td_introducerlist.push(temp_td_introducer);
  }
  removeIntroducer() {
   if ( this.td_introducerlist.length > 1 )
    this.td_introducerlist.pop();
  }


}

