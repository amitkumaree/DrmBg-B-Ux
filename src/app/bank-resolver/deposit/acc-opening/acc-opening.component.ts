import { SystemValues } from './../../Models/SystemValues';

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from 'src/app/_service';
import { mm_category, mm_customer, m_acc_master, td_def_trans_trf } from '../../Models';
import { AccOpenDM } from '../../Models/deposit/AccOpenDM';
import { mm_acc_type } from '../../Models/deposit/mm_acc_type';
import { mm_constitution } from '../../Models/deposit/mm_constitution';
import { mm_oprational_intr } from '../../Models/deposit/mm_oprational_intr';
import { td_accholder } from '../../Models/deposit/td_accholder';
import { td_introducer } from '../../Models/deposit/td_introducer';
import { td_nominee } from '../../Models/deposit/td_nominee';
import { td_signatory } from '../../Models/deposit/td_signatory';
import { tm_denomination_trans } from '../../Models/deposit/tm_denomination_trans';
import { tm_transfer } from '../../Models/deposit/tm_transfer';
import { p_gen_param } from '../../Models/p_gen_param';
import { tm_deposit } from '../../Models/tm_deposit';
import { exit } from 'process';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import Utils from 'src/app/_utility/utils';

@Component({
  selector: 'app-acc-opening',
  templateUrl: './acc-opening.component.html',
  styleUrls: ['./acc-opening.component.css']
})


export class AccOpeningComponent implements OnInit {

  constructor(
    // private frmBldr: FormBuilder,
    private svc: RestService,
    private modalService: BsModalService,
  ) { }

  static accTypes: mm_acc_type[] = [];
  // selectedTransType = '';
  transTypeFlg = '';
  accountTypeDiv = 1;
  branchCode = '0';
  savingsDepoSpclPeriod = 0;
  openDate: Date;

  suspanceAccCd: number;
  cashAccCd: number;

 // isOpenFromDp = false;
  modalRef: BsModalRef;
  config = {
    keyboard: false, // ensure esc press doesnt close the modal
    backdrop: true, // enable backdrop shaded color
    ignoreBackdropClick: true // disable backdrop click to close the modal
  };



  createUser = '';
  updateUser = '';
  createDate: Date;
  updateDate: Date;

  sys = new SystemValues();
  denominationGrandTotal = 0;

  isLoading = false;
  // disableCustNameFlg = true;
  disableCustomerName = true;
  disableAll = true;
  disableAccountTypeAndNo = true;

  operationType = '';

  showAlert = false;
  alertMsg: string;
  alertMsgType: string;

  x1 = 1;
  y1 = 1;


  // Declaration of model for each Div
  masterModel = new AccOpenDM();
  tm_deposit = new tm_deposit();
  td_nomineeList: td_nominee[] = [];
  td_signatoryList: td_signatory[] = [];
  td_accholderList: td_accholder[] = [];
  td_introducerlist: td_introducer[] = [];
  tm_denominationList : tm_denomination_trans[] = [];

  td_deftrans= new td_def_trans_trf();
  td_deftranstrfList: td_def_trans_trf[] = [];
  tm_transferList: tm_transfer[] = [];

  dummyList: string[] = [];


  // tempAccountTypeDscr = null;

  customerList: mm_customer[] = [];
  suggestedCustomer: mm_customer[];
  suggestedCustomerSignatories: mm_customer[];
  suggestedCustomerSignatoriesIdx : number;
  suggestedCustomerJointHolder: mm_customer[];

  selectedCustomer = new mm_customer();

  categoryList: mm_category[] = [];
  accountTypeList: mm_acc_type[] = [];
  constitutionList: mm_constitution[] = [];
  selectedConstitutionList: mm_constitution[] = [];
  operationalInstrList: mm_oprational_intr[] = [];

  acc_master :  m_acc_master[] = [];

  p_gen_param = new p_gen_param();

  relationship = [
    { id: 1, val: 'Father' },
    { id: 2, val: 'Mother' },
    { id: 3, val: 'Sister' },
    { id: 4, val: 'Brother' },
    { id: 5, val: 'Friend' },
    { id: 6, val: 'Son' },
    { id: 7, val: 'Daughter' },
    { id: 8, val: 'Others' }];

  intTransferType = [
    { tfr_type: 'M', tfr_desc: 'Monthly' },
    { tfr_type: 'Q', tfr_desc: 'Quarterly' },
    { tfr_type: 'H', tfr_desc: 'Half-Yearly' },
    { tfr_type: 'Y', tfr_desc: 'Yearly' },
    { tfr_type: 'O', tfr_desc: 'On-Maturity' },
  ];

  introducerAccTypeList = [
    { introducer_acc_type_cd: 1, introducer_acc_type_desc: 'Savings A/C' },
    { introducer_acc_type_cd: 8, introducer_acc_type_desc: 'Current A/C' }
  ];

  standingInstrAfterMaturity = [
    { instr_code: '1', instr_dscr: 'Auto Close' },
    { instr_code: '2', instr_dscr: 'Auto Renew' }
  ]


  introducerAccTypeListTemp = [];

  denominations = [
    { rupees: '2000', desc: 'Two Thousand (Rs.2000)' },
    { rupees: '500' , desc: 'Five Hundred (Rs.500)' },
    { rupees: '100' , desc: 'Hundred (Rs.100)' },
    { rupees: '50'  , desc: 'Fifty (Rs.50)' }];

    transferTypeList = [
      { trf_type: 'C', trf_type_desc: 'Cash' },
      { trf_type: 'T', trf_type_desc: 'Transfer' }];

      transferTypeListTemp = this.transferTypeList;

  ngOnInit(): void {

    debugger;

    this.branchCode = this.sys.BranchCode;
    this.createUser = this.sys.UserId;
    this.updateUser = this.sys.UserId;
    this.createDate = this.sys.CurrentDate;
    this.updateDate = this.sys.CurrentDate;

    this.suspanceAccCd = this.sys.SuspanceAccCode;
    this.cashAccCd = this.sys.CashAccCode;

    // this.createDate = this.convertDate(Date.UTC( new Date().getDate() , new Date().getMonth(),  new Date().getFullYear()).toString());
    // this.updateDate = this.convertDate(Date.UTC( new Date().getDate() , new Date().getMonth(),  new Date().getFullYear()).toString());

    this.openDate = this.sys.CurrentDate;

    this.savingsDepoSpclPeriod = this.sys.DdsPeriod;
    this.suggestedCustomer = null;
    this.suggestedCustomerSignatories = null;
    this.suggestedCustomerJointHolder = null;

    this.getCustomerList();
    this.getCategoryList();

    this.isLoading = true;

    this.initializeMasterDataAndFlags();
    this.initializeModels();

    debugger;
    this.getAccountTypeList();
    this.getConstitutionList();
    this.getOperationalInstr();

    // console.log(this.constitutionDtParser('YEAR=1;Month=10;Days=25;'));
  }

  private convertDate(datestring: string): Date {
    var parts = datestring.match(/(\d+)/g);
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
  }


  initializeMasterDataAndFlags()
  {
    this.getAccountTypeList();
    this.getConstitutionList();
    this.getOperationalInstr();

    this.selectedConstitutionList = [];
    this.transferTypeListTemp = [];
    this.transferTypeListTemp = this.transferTypeList;

    // this.isLoading = false;
    // this.disableCustNameFlg = true;
    this.disableAll = true;
    this.disableCustomerName = true;
    this.disableAccountTypeAndNo = true;

    this.operationType = '';

    this.showAlert = false;
    this.alertMsg = '';
    this.alertMsgType = '';

    this.denominationGrandTotal = 0;
    this.masterModel = new AccOpenDM();

    debugger;

  }



  initializeModels()
  {
    debugger;
    this.tm_deposit = new tm_deposit();
    // this.tm_deposit.opening_dt = this.openDate  ; // this.DateFormatting(this.openDate);
    this.tm_deposit.opening_dt = this.sys.CurrentDate;

    this.tm_deposit.acc_num = null;
    this.tm_deposit.cheque_facility_flag = 'N';
    this.tm_deposit.tds_applicable = 'N';
    this.tm_deposit.standing_instr_flag = 'N';

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

    const deno: tm_denomination_trans[] = [];
    this.tm_denominationList = deno;
    this.addDenomination();

    this.td_deftrans = new td_def_trans_trf();

    const td_deftranstrf: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftranstrf;
    var temp_deftranstrf = new td_def_trans_trf()
    this.td_deftranstrfList.push(temp_deftranstrf);

    const tm_trns: tm_transfer[] = [];
    this.tm_transferList = tm_trns;
    var temp_transfer = new tm_transfer();
    this.tm_transferList.push(temp_transfer);

    debugger;

    this.masterModel.tmdeposit = this.tm_deposit;
    this.masterModel.tdintroducer = this.td_introducerlist;
    this.masterModel.tdnominee = this.td_nomineeList;
    this.masterModel.tdsignatory = this.td_signatoryList;
    this.masterModel.tdaccholder = this.td_accholderList;
    this.masterModel.tmdenominationtrans = this.tm_denominationList;

    this.masterModel.tddeftrans = this.td_deftrans;
    this.masterModel.tddeftranstrf = this.td_deftranstrfList;
    this.masterModel.tmtransfer = this.tm_transferList;



    this.p_gen_param = new p_gen_param();
  }


  assignModelsFromMasterData()
  {

    var retDepositPeriodArr = [];

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

    const deno: tm_denomination_trans[] = [];
    this.tm_denominationList = deno;
    this.addDenomination();

    this.td_deftrans = new td_def_trans_trf();

    const td_deftrans: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftrans;


    const tm_trns: tm_transfer[] = [];
    this.tm_transferList = tm_trns;


    this.tm_deposit = this.masterModel.tmdeposit ;

    this.td_signatoryList = this.masterModel.tdsignatory;
    this.setCustDtls(this.tm_deposit.cust_cd);
    this.setAccountType(this.tm_deposit.acc_type_cd);
    this.setIntTfrType(this.tm_deposit.intt_trf_type);
    this.setConstitutionType(this.tm_deposit.constitution_cd);
    this.setOperationalInstr(this.tm_deposit.oprn_instr_cd);

    this.td_introducerlist = this.masterModel.tdintroducer;

    if ( this.tm_deposit.dep_period != undefined && this.tm_deposit.dep_period != null)
    {
    retDepositPeriodArr =  this.depositPeriodParser(this.tm_deposit.dep_period);
    this.tm_deposit.year = Number(retDepositPeriodArr[0]);
    this.tm_deposit.month = Number(retDepositPeriodArr[1]);
    this.tm_deposit.day = Number(retDepositPeriodArr[2]);
    }

    // tslint:disable-next-line: forin
    for (var idx in this.td_introducerlist) {
      this.setIntroducerAccountType(this.td_introducerlist[idx].introducer_acc_type, Number(idx));
    }

    debugger;
    this.td_nomineeList = this.masterModel.tdnominee;
    this.td_signatoryList = this.masterModel.tdsignatory;

    this.td_accholderList = this.masterModel.tdaccholder;
    // tslint:disable-next-line: forin
    for (var idx in this.td_accholderList) {
      this.setRelationship( this.td_accholderList[idx].relation, Number(idx));
      }

    this.tm_denominationList = this.masterModel.tmdenominationtrans;
    if ( this.tm_denominationList === undefined || this.tm_denominationList === null || this.tm_denominationList.length === 0)
    {
      null;
    }
    else
    {
      for (var idx in this.tm_denominationList)
      {
        this.setDenomination(this.tm_denominationList[idx].rupees, Number(idx));
      }

    }

    this.td_deftrans = this.masterModel.tddeftrans;
    this.setTransType(this.td_deftrans.trf_type);

    this.td_deftranstrfList = this.masterModel.tddeftranstrf;

    this.tm_transferList = this.masterModel.tmtransfer;
  }


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

  getConstitutionList() {

    if(this.constitutionList.length > 0)
    {
      return;
    }

    this.constitutionList = [];
    this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
      res => {
        // debugger;
        this.constitutionList = res;
      },
      err => { // debugger;
      }
    );
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
        this.accountTypeList = this.accountTypeList.filter(c => c.dep_loan_flag === 'D');
        this.accountTypeList = this.accountTypeList.sort((a, b) => (a.acc_type_cd > b.acc_type_cd) ? 1 : -1);
      },
      err => {
        debugger;
      }
    );
  }

  getOperationalInstr() {

    if (this.operationalInstrList.length > 0)
    {
      return;
    }

    this.operationalInstrList = [];
    this.svc.addUpdDel<any>('Mst/GetOprationalInstr', null).subscribe(
      res => {
        // debugger;
        this.operationalInstrList = res;
        this.operationalInstrList = this.operationalInstrList.sort((a, b) => (a.oprn_cd > b.oprn_cd) ? 1 : -1);
      },
      err => {
        // debugger;
      }
    );
  }


  clearData()
  {
    this.operationType = '';
    this.initializeMasterDataAndFlags();
    this.initializeModels();
  }

  retrieveData()
  {
    debugger;
    this.clearData();

    this.operationType = '';

    this.isLoading = true;
    this.getCustomerList();

    this.disableAll = true;
    this.disableCustomerName = true;
    this.disableAccountTypeAndNo = false;
    this.tm_deposit.brn_cd = this.branchCode;
  }

  getAccountOpeningTempData()
  {
    if (this.tm_deposit.acc_type_cd === null || this.tm_deposit.acc_type_cd === undefined) {
      this.showAlertMsg('WARNING' , 'Please select Account Type');
      this.tm_deposit.acc_num = null;
      exit(0);
    }

    debugger;
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetAccountOpeningTempData', this.tm_deposit).subscribe(
      res => {
        debugger;
        this.isLoading = false;
        this.masterModel = res;

        if (this.masterModel === undefined || this.masterModel === null) {
          this.showAlertMsg('WARNING', 'No record found!!');
        }
        else {
          if (this.masterModel.tmdeposit.acc_num !== null) {
            this.disableAccountTypeAndNo = true;
            this.assignModelsFromMasterData();
            this.operationType = 'Q';
            debugger;
          }
          else {
            this.showAlertMsg('WARNING', 'No record found!!!');
          }

        }


      },
      err => { this.isLoading = false;
        this.showAlertMsg('ERROR' , 'Unable to find record!!' );
        debugger;}

    );
  }


  modifyData() {
    debugger;
    if ( this.operationType !== 'Q' )
    {
      this.showAlertMsg('WARNING' , 'Record not retrived to modify');
      return;
    }
    this.operationType = 'U';
    this.disableAll = false;
  }

  newAccount() {    // document.getElementById('account_type').id = '';

    this.clearData();

    this.operationType = 'I';
    this.disableAll = true;
    this.isLoading = true;
    debugger;
    this.getCustomerList();
    // this.disableCustNameFlg = false;
    this.disableCustomerName = false;
    this.disableAll = false;
    this.disableAccountTypeAndNo = false;


  }

saveData()
  {
    debugger;

    if ( this.operationType !== 'I'  && this.operationType !== 'U')
    {
      this.showAlertMsg('WARNING' , 'Record not Created or Updated to Save');
      return;
    }

    this.validateData();

    if (this.tm_deposit.acc_num === null || this.operationType === 'I') {
      this.tm_deposit.acc_status = 'O';
      this.tm_deposit.created_by = this.createUser;
      this.tm_deposit.created_dt = this.createDate;
      this.tm_deposit.modified_by = this.updateUser;
      this.tm_deposit.modified_dt = this.updateDate;

      this.getNewAccountNoAndSaveData();
    }
    else
    {
      this.tm_deposit.modified_by = this.updateUser;
      this.tm_deposit.modified_dt = this.updateDate;
      this.InsertAccountOpenData();
    }

    this.disableAll = true;
    this.disableAccountTypeAndNo = false;
  }

  validateData()
  {
   debugger;
    let nomPercent = 0;

    if (this.tm_deposit.year === null || this.tm_deposit.year === undefined )
    { this.tm_deposit.year = 0; }

    if (this.tm_deposit.month === null || this.tm_deposit.month === undefined )
    { this.tm_deposit.month = 0; }

    if (this.tm_deposit.day === null || this.tm_deposit.day === undefined )
    { this.tm_deposit.day = 0; }

    if (this.tm_deposit.year === 0 && this.tm_deposit.month === 0 && this.tm_deposit.day === 0)
    { this.tm_deposit.dep_period = null; }
    else {
      this.tm_deposit.dep_period = 'Year=' + this.tm_deposit.year + ';Month=' + this.tm_deposit.month + ';Day=' + this.tm_deposit.day;
    }

    if (this.tm_deposit.cust_cd === null || this.tm_deposit.cust_cd === undefined)
    {
      this.showAlertMsg('WARNING' , 'Customer Information is Blank');
        exit(0);
    }

    if (this.tm_deposit.acc_type_cd === null || this.tm_deposit.acc_type_cd === undefined)
    {
      this.showAlertMsg('WARNING' , 'Account Type can not be blank');
        exit(0);
    }

    if (this.tm_deposit.constitution_cd === null || this.tm_deposit.constitution_cd === undefined)
    {
      this.showAlertMsg('WARNING' , 'Constitution can not be blank');
        exit(0);
    }

    if (this.tm_deposit.oprn_instr_cd === null || this.tm_deposit.oprn_instr_cd === undefined)
    {
      this.showAlertMsg('WARNING' , 'Operational Instruction can not be blank');
        exit(0);
    }


    // tslint:disable-next-line: forin
    for (let l in this.td_signatoryList) {
      if (this.td_signatoryList[l].signatory_name === null || this.td_signatoryList[l].signatory_name === undefined) {
        this.showAlertMsg('WARNING' , 'Signatory Name is Blank');
        exit(0);
      }

      this.td_signatoryList[l].acc_num = this.tm_deposit.acc_num;
      this.td_signatoryList[l].brn_cd = this.branchCode;
      this.td_signatoryList[l].acc_type_cd = Number(this.tm_deposit.acc_type_cd);
      this.td_signatoryList[l].upd_ins_flag = this.operationType;
    }

    // debugger;
    // tslint:disable-next-line: forin
    for (let l in this.td_accholderList)
    {
      if (this.td_accholderList[l].acc_holder === null || this.td_accholderList[l].acc_holder === undefined)
      {
        this.td_accholderList = this.td_accholderList.splice(Number(l), 1);
      }
      else {
        if (this.td_accholderList[l].relation === null || this.td_accholderList[l].relation === undefined) {
          this.showAlertMsg('WARNING' , 'Joint Holder Relation is Blank');
          exit(0);
        }
        this.td_accholderList[l].acc_type_cd = this.tm_deposit.acc_type_cd;
        this.td_accholderList[l].acc_num = this.tm_deposit.acc_num;
        this.td_accholderList[l].brn_cd = this.branchCode;
        this.td_accholderList[l].upd_ins_flag = this.operationType;
      }
    }

    if ( ( this.td_deftrans.trf_type === null || this.td_deftrans.trf_type === undefined) &&  this.operationType === 'I')
    {
      this.showAlertMsg('WARNING' , 'Please supply required value in transaction details');
      exit(0);
    }


    if (this.td_deftrans.trf_type === 'C')
    {
      if (this.denominationGrandTotal !== this.tm_deposit.prn_amt)
      {
        this.showAlertMsg('WARNING' , 'Principal Amount and Total Denomination Amount not matching!!');
        exit(0);
      }
    }

    // Populating data for TD_DEP_TRANS ================================================================
    this.td_deftrans.brn_cd = this.branchCode;
    this.td_deftrans.trans_dt = this.sys.CurrentDate;
    this.td_deftrans.acc_type_cd = this.tm_deposit.acc_type_cd;
    this.td_deftrans.acc_num = this.masterModel.tmdeposit.acc_num;
    this.td_deftrans.trans_type = 'D';
    this.td_deftrans.trans_mode = 'O';
    this.td_deftrans.amount = this.tm_deposit.prn_amt;
    this.td_deftrans.approval_status = 'U';
    this.td_deftrans.acc_cd = this.tm_deposit.acc_cd;

    if (this.td_deftrans.trf_type === 'T') {
      this.td_deftrans.particulars = 'BY TRANSFER';
      this.td_deftrans.tr_acc_cd = this.suspanceAccCd;
    }
    else
    {
      this.td_deftrans.particulars = 'BY CASH'
      this.td_deftrans.tr_acc_cd = this.cashAccCd;
    }
    this.td_deftrans.upd_ins_flag = this.operationType;
    if (this.operationType === 'I')
    {
      this.td_deftrans.created_by = this.createUser;
      this.td_deftrans.created_dt = this.createDate;
      this.td_deftrans.modified_by = this.updateUser;
      this.td_deftrans.modified_dt = this.updateDate;
    }
    else
    {
      this.td_deftrans.modified_by = this.updateUser;
      this.td_deftrans.modified_dt = this.updateDate;
    }

    debugger;
    // Populating data for TD_DEP_TRANS_TRF =============================================================
    if (this.td_deftrans.trf_type === 'T') {
      this.td_deftranstrfList[0].brn_cd = this.branchCode;
      this.td_deftranstrfList[0].trans_dt = this.sys.CurrentDate;

      if (this.td_deftranstrfList[0].cust_acc_type === undefined || this.td_deftranstrfList[0].cust_acc_type === null || this.td_deftranstrfList[0].cust_acc_type === "") {
        this.td_deftranstrfList[0].acc_type_cd = parseInt(this.td_deftranstrfList[0].gl_acc_code);
        this.td_deftranstrfList[0].acc_num = '0000';
        this.td_deftranstrfList[0].remarks = 'D';
      }
      else {
        this.td_deftranstrfList[0].acc_type_cd = parseInt(this.td_deftranstrfList[0].cust_acc_type);
        this.td_deftranstrfList[0].acc_num = this.td_deftranstrfList[0].cust_acc_number;
        this.td_deftranstrfList[0].remarks = 'X';
      }
      this.td_deftranstrfList[0].trans_type = 'W';
      this.td_deftranstrfList[0].trans_mode = 'V';
      this.td_deftranstrfList[0].approval_status = 'U';
      this.td_deftranstrfList[0].particulars = 'BY TRANSFER TO ' + this.tm_deposit.acc_type_desc + ': ' + this.tm_deposit.acc_num;
      this.td_deftranstrfList[0].tr_acc_cd = 10000;
      this.td_deftranstrfList[0].acc_cd = this.tm_deposit.acc_cd;
      this.td_deftranstrfList[0].trf_type = 'T';
      this.td_deftranstrfList[0].disb_id = 1;

      if (this.operationType === 'I') {
        this.td_deftranstrfList[0].created_by = this.createUser;
        this.td_deftranstrfList[0].created_dt = this.createDate;
        this.td_deftranstrfList[0].modified_by = this.updateUser;
        this.td_deftranstrfList[0].modified_dt = this.updateDate;
      }
      else {
        this.td_deftranstrfList[0].modified_by = this.updateUser;
        this.td_deftranstrfList[0].modified_dt = this.updateDate;
      }


      // Populating data for TM_TRANSFER =============================================================
      this.tm_transferList[0].brn_cd = this.branchCode;
      this.tm_transferList[0].trf_dt = this.sys.CurrentDate;
      this.tm_transferList[0].approval_status = 'U';
      if (this.operationType === 'I') {
        this.tm_transferList[0].created_by = this.createUser;
        this.tm_transferList[0].created_dt = this.createDate;
      }
    }
    else {
      this.td_deftranstrfList = this.td_deftranstrfList.splice(0, 1);
      this.tm_transferList = this.tm_transferList.splice(0, 1);
  }


    // For Nominee ====================================================================================
    debugger;
    for (let l in this.td_nomineeList)
    {
      if (this.td_nomineeList[l].nom_name === null || this.td_nomineeList[l].nom_name === undefined) {
        this.td_nomineeList = this.td_nomineeList.splice(Number(l), 1);
      }
      else {
        if (this.td_nomineeList[l].percentage === null || this.td_nomineeList[l].percentage === 0 || this.td_nomineeList[l].percentage === undefined)
        { this.showAlertMsg('WARNING' , 'Nominee Percentage is blank');
          exit(0); }
        this.td_nomineeList[l].acc_num = this.masterModel.tmdeposit.acc_num;
        this.td_nomineeList[l].acc_type_cd = this.tm_deposit.acc_type_cd;
        this.td_nomineeList[l].brn_cd = this.branchCode;
        this.td_nomineeList[l].upd_ins_flag = this.operationType;

        nomPercent = nomPercent + Number(this.td_nomineeList[l].percentage);
      }
    }

    if (nomPercent > 0 && nomPercent < 100)
    {
      this.showAlertMsg('WARNING' , 'Nominee Total Percentage < 100');
      exit(0);
    }

    debugger;


    if ((this.operationType === 'I') && ( this.tm_deposit.user_acc_num === undefined || this.tm_deposit.user_acc_num === null) &&
    ( this.tm_deposit.acc_type_cd ===  2 || this.tm_deposit.acc_type_cd ===  3 ||
      this.tm_deposit.acc_type_cd ===  4 || this.tm_deposit.acc_type_cd ===  5
      || this.tm_deposit.acc_type_cd ===  6  ) )
    {
      this.showAlertMsg('WARNING' , 'S/B Account Number not present to create the Account Type- '+ this.tm_deposit.acc_type_desc);
      exit(0);
    }

    if ((this.operationType === 'I') && ( this.tm_deposit.acc_type_cd === 1 || this.tm_deposit.acc_type_cd === 7 ||
      this.tm_deposit.acc_type_cd === 8 || this.tm_deposit.acc_type_cd === 9 ) )
      {
        debugger;
        this.tm_deposit.user_acc_num = null;
      }


    debugger;
    for (let l in this.tm_denominationList) {
      debugger;
      if (this.tm_denominationList[l].rupees === null || this.tm_denominationList[l].rupees === undefined ) {
        this.tm_denominationList = this.tm_denominationList.splice(Number(l), 1);
      }
      else {
        this.tm_denominationList[l].brn_cd = this.branchCode;
        this.tm_denominationList[l].trans_dt = this.sys.CurrentDate;
      }
    }
    debugger;


    // tslint:disable-next-line: forin
    var v = 0;
    for (let l in this.td_introducerlist) {
      if (this.td_introducerlist[l].introducer_acc_num === null || this.td_introducerlist[l].introducer_acc_num === undefined) {
        // Removing the blank element
        this.td_introducerlist = this.td_introducerlist.splice(Number(l), 1);
      }
      else {
        v = v + 1;
        this.td_introducerlist[l].srl_no = v;
        this.td_introducerlist[l].acc_type_cd = this.tm_deposit.acc_type_cd;
        this.td_introducerlist[l].acc_num = this.tm_deposit.acc_num;
        this.td_introducerlist[l].brn_cd = this.branchCode;

      }
    }


      // if (this.operationType === 'I')
      // {
      //   for (let l in this.tm_denominationList)
      //   {
      //   this.tm_denominationList[l].brn_cd = this.branchCode;
      //   this.tm_denominationList[l].trans_dt = this.sys.CurrentDate;
      //   }

      //   var v= 0;
      //   for (let l in this.td_introducerlist) {
      //     v = v + 1;
      //     this.td_introducerlist[l].srl_no = v;
      //     this.td_introducerlist[l].acc_type_cd = this.tm_deposit.acc_type_cd;
      //     this.td_introducerlist[l].acc_num = this.tm_deposit.acc_num;
      //     this.td_introducerlist[l].brn_cd = this.branchCode;
      //   }

      // }

  }

  getNewAccountNoAndSaveData() {
    debugger;
    this.isLoading = true;

    this.p_gen_param.brn_cd = this.branchCode; // String
    this.p_gen_param.gs_acc_type_cd = this.masterModel.tmdeposit.acc_type_cd; // Integer
    this.p_gen_param.ls_catg_cd = this.masterModel.tmdeposit.category_cd; // Integer
    this.p_gen_param.ls_cons_cd = this.masterModel.tmdeposit.constitution_cd; // Integer

    this.svc.addUpdDel<any>('Deposit/PopulateAccountNumber', this.p_gen_param).subscribe(
      res => {
        debugger;
        let val = '0';
        this.isLoading = false;
        val = res;
        this.masterModel.tmdeposit.acc_num = val.toString();
        this.masterModel.tmdeposit.brn_cd = this.branchCode;

        debugger;
        this.InsertAccountOpenData();
      },
      err => { this.isLoading = false;
        debugger;}

    );

  }


  InsertAccountOpenData() {
    let ret = -1;
    debugger;

    this.validateData();

    debugger;

    this.isLoading = true;
    if (this.operationType === 'I') // For New Account
    {
      this.svc.addUpdDel<any>('Deposit/InsertAccountOpeningData', this.masterModel).subscribe(
        res => {
          debugger;
          this.td_deftrans.trans_cd = Number(res);
          this.isLoading = false;
          this.disableAccountTypeAndNo = true;
          this.showAlertMsg('INFORMATION' , 'Record Saved Successfully');
        },
        err => {
          debugger;
          this.isLoading = false;
          this.showAlertMsg('ERROR' , 'Record Not Saved !!!');
          if (this.operationType === 'I') {
            this.masterModel.tmdeposit.acc_num = null;
          }
          debugger;
        }
      );
    }
    else // Modify the Account opening Data
    {
      debugger;
      this.svc.addUpdDel<any>('Deposit/UpdateAccountOpeningData', this.masterModel).subscribe(
        res => {
          debugger;
          ret = Number(res);
          this.isLoading = false;

          if ( ret === 0)
          {
            this.showAlertMsg('INFORMATION' , 'Record Set Updated Successfully');
          }
          else
          {
            this.showAlertMsg('ERROR' , 'Unable to Save Record Set');
          }

        },
        err => {
          this.isLoading = false;
          this.showAlertMsg('ERROR' , 'Unable to Update Data');
          debugger;
        }
      );
    }
  }


  public DateFormatting(dateVal: Date): any {
    let dt: Date;
    dt = new Date(Date.UTC(dateVal.getFullYear(), dateVal.getMonth(), dateVal.getDate(), dateVal.getHours(), dateVal.getMinutes()));
    return dt;
  }

  public showAlertMsg(msgTyp: string , msg: string) {
    this.alertMsgType = msgTyp;
    this.alertMsg     = msg;
    this.showAlert = true;
    this.disableAll = true;
    this.disableAccountTypeAndNo = true;
  }

  public closeAlertMsg() {
    this.showAlert = false;
    this.disableAll = false;
    this.disableAccountTypeAndNo = false;
  }


  setAccountType(accType: number) {
    debugger;
    if (accType === 0) {
      accType = 1;
    }

    if (this.operationType === 'I')
    {
       this.setTmDepositModel();
    }

    this.accountTypeDiv = Number(accType);

    this.tm_deposit.acc_type_cd = Number(accType);
    this.tm_deposit.acc_type_desc = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0].acc_type_desc;

    // this.selectedConstitutionList = null;
    this.selectedConstitutionList = this.constitutionList.filter(x => x.acc_type_cd.toString() === accType.toString());
    debugger;

    if (this.operationType === 'I' && this.tm_deposit.acc_type_cd === 11 )
    {
      this.tm_deposit.month = this.savingsDepoSpclPeriod;
      // this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;
      this.tm_deposit.mat_dt = this.sys.CurrentDate;


      this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
    }

    if (this.operationType === 'I' &&
        (this.tm_deposit.acc_type_cd === 2  ||
          this.tm_deposit.acc_type_cd === 3 ||
          this.tm_deposit.acc_type_cd === 4 ||
          this.tm_deposit.acc_type_cd === 5 ||
          this.tm_deposit.acc_type_cd === 6))
          {
            this.tm_deposit.standing_instr_flag = this.standingInstrAfterMaturity[0].instr_code;
            this.tm_deposit.standing_instr_dscr = this.standingInstrAfterMaturity[0].instr_dscr;
          }

    if (this.operationType === 'I' && this.tm_deposit.acc_type_cd === 5) {
      this.tm_deposit.intt_trf_type = this.intTransferType[0].tfr_type;
      this.tm_deposit.intt_tfr_type_dscr = this.intTransferType[0].tfr_desc;
    }

  }


  setTmDepositModel()
  {

    this.tm_deposit.acc_type_cd = undefined;
    this.tm_deposit.acc_num = undefined;
    this.tm_deposit.renew_id = undefined;
    this.tm_deposit.intt_trf_type = undefined;
    this.tm_deposit.constitution_cd = undefined;
    this.tm_deposit.oprn_instr_cd = undefined;
    this.tm_deposit.prn_amt = undefined;
    this.tm_deposit.intt_amt = undefined;
    this.tm_deposit.dep_period = undefined;
    this.tm_deposit.instl_amt = undefined;
    this.tm_deposit.instl_no = undefined;
    this.tm_deposit.mat_dt = undefined;
    this.tm_deposit.intt_rt = undefined;
    this.tm_deposit.tds_applicable = undefined;
    this.tm_deposit.last_intt_calc_dt = undefined;
    this.tm_deposit.acc_close_dt = undefined;
    this.tm_deposit.closing_prn_amt = undefined;
    this.tm_deposit.closing_intt_amt = undefined;
    this.tm_deposit.penal_amt = undefined;
    this.tm_deposit.ext_instl_tot = undefined;
    this.tm_deposit.mat_status = undefined;
    this.tm_deposit.acc_status = undefined;
    this.tm_deposit.curr_bal = undefined;
    this.tm_deposit.clr_bal = undefined;
    this.tm_deposit.standing_instr_flag = undefined;
    this.tm_deposit.cheque_facility_flag = undefined;
    this.tm_deposit.approval_status = undefined;
    this.tm_deposit.approved_by = undefined;
    this.tm_deposit.approved_dt = undefined;
    // this.tm_deposit.user_acc_num = undefined;
    this.tm_deposit.lock_mode = undefined;
    this.tm_deposit.loan_id = undefined;
    this.tm_deposit.cert_no = undefined;
    this.tm_deposit.bonus_amt = undefined;
    this.tm_deposit.penal_intt_rt = undefined;
    this.tm_deposit.bonus_intt_rt = undefined;
    this.tm_deposit.transfer_flag = undefined;
    this.tm_deposit.transfer_dt = undefined;
    this.tm_deposit.agent_cd = undefined;
    this.tm_deposit.created_by = undefined;
    this.tm_deposit.created_dt = undefined;
    this.tm_deposit.modified_by = undefined;
    this.tm_deposit.modified_dt = undefined;
    this.tm_deposit.acc_type_desc = undefined;
    this.tm_deposit.constitution_desc  = undefined;
    this.tm_deposit.oprn_instr_desc  = undefined;
    this.tm_deposit.intt_tfr_type_dscr = undefined;
    this.tm_deposit.standing_instr_dscr = undefined;
    this.tm_deposit.year = undefined;
    this.tm_deposit.month = undefined;
    this.tm_deposit.day = undefined;
    this.tm_deposit.mat_val = undefined;

    // this.tm_deposit.constitution_cd = null;
    // this.tm_deposit.constitution_desc = null;
    // this.tm_deposit.oprn_instr_cd = null;
    // this.tm_deposit.oprn_instr_desc = null;


  }

  setTransType(tt: any)
  {
    // this.transTypeFlg = val;
    debugger;
    if (this.td_deftrans.trf_type === 'T') {
      // const deno: tm_denomination_trans[] = [];
      // this.tm_denominationList = deno;
      for (let l in this.tm_denominationList)
      {
        this.tm_denominationList = this.tm_denominationList.splice(Number(l), 1);
      }
      this.denominationGrandTotal = 0;
    }

    this.td_deftrans.trf_type = tt;
    this.td_deftrans.trf_type_desc = this.transferTypeList.filter(x => x.trf_type.toString() === tt)[0].trf_type_desc;

  }


  setRelationship(relation: string, idx: number) {
    debugger;
    this.td_accholderList[idx].cust_cd = Number(this.td_accholderList[idx].cust_cd);
    this.td_accholderList[idx].relation = relation;
    this.td_accholderList[idx].relationId = this.relationship.filter(x => x.val.toString() === relation)[0].id;
    debugger;
  }

  setIntTfrType(tfr_type: string) {
    debugger;

    if (tfr_type == null) {
    return;
    }

    this.tm_deposit.intt_trf_type = tfr_type;
    this.tm_deposit.intt_tfr_type_dscr = this.intTransferType.filter(x => x.tfr_type.toString() === tfr_type.toString())[0].tfr_desc;
  }

  setConstitutionType(val: number) {
    debugger;
    this.tm_deposit.constitution_cd = Number(val);
    this.tm_deposit.constitution_desc = this.constitutionList.filter(x => x.constitution_cd.toString() === val.toString())[0].constitution_desc;
    this.tm_deposit.acc_cd = this.constitutionList.filter(x => x.constitution_cd.toString() === val.toString())[0].acc_cd;
  }

  setOperationalInstr(val: number) {
    this.tm_deposit.oprn_instr_cd = Number(val);
    this.tm_deposit.oprn_instr_desc = this.operationalInstrList.filter(x => x.oprn_cd.toString() === val.toString())[0].oprn_desc;
  }


  getCategoryList() {
    this.svc.addUpdDel<any>('Mst/GetCategoryMaster', null).subscribe(
      res => {
        // debugger;
        this.categoryList = res;
      },
      err => {
        // debugger;
      }
    );
  }


  public suggestCustomer(): void {
  this.suggestedCustomer = this.customerList
      .filter(c => c.cust_name.toLowerCase().startsWith(this.tm_deposit.cust_name.toLowerCase())
        || c.cust_cd.toString().startsWith(this.tm_deposit.cust_name)
        || ( c.phone !== null && c.phone.startsWith(this.tm_deposit.cust_name)))
      .slice(0, 20);
  }

  public suggestCustomerSignatories(idx: number): void {
    debugger;
    this.suggestedCustomerSignatoriesIdx = idx;
    this.suggestedCustomerSignatories = this.customerList
        .filter(c => c.cust_name.toLowerCase().startsWith(this.td_signatoryList[idx].signatory_name.toLowerCase())
          || c.cust_cd.toString().startsWith(this.td_signatoryList[idx].signatory_name)
          || ( c.phone !== null && c.phone.startsWith(this.td_signatoryList[idx].signatory_name)))
        .slice(0, 10);
    }

    public suggestCustomerJointHolder(): void {

      }

  public setCustDtlsSignatories(cust_cd: number, idx: number): void {
    this.td_signatoryList[idx].signatory_name = this.customerList.filter(c => c.cust_cd.toString() === cust_cd.toString())[0].cust_name;
    this.suggestedCustomerSignatories = null;
  }

  public setCustDtlsJointHolder(cust_cd: number): void {
    this.tm_deposit.cust_cd = cust_cd;
    this.populateCustDtls(cust_cd);
    this.suggestedCustomerJointHolder = null;
  }

  public setCustDtls(cust_cd: number): void {
    this.tm_deposit.cust_cd = cust_cd;
    this.populateCustDtls(cust_cd);
    this.suggestedCustomer = null;
  }

  populateCustDtls(cust_cd: number) {
    debugger;
    var temp_mm_cust = new mm_customer();
    var temp_tm_deposit = new tm_deposit();

    temp_tm_deposit.cust_cd = cust_cd;

    temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];

    this.tm_deposit.cust_name = temp_mm_cust.cust_name;
    if (temp_mm_cust.cust_type === 'M')
    {
    this.tm_deposit.cust_type = "Member";
    }
    else
    {
      this.tm_deposit.cust_type = "Non-Member";
    }
    this.tm_deposit.gurdain_name = temp_mm_cust.guardian_name;

    // this.tm_deposit.date_of_birth = temp_mm_cust.dt_of_birth;
    this.tm_deposit.date_of_birth = new Date(temp_mm_cust.dt_of_birth);

    this.tm_deposit.sex = temp_mm_cust.sex;
    this.tm_deposit.phone = temp_mm_cust.phone;

    this.tm_deposit.occupation = temp_mm_cust.occupation;
    this.tm_deposit.email = temp_mm_cust.email;
    this.tm_deposit.present_addr = temp_mm_cust.present_address;

    this.tm_deposit.category_cd = temp_mm_cust.catg_cd;
    this.setCategoryDesc(this.tm_deposit.category_cd);

    if (this.operationType === 'I') {
      this.td_signatoryList[0].cust_cd = cust_cd;
      this.td_signatoryList[0].signatory_name = temp_mm_cust.cust_name;
      this.td_signatoryList[0].brn_cd = this.branchCode;
    }

    debugger;

    if (this.operationType === 'I') {
      this.isLoading = true;
      this.svc.addUpdDel<any>('Deposit/GetCustMinSavingsAccNo', temp_tm_deposit).subscribe(
        res => {
          debugger;
          this.isLoading = false;
          var x = res;
          this.tm_deposit.user_acc_num = x.toString();
          // this.tm_deposit.user_acc_num = this.tm_deposit.user_acc_num.toString();
        },
        err => {
          debugger;
          this.isLoading = false;
          this.tm_deposit.user_acc_num = null;
        }
      );
    }

  }

setCategoryDesc(category: number) {
    this.tm_deposit.category_desc = this.categoryList.filter(x => x.catg_cd.toString() === category.toString())[0].catg_desc;
  }

addSignatory()
  {
    var temp_td_signatory = new td_signatory();
    this.td_signatoryList.push(temp_td_signatory);
  }

removeSignatory()
{
    if (this.td_signatoryList.length > 1)
    this.td_signatoryList.pop();
  }

  addJointHolder() {
    var temp_td_accholder = new td_accholder();
    this.td_accholderList.push(temp_td_accholder);
  }

  removeJointHolder() {
    if (this.td_accholderList.length > 1)
      this.td_accholderList.pop();
  }

  checkSignatory(name: string, idx: number)
  {
    var x = this.td_accholderList.filter(c => c.acc_holder.toString() === name.toString())[0].cust_cd;

    debugger;
    if (!x)
    {
      this.td_signatoryList[idx].signatory_name = null;
      this.showAlertMsg('ERROR' , 'Signatory is not a Joint Holder');
    }
  }

  getSetJointHolderName(idx: number) {
    var temp_mm_cust = new mm_customer();
    temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === this.td_accholderList[idx].cust_cd.toString())[0];

    if (!temp_mm_cust) {
      this.td_accholderList[idx].cust_cd = null;
      this.td_accholderList[idx].acc_holder = null;
      this.showAlertMsg('ERROR' , 'Joint Holder Customer Not Found');
      return;
    }

    if ( temp_mm_cust.cust_cd ===  this.tm_deposit.cust_cd)
    {
      this.td_accholderList[idx].cust_cd = null;
      this.td_accholderList[idx].acc_holder = null;
      this.showAlertMsg('ERROR' , 'First Holder and Joint Holder can not be same');
      return;
    }


    this.td_accholderList[idx].cust_cd = Number(this.td_accholderList[idx].cust_cd);
    this.td_accholderList[idx].acc_holder = temp_mm_cust.cust_name;

    // this.addSignatory();
    // let l = this.td_signatoryList.length;

    // this.td_signatoryList[l - 1].cust_cd = this.td_accholderList[idx].cust_cd;
    // this.td_signatoryList[l - 1].signatory_name = this.td_accholderList[idx].acc_holder;
  }


  addIntroducer() {
    let temp_td_introducer = new td_introducer();
    this.td_introducerlist.push(temp_td_introducer);
  }

  removeIntroducer() {
    if (this.td_introducerlist.length > 1){
      this.td_introducerlist.pop();}
  }

  setIntroducerAccountType(intro_acc_typ_cd: number, idx: number) {
    debugger;
    if (intro_acc_typ_cd != null && intro_acc_typ_cd > 0) {
      this.td_introducerlist[idx].introducer_acc_type = Number(intro_acc_typ_cd);
      this.td_introducerlist[idx].introducer_acc_type_desc = this.introducerAccTypeList.filter(x => x.introducer_acc_type_cd.toString() === intro_acc_typ_cd.toString())[0].introducer_acc_type_desc;
    }
  }


  setIntroducerName(idx: number) {
    debugger;

    if (this.td_introducerlist[idx].introducer_acc_type === null || this.td_introducerlist[idx].introducer_acc_type === undefined)
    {
      this.showAlertMsg('ERROR' , 'Introducer Account Type can not be blank');
      this.td_introducerlist[idx].introducer_acc_num = null;
      return;
    }

    var temp_deposit_list: tm_deposit[] = [];
    var temp_deposit = new tm_deposit();

    temp_deposit.brn_cd = this.branchCode;
    temp_deposit.acc_num = this.td_introducerlist[idx].introducer_acc_num;
    temp_deposit.acc_type_cd = this.td_introducerlist[idx].introducer_acc_type;

    this.isLoading = true;

    this.svc.addUpdDel<any>('Deposit/GetDeposit', temp_deposit).subscribe(
      res => {
        debugger;
        temp_deposit_list = res;
        this.isLoading = false;

        if (temp_deposit_list.length === 0) {
          this.td_introducerlist[idx].introducer_acc_num = null;
          this.td_introducerlist[idx].introducer_name = null;
          this.td_introducerlist[idx].acc_type_cd = null;
          this.showAlertMsg('ERROR' , 'Introducer Not Found');
          return;
        }

        var temp_mm_cust = new mm_customer();
        temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === temp_deposit_list[0].cust_cd.toString())[0];

        this.td_introducerlist[idx].introducer_name = temp_mm_cust.cust_name;
      },
      err => {
        this.isLoading = false;
      }
    );
  }


  addNominee()
  {
    var temp_td_nominee = new td_nominee();
    this.td_nomineeList.push(temp_td_nominee);
  }

  removeNominee() {
    if (this.td_nomineeList.length > 1)
      this.td_nomineeList.pop();
  }

  addDenomination()
  {
    var temp_denomination= new tm_denomination_trans();
    this.tm_denominationList.push(temp_denomination);
  }

  removeDenomination()
  {
    if (this.tm_denominationList.length > 1)
    this.tm_denominationList.pop();
  }

  setDenomination(val: number, idx: number)
  {
    debugger;
    this.tm_denominationList[idx].rupees = Number(val);
    this.tm_denominationList[idx].rupees_desc = this.denominations.filter( x => x.rupees === val.toString() )[0].desc;
    this.calculateTotalDenomination(idx);
  }


  calculateTotalDenomination(idx: number)
  {
    debugger;
    let r = 0;
    let c = 0;

    if (this.tm_denominationList[idx].rupees != null) {
      r = this.tm_denominationList[idx].rupees;
    }

    if (this.tm_denominationList[idx].count != null) {
      this.tm_denominationList[idx].count = Number(this.tm_denominationList[idx].count);
      c = this.tm_denominationList[idx].count;
    }

    this.tm_denominationList[idx].total = r * c;

    this.denominationGrandTotal = 0;
    for (let l of this.tm_denominationList) {
      this.denominationGrandTotal = this.denominationGrandTotal + l.total;
    }
  }



  checkNomineePercentage(idx: number) {
    debugger;
    let tot = 0;

    for (let l of this.td_nomineeList) {
      tot = tot + Number(l.percentage);
    }

    if (tot > 100) {
      this.showAlertMsg('ERROR' , 'Nominee Total Percentage exceeding 100');
      this.td_nomineeList[idx].percentage = 0;
    }

    this.td_nomineeList[idx].nom_id = Number(idx) + 1;
    this.td_nomineeList[idx].percentage = Number(this.td_nomineeList[idx].percentage);

  }


  checkAndSetDebitAccType(tfrType: string, accType: string) {
    debugger;
    if (tfrType === 'cust_acc') {
      if (this.td_deftranstrfList[0].cust_acc_type === undefined || this.td_deftranstrfList[0].cust_acc_type === null || this.td_deftranstrfList[0].cust_acc_type === "") {
        this.td_deftranstrfList[0].cust_name = null;
        this.td_deftranstrfList[0].clr_bal = null;
        this.td_deftranstrfList[0].cust_acc_desc = null;
        this.td_deftranstrfList[0].cust_acc_number = null;
        return;
      }

      if (this.td_deftranstrfList[0].gl_acc_code === undefined || this.td_deftranstrfList[0].gl_acc_code === null || this.td_deftranstrfList[0].gl_acc_code === "")
      {
        var temp_acc_type = new mm_acc_type();
        temp_acc_type = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0];

        if(temp_acc_type === undefined || temp_acc_type === null)
        {
          this.td_deftranstrfList[0].cust_acc_type = null;
          this.showAlertMsg('WARNING', 'Invalid Account Type');
          return;
        }
        else
        {
          this.td_deftranstrfList[0].cust_acc_desc = temp_acc_type.acc_type_desc;
        }
      }
      else
      {
        this.showAlertMsg('WARNING', 'GL Code in Transfer Details is not Blank');
        this.td_deftranstrfList[0].cust_acc_type = null;
        return;
      }
    }

    if (tfrType === 'gl_acc')
    {
      if (this.td_deftranstrfList[0].gl_acc_code === undefined || this.td_deftranstrfList[0].gl_acc_code === null || this.td_deftranstrfList[0].gl_acc_code === "")
      {
        this.td_deftranstrfList[0].gl_acc_desc = null;
        return;
      }

      if (this.td_deftranstrfList[0].cust_acc_type === undefined || this.td_deftranstrfList[0].cust_acc_type === null || this.td_deftranstrfList[0].cust_acc_type === "")
      {
        if (this.acc_master === undefined || this.acc_master === null || this.acc_master.length === 0)
        {
          this.isLoading = true;
          var temp_acc_master = new m_acc_master();
          this.svc.addUpdDel<any>('Mst/GetAccountMaster', null).subscribe(
            res => {
              debugger;
              this.acc_master = res;
              this.isLoading = false;
              temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === this.td_deftranstrfList[0].gl_acc_code)[0];
              if (temp_acc_master === undefined || temp_acc_master === null)
              {
              this.td_deftranstrfList[0].gl_acc_desc = null;
              this.showAlertMsg('WARNING', 'Invalid GL Code');
              return;
              }
            else
              {
              this.td_deftranstrfList[0].gl_acc_desc = temp_acc_master.acc_name;
             }
            },
            err => {
              debugger;
              this.isLoading = false;
            }
          )
        }
        else
        {
          var temp_acc_master = new m_acc_master();
          temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === this.td_deftranstrfList[0].gl_acc_code)[0];
          if (temp_acc_master === undefined || temp_acc_master === null)
          {
            this.td_deftranstrfList[0].gl_acc_desc = null;
            this.showAlertMsg('WARNING', 'Invalid GL Code');
            return;
          }
          else
          {
          this.td_deftranstrfList[0].gl_acc_desc = temp_acc_master.acc_name;
          }
        }
      }
      else
      {
        this.showAlertMsg('WARNING', 'Account Type in Transfer Details is not blank');
        this.td_deftranstrfList[0].gl_acc_code = null;
        return;
      }
    }
  }

  setDebitAccDtls(acc_num: string) {
    debugger;
    if (this.td_deftranstrfList[0].cust_acc_type === undefined || this.td_deftranstrfList[0].cust_acc_type === null || this.td_deftranstrfList[0].cust_acc_type === "") {
      this.showAlertMsg('WARNING', 'Account Type in Transfer Details can not be blank');
      this.td_deftranstrfList[0].cust_acc_number = null;
      return;
    }

    if (this.td_deftranstrfList[0].cust_acc_number === undefined || this.td_deftranstrfList[0].cust_acc_number === null || this.td_deftranstrfList[0].cust_acc_number === "")
    {
      this.td_deftranstrfList[0].cust_name = null;
      this.td_deftranstrfList[0].clr_bal =  null;
      return;
    }

    debugger;
    var temp_deposit_list: tm_deposit[] = [];
    var temp_deposit = new tm_deposit();

    temp_deposit.brn_cd = this.branchCode;
    temp_deposit.acc_num = this.td_deftranstrfList[0].cust_acc_number;
    temp_deposit.acc_type_cd = parseInt(this.td_deftranstrfList[0].cust_acc_type);

    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetDeposit', temp_deposit).subscribe(
      res => {
        debugger;
        temp_deposit_list = res;
        this.isLoading = false;

        if (temp_deposit_list.length === 0) {
          this.showAlertMsg('WARNING', 'Invalid Account Number in Transfer Details');
          this.td_deftranstrfList[0].cust_acc_number = null;
          return;
        }

        var temp_mm_cust = new mm_customer();
        temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === temp_deposit_list[0].cust_cd.toString())[0];
        this.td_deftranstrfList[0].cust_name = temp_mm_cust.cust_name;
        this.td_deftranstrfList[0].clr_bal =  temp_deposit_list[0].clr_bal;
        this.td_deftranstrfList[0].acc_cd = Number (this.constitutionList.filter(x => x.acc_type_cd.toString() === temp_deposit.acc_type_cd.toString()
                                                                         && x.constitution_cd.toString() === temp_deposit_list[0].constitution_cd.toString()));

      },
      err => {
        debugger;
        this.isLoading = false;
      }
    );
  }

  checkDebitBalance(amount: number)
  {
    debugger;

    if(this.td_deftranstrfList[0].amount === undefined || this.td_deftranstrfList[0].amount ===null)
    {
      return;
    }

    if ((this.td_deftranstrfList[0].cust_acc_number === undefined || this.td_deftranstrfList[0].cust_acc_number === null || this.td_deftranstrfList[0].cust_acc_number === "")
      && (this.td_deftranstrfList[0].gl_acc_code === undefined || this.td_deftranstrfList[0].gl_acc_code === null || this.td_deftranstrfList[0].gl_acc_code === ""))
      {
      this.showAlertMsg('WARNING', 'Please enter Account Number or GL Code');
      this.td_deftranstrfList[0].amount = null;
      return;
    }

    if( this.tm_deposit.prn_amt === undefined || this.tm_deposit.prn_amt === null)
    {
      this.showAlertMsg('WARNING', 'Principal Amount is blank');
      this.td_deftranstrfList[0].amount = null;
      return;
    }

      if (this.tm_deposit.prn_amt.toString() !== amount.toString()) {
        this.showAlertMsg('WARNING', 'Debit Amount is not matching with Principal Amount');
        this.td_deftranstrfList[0].amount = null;
        return;
      }


    if (this.td_deftranstrfList[0].clr_bal === undefined || this.td_deftranstrfList[0].clr_bal === null)
    {
      this.td_deftranstrfList[0].clr_bal = 0;
    }

    if (this.td_deftranstrfList[0].gl_acc_code === undefined || this.td_deftranstrfList[0].gl_acc_code === null || this.td_deftranstrfList[0].gl_acc_code === "") {
      if (parseInt(this.td_deftranstrfList[0].clr_bal.toString()) < parseInt(amount.toString())) {
        this.showAlertMsg('WARNING', 'Insufficient Balance');
        this.td_deftranstrfList[0].amount = null;
        return;
      }
  }

  }

  xxxxxxxx(val: any)
  {
    null;
  }

  setStandingInstrAfterMatu(val: number)
  {
     this.tm_deposit.standing_instr_flag = val.toString();
     this.tm_deposit.standing_instr_dscr = this.standingInstrAfterMaturity.filter( x => x.instr_code === val.toString())[0].instr_dscr;
  }

  private depositPeriodParser(constitutionText: string) {
    /// YEAR=1;Month=10;Days=25;
    if (constitutionText == null)
    {
      return null;
    }
    let arr = constitutionText.split(';');
    let arrToReturn = [];
    arr.forEach(element => {
      arrToReturn.push(element.split('=').pop());
    });

    return arrToReturn;
  }


processInstallmentNo() {
    debugger;
    var temp_gen_param1 = new p_gen_param();
    var temp_gen_param2 = new p_gen_param();


    if (this.tm_deposit.category_cd === undefined || this.tm_deposit.category_cd === null) {
      this.showAlertMsg('ERROR', 'Interest Rate Cannot Be Fixed!!!...Category Not Yet Mentioned.');
      return;
    }

    // const dt = this.tm_deposit.opening_dt;
    // this.tm_deposit.mat_dt = null;

    this.td_deftrans.amount = Number(this.tm_deposit.instl_amt);
    // this.tm_deposit.mat_dt = this.DateFormatting(this.openDate);
    this.tm_deposit.mat_dt = this.sys.CurrentDate;

    this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + Number(this.tm_deposit.instl_no));

    this.tm_deposit.prn_amt = Number(this.tm_deposit.instl_no) * Number(this.tm_deposit.instl_amt);

    temp_gen_param1.ad_instl_amt = Number(this.tm_deposit.instl_amt);
    temp_gen_param1.an_instl_no = Number(this.tm_deposit.instl_no);
    temp_gen_param1.an_intt_rate = Number(this.tm_deposit.intt_rt);

    temp_gen_param2.acc_cd = this.tm_deposit.acc_type_cd;
    // temp_gen_param2.from_dt = this.DateFormatting(this.openDate);
    temp_gen_param2.from_dt = this.sys.CurrentDate;

    temp_gen_param2.ls_catg_cd = this.tm_deposit.category_cd;
    debugger;

    if ( typeof(this.tm_deposit.opening_dt) === "string")
    {
      this.tm_deposit.opening_dt = Utils.convertStringToDt(this.tm_deposit.opening_dt);
    }

    if ( typeof(this.tm_deposit.mat_dt) === "string")
    {
      this.tm_deposit.mat_dt = Utils.convertStringToDt(this.tm_deposit.mat_dt);
    }


    // tslint:disable-next-line: max-line-length
    //temp_gen_param2.ai_period = Math.floor(Date.UTC(this.tm_deposit.mat_dt.getFullYear(), this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) - (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(), this.tm_deposit.opening_dt.getDate()) ) / (1000 * 60 * 60 * 24));
    temp_gen_param2.ai_period = Math.floor((Date.UTC(this.tm_deposit.mat_dt.getFullYear(), this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) - (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(), this.tm_deposit.opening_dt.getDate()))) / (1000 * 60 * 60 * 24));


    debugger;
    if (temp_gen_param1.an_intt_rate > 0) {
      this.calCrdIntReg(temp_gen_param1);
    }
    else {
      //                               uf_GetInttRate
      this.svc.addUpdDel<any>('Deposit/GET_INT_RATE', temp_gen_param2).subscribe(
        res => {
          debugger;
          this.tm_deposit.intt_rt = Number(res);
          temp_gen_param1.an_intt_rate = this.tm_deposit.intt_rt;
          this.calCrdIntReg(temp_gen_param1);
        },
        err => {
          debugger;
        }
      );
    }
  }


  processInstallmentAmount( )
  {
    debugger;
    var temp_gen_param = new p_gen_param();

    this.tm_deposit.prn_amt = Number(this.tm_deposit.instl_no) * Number(this.tm_deposit.instl_amt);

    temp_gen_param.ad_instl_amt = Number(this.tm_deposit.instl_amt);
    temp_gen_param.an_instl_no = Number(this.tm_deposit.instl_no);
    temp_gen_param.an_intt_rate = Number(this.tm_deposit.intt_rt);
    this.calCrdIntReg(temp_gen_param);
  }


  calCrdIntReg(tempGenParam: p_gen_param )
  {
    this.isLoading = true;
    debugger;
    this.svc.addUpdDel<any>('Deposit/F_CALCRDINTT_REG', tempGenParam).subscribe(
      res => {
        debugger;
        this.tm_deposit.intt_amt = res;
        this.tm_deposit.mat_val = Number(this.tm_deposit.intt_amt) + Number(this.tm_deposit.prn_amt);
        this.isLoading = false;
      },
      err => {
        this.tm_deposit.intt_amt = 0;
        this.isLoading = false;
        debugger;
      }
    );
  }


  reProcessPrincipal()
  {
    if ( (this.tm_deposit.acc_type_cd !== 1) &&
    (this.tm_deposit.acc_type_cd !== 7) &&
    (this.tm_deposit.acc_type_cd !== 13) &&
    (this.tm_deposit.prn_amt > 0) )
    {
      this.processPrincipal();
    }
  }

  processPrincipal( )
  {
    debugger;
    if ((this.tm_deposit.acc_type_cd !== 1) && (this.tm_deposit.acc_type_cd !== 7) && (this.tm_deposit.acc_type_cd !== 13)) {

      if (this.tm_deposit.year === undefined || this.tm_deposit.year === null) {
        this.tm_deposit.year = 0;
      }

      if (this.tm_deposit.month === undefined || this.tm_deposit.month === null) {
        this.tm_deposit.month = 0;
      }

      if (this.tm_deposit.day === undefined || this.tm_deposit.day === null) {
        this.tm_deposit.day = 0;
      }

      if (this.tm_deposit.year === 0 && this.tm_deposit.month === 0 && this.tm_deposit.day === 0) {
        this.tm_deposit.prn_amt = 0;
        this.showAlertMsg('Warning', 'Please enter Deposit period');
        return;
      }

      if (this.tm_deposit.acc_type_cd === undefined ||
        this.tm_deposit.acc_type_cd === null ||
        this.tm_deposit.acc_type_cd < 0) {
        this.tm_deposit.prn_amt = 0;
        this.showAlertMsg('Warning', 'Account Type can not be blank');
        return;
      }

      if (this.tm_deposit.intt_trf_type === undefined ||
        this.tm_deposit.intt_trf_type === null) {
        this.tm_deposit.prn_amt = 0;
        this.showAlertMsg('Warning', 'Interest Transfer Type can not be blank');
        return;
      }

      if (this.tm_deposit.intt_rt === undefined || this.tm_deposit.intt_rt === null || this.tm_deposit.intt_rt <= 0 )
      {
        this.tm_deposit.prn_amt = 0;
        this.showAlertMsg('Warning', 'Please set the Interest Rate..');
        return;
      }

      if (this.tm_deposit.prn_amt === undefined || this.tm_deposit.prn_amt === null || this.tm_deposit.prn_amt <= 0 )
      {
        this.tm_deposit.prn_amt = 0;
        this.showAlertMsg('Warning', 'Please set the Interest Principal..');
        return;
      }


      debugger;
      // this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;
      // this.tm_deposit.mat_dt.setFullYear(this.tm_deposit.mat_dt.getFullYear() + this.tm_deposit.year);
      // this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
      // this.tm_deposit.mat_dt.setDate(this.tm_deposit.mat_dt.getDate() + this.tm_deposit.day);


      var temp_gen_param = new p_gen_param();
      temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;
      temp_gen_param.ad_prn_amt = this.tm_deposit.prn_amt;
      temp_gen_param.adt_temp_dt = this.tm_deposit.opening_dt;
      temp_gen_param.as_intt_type = this.tm_deposit.intt_trf_type;
      // tslint:disable-next-line: max-line-length

      if ( typeof(this.tm_deposit.opening_dt) === "string")
      {
        this.tm_deposit.opening_dt = Utils.convertStringToDt(this.tm_deposit.opening_dt);
      }

      if (typeof (this.tm_deposit.mat_dt) === "string")
      {
        this.tm_deposit.mat_dt = Utils.convertStringToDt(this.tm_deposit.mat_dt);
      }

      temp_gen_param.ai_period = Math.floor((Date.UTC(this.tm_deposit.mat_dt.getFullYear(), this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) - (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(), this.tm_deposit.opening_dt.getDate()))) / (1000 * 60 * 60 * 24));
      temp_gen_param.ad_intt_rt = this.tm_deposit.intt_rt;


      this.f_calctdintt_reg(temp_gen_param);

      // this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
      //   res => {
      //     debugger;
      //     this.tm_deposit.intt_amt = res;
      //     this.tm_deposit.mat_val = Number(this.tm_deposit.intt_amt) + Number(this.tm_deposit.prn_amt);
      //     debugger;
      //     this.isLoading = false;
      //   },
      //   err => {
      //     this.isLoading = false;
      //     debugger;
      //   }
      // );
    }
}

f_calctdintt_reg(temp_gen_param : p_gen_param )
{
  this.isLoading = true;
  debugger;
  this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
    res => {
      debugger;
      this.tm_deposit.intt_amt = res;
      this.tm_deposit.mat_val = Number(this.tm_deposit.intt_amt) + Number(this.tm_deposit.prn_amt);
      debugger;
      this.isLoading = false;
    },
    err => {
      this.isLoading = false;
      debugger;
    }
  );
}

  processInterest() {
    debugger;
    var temp_gen_param = new p_gen_param();

    temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;

    if (this.tm_deposit.acc_type_cd === 6)
    {
      if ( this.tm_deposit.instl_amt === undefined || this.tm_deposit.instl_amt === null ||
        this.tm_deposit.instl_no === undefined || this.tm_deposit.instl_no ===  null ||
        temp_gen_param.an_intt_rate === undefined || temp_gen_param.an_intt_rate === null )
      {
        return;
      }

      temp_gen_param.ad_instl_amt = Number(this.tm_deposit.instl_amt);
      temp_gen_param.an_instl_no = Number(this.tm_deposit.instl_no);
      temp_gen_param.an_intt_rate = Number(this.tm_deposit.intt_rt);
      this.calCrdIntReg(temp_gen_param);
    }
    else
    {

      if (  ( (this.tm_deposit.year === undefined || this.tm_deposit.year === null ) &&
              (this.tm_deposit.month === undefined || this.tm_deposit.month === null) &&
              (this.tm_deposit.day === undefined || this.tm_deposit.day === null) ) ||
        this.tm_deposit.prn_amt === undefined ||  this.tm_deposit.prn_amt === null || this.tm_deposit.prn_amt === 0 ||
        this.tm_deposit.intt_trf_type === undefined || this.tm_deposit.intt_trf_type === null )
      {
        return;
      }

      debugger;
      // this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;
      // this.tm_deposit.mat_dt.setFullYear(this.tm_deposit.mat_dt.getFullYear() + this.tm_deposit.year);
      // this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
      // this.tm_deposit.mat_dt.setDate(this.tm_deposit.mat_dt.getDate() + this.tm_deposit.day);


      // var temp_gen_param = new p_gen_param();
      temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;
      temp_gen_param.ad_prn_amt = this.tm_deposit.prn_amt;
      temp_gen_param.adt_temp_dt = this.tm_deposit.opening_dt;
      temp_gen_param.as_intt_type = this.tm_deposit.intt_trf_type;
      // tslint:disable-next-line: max-line-length
      if ( typeof(this.tm_deposit.opening_dt) === "string")
      {
        this.tm_deposit.opening_dt = Utils.convertStringToDt(this.tm_deposit.opening_dt);
      }

      if (typeof (this.tm_deposit.mat_dt) === "string")
      {
        this.tm_deposit.mat_dt = Utils.convertStringToDt(this.tm_deposit.mat_dt);
      }

      temp_gen_param.ai_period = Math.floor((Date.UTC(this.tm_deposit.mat_dt.getFullYear(), this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) - (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(), this.tm_deposit.opening_dt.getDate()))) / (1000 * 60 * 60 * 24));
      temp_gen_param.ad_intt_rt = this.tm_deposit.intt_rt;

      this.f_calctdintt_reg(temp_gen_param);
    }
  }

  processYearMonthDay() {
    var temp_gen_param = new p_gen_param();
    debugger;

    this.tm_deposit.mat_dt = this.sys.CurrentDate;
    // this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;

    if (this.tm_deposit.year === undefined || this.tm_deposit.year === null)
    {
      this.tm_deposit.year = 0;
    }

    if (this.tm_deposit.month === undefined || this.tm_deposit.month === null)
    {
      this.tm_deposit.month = 0;
    }

    if (this.tm_deposit.day === undefined || this.tm_deposit.day === null)
    {
      this.tm_deposit.day = 0;
    }

    this.tm_deposit.mat_dt.setFullYear(this.tm_deposit.mat_dt.getFullYear() +  this.tm_deposit.year);
    this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
    this.tm_deposit.mat_dt.setDate(this.tm_deposit.mat_dt.getDate() + this.tm_deposit.day);

    if (  ( (this.tm_deposit.year === undefined || this.tm_deposit.year === null ) &&
              (this.tm_deposit.month === undefined || this.tm_deposit.month === null) &&
              (this.tm_deposit.day === undefined || this.tm_deposit.day === null) ) ||
        this.tm_deposit.prn_amt === undefined ||  this.tm_deposit.prn_amt === null ||
        this.tm_deposit.intt_trf_type === undefined || this.tm_deposit.intt_trf_type === null ||
        this.tm_deposit.intt_rt === undefined || this.tm_deposit.intt_rt === null)
      {
        return;
      }


    // var temp_gen_param = new p_gen_param();
    temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;
    temp_gen_param.ad_prn_amt = this.tm_deposit.prn_amt;
    temp_gen_param.adt_temp_dt = this.tm_deposit.opening_dt;
    temp_gen_param.as_intt_type = this.tm_deposit.intt_trf_type;
    // tslint:disable-next-line: max-line-length
    debugger;
    if ( typeof(this.tm_deposit.opening_dt) === "string")
    {
      this.tm_deposit.opening_dt = Utils.convertStringToDt(this.tm_deposit.opening_dt);
    }

    if (typeof (this.tm_deposit.mat_dt) === "string")
    {
      this.tm_deposit.mat_dt = Utils.convertStringToDt(this.tm_deposit.mat_dt);
    }

    temp_gen_param.ai_period = Math.floor((Date.UTC(this.tm_deposit.mat_dt.getFullYear(), this.tm_deposit.mat_dt.getMonth(), this.tm_deposit.mat_dt.getDate()) - (Date.UTC(this.tm_deposit.opening_dt.getFullYear(), this.tm_deposit.opening_dt.getMonth(), this.tm_deposit.opening_dt.getDate()))) / (1000 * 60 * 60 * 24));
    temp_gen_param.ad_intt_rt = this.tm_deposit.intt_rt;

    this.f_calctdintt_reg(temp_gen_param);
    }


}
