import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from 'src/app/_service';
import { mm_customer } from '../../Models';
import { AccOpenDM } from '../../Models/deposit/AccOpenDM';
import { mm_acc_type } from '../../Models/deposit/mm_acc_type';
import { mm_constitution } from '../../Models/deposit/mm_constitution';
import { mm_oprational_intr } from '../../Models/deposit/mm_oprational_intr';
import { td_accholder } from '../../Models/deposit/td_accholder';
import { td_introducer } from '../../Models/deposit/td_introducer';
import { td_nominee } from '../../Models/deposit/td_nominee';
import { td_signatory } from '../../Models/deposit/td_signatory';
import { tm_deposit } from '../../Models/tm_deposit';

@Component({
  selector: 'app-acc-opening',
  templateUrl: './acc-opening.component.html',
  styleUrls: ['./acc-opening.component.css']
})


export class AccOpeningComponent implements OnInit {

  // savingDepositForm: FormGroup;
  // nomineeForm: FormGroup;

  constructor(
    private frmBldr: FormBuilder,
    private svc: RestService
  ) { }

  transTypeFlg = 0;
  accountTypeDiv = 1;
  branchCode = '0';

  isLoading = false;
  disableAll = false;

  // Declaration of model for each Div
  masterData = new AccOpenDM();
  tm_deposit = new tm_deposit();
  td_nomineeList: td_nominee[] = [];
  td_signatoryList: td_signatory[] = [];
  td_accholderList: td_accholder[] = [];
  td_introducerlist: td_introducer[] = [];


  tempAccountTypeDscr = null;

  customerList: mm_customer[] = [];
  suggestedCustomer: mm_customer[];
  selectedCustomer = new mm_customer();

  accountTypeList: mm_acc_type[] = [];
  constitutionList: mm_constitution[] = [];
  selectedConstitutionList: mm_constitution[] = [];
  // selectedConstitutionVal: number = 0;

  operationalInstrList: mm_oprational_intr[] = [];
  // selectedOperationalInstrVal: number = 0;

  relationship = [
  { id: 1, val: 'Father' },
  { id: 2, val: 'Mother' },
  { id: 3, val: 'Sister' },
  { id: 4, val: 'Brother' },
  { id: 5, val: 'Friend' },
  { id: 6, val: 'Son' },
  { id: 7, val: 'Daughter' },
  { id: 8, val: 'Others' } ];


  ngOnInit(): void {

    this.isLoading = true;
    // this.disableAll = true;

    this.branchCode = localStorage.getItem('__brnCd');

    this.suggestedCustomer = null;

    this.initializeAllModels();

    this.getCustomerList();
    this.getConstitutionList();
    this.getAccountTypeList();
    this.getOperationalInstr();


  }

  initializeAllModels() {

    this.masterData = new AccOpenDM();
    this.tm_deposit = new tm_deposit();

    const sig: td_signatory[] = [];
    this.td_signatoryList = sig;
    this.addSignatory();

    const acc: td_accholder[] = [];
    this.td_accholderList = acc;
    this.addJointHolder();

    const intr: td_introducer[] = [];
    this.td_introducerlist = intr;
    this.addIntroducer();

    const nom: td_nominee[] = [];
    this.td_nomineeList = nom;
    this.addNominee();
  }

setTransType(val: any)
{
  this.transTypeFlg = val;
}

  setAccountType(val: number) {
    debugger;
    if (val === 0) {
      val = 1;
    }
    this.accountTypeDiv = val;

    this.tm_deposit.acc_type_cd = val;
    this.tm_deposit.acc_type_desc = this.accountTypeList.filter(x => x.acc_type_cd.toString() === val.toString())[0].acc_type_desc;

    this.selectedConstitutionList = this.constitutionList.filter(x => x.acc_type_cd.toString() === val.toString());
  }

  setRelationship(id: number, idx: number, ) {
    debugger;
    this.td_accholderList[idx].relation = id.toString();
    this.td_accholderList[idx].relationDscr = this.relationship.filter(x => x.id.toString() === id.toString())[0].val;
    debugger;
  }


  setConstitutionType(val: number) {
    // debugger;
    // this.selectedConstitutionVal = val;
    this.tm_deposit.constitution_cd = val;
    this.tm_deposit.constitution_desc = this.constitutionList.filter(x => x.acc_type_cd.toString() === val.toString())[0].constitution_desc;
  }

  setOperationalInstr(val: number) {
    // debugger;
    // this.selectedOperationalInstrVal = val;
    this.tm_deposit.oprn_instr_cd = val;
    this.tm_deposit.oprn_instr_desc = this.operationalInstrList.filter(x => x.oprn_cd.toString() === val.toString())[0].oprn_desc;

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
        this.disableAll = false;
      },
      err => { this.isLoading = false; }
    );
  }


getConstitutionList()
{
      this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
        res => {
          // debugger;
          this.constitutionList = res;
        },
        err => { // debugger;
        }
      );
}

getAccountTypeList()
{
      this.svc.addUpdDel<any>('Mst/GetAccountTypeMaster', null).subscribe(
        res => {
          // debugger;
          this.accountTypeList = res;
          this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D' );
          // this.accountTypeList = this.accountTypeList.sort(x => x.acc_type_cd );
          this.accountTypeList = this.accountTypeList.sort((a, b) => ( a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
        },
        err => {
          // debugger;
        }
      );
}

getOperationalInstr()
{
      this.svc.addUpdDel<any>('Mst/GetOprationalInstr', null).subscribe(
        res => {
          // debugger;
          this.operationalInstrList = res;
          this.operationalInstrList = this.operationalInstrList.sort( (a, b) => ( a.oprn_cd > b.oprn_cd) ? 1 : -1);
        },
        err => {
          // debugger;
        }
      );
}


public suggestCustomer(): void {
  this.suggestedCustomer = this.customerList
    .filter(c => c.cust_name.toLowerCase().startsWith(this.tm_deposit.cust_name.toLowerCase()))
    .slice(0, 20);
}

public selectCustomer(cust_cd: number): void {
  this.tm_deposit.cust_cd = cust_cd;
  this.populateCustDtls(cust_cd);

  this.suggestedCustomer = null;
}

populateCustDtls(cust_cd: number)
{
  var temp_mm_cust = new mm_customer();
  temp_mm_cust = this.customerList.filter( c => c.cust_cd.toString() === cust_cd.toString())[0];

  this.tm_deposit.cust_name = temp_mm_cust.cust_name;
  this.tm_deposit.cust_type = temp_mm_cust.cust_type;
  this.tm_deposit.gurdain_name = temp_mm_cust.guardian_name;
  this.tm_deposit.date_of_birth = temp_mm_cust.date_of_death;
  this.tm_deposit.sex = temp_mm_cust.sex;
  this.tm_deposit.phone = temp_mm_cust.phone;
  this.tm_deposit.category = temp_mm_cust.catg_cd.toString();
  this.tm_deposit.occupation = temp_mm_cust.occupation;
  this.tm_deposit.email = temp_mm_cust.email;
  this.tm_deposit.present_addr = temp_mm_cust.present_address;

}

addSignatory() {
  var temp_td_signatory = new td_signatory();
  this.td_signatoryList.push(temp_td_signatory);
}

removeSignatory() {
  if (this.td_signatoryList.length > 1)
    this.td_signatoryList.pop();
}

  addNominee() {
    var temp_td_nominee = new td_nominee();
    this.td_nomineeList.push(temp_td_nominee);
  }
  removeNominee() {
   if ( this.td_nomineeList.length > 1 )
    this.td_nomineeList.pop();
  }

  addJointHolder() {
    var temp_td_accholder = new td_accholder();
    this.td_accholderList.push(temp_td_accholder);
  }
  removeJointHolder() {
   if ( this.td_accholderList.length > 1 )
    this.td_accholderList.pop();
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
