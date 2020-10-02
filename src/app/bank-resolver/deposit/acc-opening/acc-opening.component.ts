import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from 'src/app/_service';
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
  accountType = 1;
  branchCode = '0';

  savingDepositForm: FormGroup;
  fixedDepositForm: FormGroup;
  dbsForm: FormGroup;
  termDepositForm: FormGroup;
  monthlyIncomeForm: FormGroup;
  recurringDepositForm: FormGroup;

  nomineeForm: FormGroup;

  td_signatorylist: td_signatory[] = [];
  td_nomineelist: td_nominee[] = [];
  td_accholderlist: td_accholder[] = [];
  td_introducerlist: td_introducer[] = [];




  ngOnInit(): void {
    this.branchCode = localStorage.getItem('__brnCd');

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

setAccountType(val: any)
{
  debugger;
  if (val == "?")
  {
    val = 1;
  }
   this.accountType = val;
}


xxxxxxxx(val: any)
{
   null;
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
