import { Component, OnInit } from '@angular/core';
import { stringify } from 'querystring';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { mm_category, mm_customer, td_def_trans_trf } from 'src/app/bank-resolver/Models';
import { AccOpenDM } from 'src/app/bank-resolver/Models/deposit/AccOpenDM';
import { mm_acc_type } from 'src/app/bank-resolver/Models/deposit/mm_acc_type';
import { mm_constitution } from 'src/app/bank-resolver/Models/deposit/mm_constitution';
import { mm_oprational_intr } from 'src/app/bank-resolver/Models/deposit/mm_oprational_intr';
import { td_accholder } from 'src/app/bank-resolver/Models/deposit/td_accholder';
import { td_introducer } from 'src/app/bank-resolver/Models/deposit/td_introducer';
import { td_nominee } from 'src/app/bank-resolver/Models/deposit/td_nominee';
import { td_signatory } from 'src/app/bank-resolver/Models/deposit/td_signatory';
import { tm_denomination_trans } from 'src/app/bank-resolver/Models/deposit/tm_denomination_trans';
import { tm_transfer } from 'src/app/bank-resolver/Models/deposit/tm_transfer';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { tm_deposit } from 'src/app/bank-resolver/Models/tm_deposit';
import { RestService } from 'src/app/_service';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})

export class TestComponent implements OnInit {
  constructor(
    // private frmBldr: FormBuilder,
    private svc: RestService
  ) { }

  transTypeFlg = '';
  accountTypeDiv = 1;
  branchCode = '0';
  openDate: Date;

  denominationGrandTotal = 0;

  isLoading = false;
  disableCustNameFlg = true;
  disableAll = true;
  disableAccountTypeAndNo = false;

  showAlert = false;
  alertMsg: string;

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
  tm_transferList: tm_transfer[] = [];
  td_deftranstrfList: td_def_trans_trf[] = [];
  td_deftrans= new td_def_trans_trf();


  dummyList: string[] = [];


  // tempAccountTypeDscr = null;

  customerList: mm_customer[] = [];
  suggestedCustomer: mm_customer[];
  selectedCustomer = new mm_customer();

  categoryList: mm_category[] = [];
  accountTypeList: mm_acc_type[] = [];
  constitutionList: mm_constitution[] = [];
  selectedConstitutionList: mm_constitution[] = [];
  operationalInstrList: mm_oprational_intr[] = [];
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
    { acc_type_cd: 1, acc_type_desc: 'Savings A/C' },
    { acc_type_cd: 8, acc_type_desc: 'Current A/C' }
  ];

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

    this.isLoading = true;

    this.branchCode = localStorage.getItem('__brnCd');
    this.openDate = new Date(localStorage.getItem('__currentDate'));

    this.suggestedCustomer = null;

    this.initializeModelsAndFlags();

    this.getCustomerList();
    // this.getConstitutionList();
    // this.getAccountTypeList();
    // this.getOperationalInstr();
    this.getCategoryList();
  }


  initializeModelsAndFlags() {

    this.getAccountTypeList();
    this.getConstitutionList();
    this.selectedConstitutionList = [];
    this.getOperationalInstr();

    debugger;
    this.transferTypeListTemp = [];
    this.transferTypeListTemp = this.transferTypeList;

    this.isLoading = false;
    this.disableCustNameFlg = true;
    this.disableAll = true;
    this.disableAccountTypeAndNo = true;

    this.showAlert = false;
    this.alertMsg = '';

    this.denominationGrandTotal = 0;

    this.masterModel = new AccOpenDM();
    this.tm_deposit = new tm_deposit();
    this.tm_deposit.acc_num = null;

    debugger;
    this.tm_deposit.opening_dt = this.DateFormatting(this.openDate);

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

    const tm_trns: tm_transfer[] = [];
    this.tm_transferList = tm_trns;

    const td_deftrans: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftrans;

    this.td_deftrans = new td_def_trans_trf();

    this.masterModel.tmdeposit = this.tm_deposit;
    this.masterModel.tdintroducer = this.td_introducerlist;
    this.masterModel.tdnominee = this.td_nomineeList;
    this.masterModel.tdsignatory = this.td_signatoryList;
    this.masterModel.tdaccholder = this.td_accholderList;
    this.masterModel.tmdenominationtrans = this.tm_denominationList;
    this.masterModel.tmtransfer = this.tm_transferList;
    this.masterModel.tddeftranstrf = this.td_deftranstrfList;
    this.masterModel.tddeftrans = this.td_deftrans;

    this.p_gen_param = new p_gen_param();
  }

  getCustomerList() {
    debugger;
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

  getConstitutionList() {
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
    this.accountTypeList =  [];

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


  newAccount()
  {    // document.getElementById('account_type').id = '';
    this.disableAll = true;

    this.initializeModelsAndFlags();
    this.isLoading = true;
    this.getCustomerList();
    this.disableCustNameFlg = false;
    this.disableAll = false;

  }

saveData()
  {
    debugger;
    if (this.masterModel.tmdeposit.acc_num === null) {
      this.getNewAccountAndSaveData();
    }
    else
    {
      this.InsertOrUpdateAccountData();
    }

    this.disableAll = true;
    this.disableAccountTypeAndNo = false;
  }

  clearData()
  {
    this.initializeModelsAndFlags();
  }

  retrieveData()
  {

  }


  modifyData()
  {

  }


  getNewAccountAndSaveData() {
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
        this.InsertOrUpdateAccountData();
      },
      err => { this.isLoading = false;
        debugger;}

    );

  }


  InsertOrUpdateAccountData() {
    debugger;

    for (let l of this.masterModel.tdsignatory) {
      l.acc_num = this.masterModel.tmdeposit.acc_num;
      l.brn_cd = this.branchCode;
      l.acc_type_cd = Number(this.tm_deposit.acc_type_cd);
    }

    for (let l of this.masterModel.tdaccholder) {
      l.acc_num = this.masterModel.tmdeposit.acc_num;
      l.brn_cd = this.branchCode;
    }

    for (let l of this.masterModel.tdintroducer) {
      l.acc_num = this.masterModel.tmdeposit.acc_num;
      l.brn_cd = this.branchCode;
    }

    for (let l of this.masterModel.tdnominee) {
      l.acc_num = this.masterModel.tmdeposit.acc_num;
      l.brn_cd = this.branchCode;
      l.percentage = Number();
    }

    this.td_deftrans.acc_num = this.masterModel.tmdeposit.acc_num;
    this.td_deftrans.brn_cd = this.branchCode;
    debugger;
    this.td_deftrans.trans_dt = this.DateFormatting(this.openDate);
    this.td_deftrans.approval_status = 'U';
    this.td_deftrans.acc_type_cd = this.tm_deposit.acc_type_cd;

    debugger;
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/InsertAccountOpeningData', this.masterModel).subscribe(
      res => {
        debugger;
        this.td_deftrans.trans_cd = Number(res);
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        debugger;
      }
    );
  }


  public DateFormatting(dateVal: Date): any {
    let dt: Date;
    dt = new Date(Date.UTC(dateVal.getFullYear(), dateVal.getMonth(), dateVal.getDate(), dateVal.getHours(), dateVal.getMinutes()));
    return dt;
  }

  public showAlertMsg(msg: string) {
    this.alertMsg = msg;
    this.showAlert = true;
    this.disableAll = true;
  }

  public closeAlertMsg() {
    this.showAlert = false;
    this.disableAll = false;
  }

  setTransType(tt: any) {
    // this.transTypeFlg = val;
    debugger;
    this.td_deftrans.trf_type = tt;
    this.td_deftrans.trf_type_desc = this.transferTypeList.filter( x => x.trf_type.toString() === tt)[0].trf_type_desc;

  }


  setAccountType(val: number) {
    debugger;
    if (val === 0) {
      val = 1;
    }
    this.accountTypeDiv = Number(val);

    this.tm_deposit.acc_type_cd = Number(val);
    this.tm_deposit.acc_type_desc = this.accountTypeList.filter(x => x.acc_type_cd.toString() === val.toString())[0].acc_type_desc;

    this.selectedConstitutionList = this.constitutionList.filter(x => x.acc_type_cd.toString() === val.toString());
    debugger;
  }

  setIntroducerAccountType(acc_typ_cd: number, idx: number) {
    debugger;
    this.td_introducerlist[idx].acc_type_cd = Number(acc_typ_cd);
    this.td_introducerlist[idx].acc_type_desc = this.introducerAccTypeList.filter(x => x.acc_type_cd.toString() === acc_typ_cd.toString())[0].acc_type_desc;
  }

  setRelationship(id: number, idx: number) {
    debugger;
    this.td_accholderList[idx].cust_cd = Number(this.td_accholderList[idx].cust_cd);
    this.td_accholderList[idx].relation = id.toString();
    this.td_accholderList[idx].relationDscr = this.relationship.filter(x => x.id.toString() === id.toString())[0].val;
    debugger;
  }

  setIntTfrType(tfr_type: string) {
    debugger;
    this.tm_deposit.intt_trf_type = tfr_type;
    this.tm_deposit.intt_tfr_type_dscr = this.intTransferType.filter(x => x.tfr_type.toString() === tfr_type.toString())[0].tfr_desc;
  }

  setConstitutionType(val: number) {
    debugger;
    this.tm_deposit.constitution_cd = Number(val);
    this.tm_deposit.constitution_desc = this.constitutionList.filter(x => x.constitution_cd.toString() === val.toString())[0].constitution_desc;
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
      .filter(c => c.cust_name.toLowerCase().startsWith(this.tm_deposit.cust_name.toLowerCase()))
      .slice(0, 20);
  }

  public setCustDtls(cust_cd: number): void {
    this.tm_deposit.cust_cd = cust_cd;
    this.populateCustDtls(cust_cd);

    this.suggestedCustomer = null;
  }

  populateCustDtls(cust_cd: number) {
    debugger;
    var temp_mm_cust = new mm_customer();
    temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];

    this.tm_deposit.cust_name = temp_mm_cust.cust_name;
    this.tm_deposit.cust_type = temp_mm_cust.cust_type;
    this.tm_deposit.gurdain_name = temp_mm_cust.guardian_name;
    // debugger;
    // this.xyz= temp_mm_cust.date_of_death;
    this.tm_deposit.date_of_birth = temp_mm_cust.dt_of_birth;
    this.tm_deposit.sex = temp_mm_cust.sex;
    this.tm_deposit.phone = temp_mm_cust.phone;

    this.tm_deposit.occupation = temp_mm_cust.occupation;
    this.tm_deposit.email = temp_mm_cust.email;
    this.tm_deposit.present_addr = temp_mm_cust.present_address;

    this.tm_deposit.category_cd = temp_mm_cust.catg_cd;
    this.setCategoryDesc(this.tm_deposit.category_cd);

    this.td_signatoryList[0].cust_cd = cust_cd;
    this.td_signatoryList[0].signatory_name = temp_mm_cust.cust_name;
    this.td_signatoryList[0].brn_cd = this.branchCode;
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
      this.showAlertMsg('Signatory is not a Joint Holder');
    }
  }

  getSetJointHolderName(idx: number) {
    var temp_mm_cust = new mm_customer();
    temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === this.td_accholderList[idx].cust_cd.toString())[0];

    if (!temp_mm_cust) {
      this.td_accholderList[idx].cust_cd = null;
      this.td_accholderList[idx].acc_holder = null;
      this.showAlertMsg('Joint Holder Customer Not Found');
      return;
    }

    if ( temp_mm_cust.cust_cd ===  this.tm_deposit.cust_cd)
    {
      this.td_accholderList[idx].cust_cd = null;
      this.td_accholderList[idx].acc_holder = null;
      this.showAlertMsg('First Holder and Joint Holder can not be same');
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
    var temp_td_introducer = new td_introducer();
    this.td_introducerlist.push(temp_td_introducer);
  }

  removeIntroducer() {
    if (this.td_introducerlist.length > 1)
      this.td_introducerlist.pop();
  }

  setIntroducerName(idx: number) {

    debugger;

    var temp_deposit_list: tm_deposit[] = [];
    var temp_deposit = new tm_deposit();

    temp_deposit.brn_cd = this.branchCode;
    temp_deposit.acc_num = this.td_introducerlist[idx].acc_num;

    this.isLoading = true;

    this.svc.addUpdDel<any>('Deposit/GetDeposit', temp_deposit).subscribe(
      res => {
        debugger;
        temp_deposit_list = res;
        this.isLoading = false;

        if (temp_deposit_list.length === 0) {
          this.td_introducerlist[idx].acc_num = null;
          this.td_introducerlist[idx].introducer_name = null;
          this.showAlertMsg('Introducer Not Found');
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


  calculateTotalDenomination(idx: number )
  {
    debugger;
    let r = 0;
    let c = 0;

    if ( this.tm_denominationList[idx].rupees != null )
    {
      r = this.tm_denominationList[idx].rupees;
    }

    if ( this.tm_denominationList[idx].count != null )
    {
      this.tm_denominationList[idx].count = Number(this.tm_denominationList[idx].count);
      c = this.tm_denominationList[idx].count;
    }

    this.tm_denominationList[idx].total =  r * c;

    this.denominationGrandTotal = 0;
    for (let l of this.tm_denominationList) {
      this.denominationGrandTotal = this.denominationGrandTotal + l.total;
    }
  }

  checkNomineePercentage(idx: number)
  {
    debugger;
    let tot = 0;

    for (let l of this.td_nomineeList) {
      tot = tot + Number(l.percentage);
    }

    if(tot > 100)
    {
      this.showAlertMsg('Nominee Total Percentage exceeding 100');
      this.td_nomineeList[idx].percentage = 0;
    }

    this.td_nomineeList[idx].nom_id = Number(idx) + 1;

  }


  xxxxxxxx(val: any)
  {
    null;
  }

}
