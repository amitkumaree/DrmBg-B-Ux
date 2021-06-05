import { Component, OnInit, ViewChild, ElementRef,TemplateRef} from '@angular/core';
import { Router } from '@angular/router';
import { InAppMessageService, RestService } from 'src/app/_service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { mm_customer } from 'src/app/bank-resolver/Models';
import { SystemValues } from  './../../../Models/SystemValues'
import { tm_loan_all } from 'src/app/bank-resolver/Models/loan/tm_loan_all';
import { mm_acc_type } from 'src/app/bank-resolver/Models/deposit/mm_acc_type';
import { mm_instalment_type } from 'src/app/bank-resolver/Models/loan/mm_instalment_type';
import { LoanOpenDM } from 'src/app/bank-resolver/Models/loan/LoanOpenDM';
import { tm_guaranter } from 'src/app/bank-resolver/Models/loan/tm_guaranter';
import { td_accholder } from 'src/app/bank-resolver/Models/deposit/td_accholder';
import { tm_loan_sanction } from 'src/app/bank-resolver/Models/loan/tm_loan_sanction';
import { tm_loan_sanction_dtls } from 'src/app/bank-resolver/Models/loan/tm_loan_sanction_dtls';
import { p_gen_param } from 'src/app/bank-resolver/Models/p_gen_param';
import { stringify } from '@angular/compiler/src/util';
import { exit } from 'process';
import { mm_sector } from 'src/app/bank-resolver/Models/loan/mm_sector';
import { mm_activity } from 'src/app/bank-resolver/Models/loan/mm_activity';
import { mm_crop } from 'src/app/bank-resolver/Models/loan/mm_crop';
import { p_loan_param } from 'src/app/bank-resolver/Models/loan/p_loan_param';


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
    operationType = '';
    // disablePersonal ='Y';

    createDate: Date;
    updateDate: Date;

    p_gen_param = new p_gen_param();

    isLoading = true;

    customerList: mm_customer[] = [];
    accountTypeList: mm_acc_type[] = [];
    instalmentTypeList: mm_instalment_type[] = [];

    sectorList: mm_sector[] = [];
    activityList: mm_activity[] = [];
    corpList : mm_crop[] = [];

    selectedActivityList : mm_activity[] = [];
    selectedCorpList : mm_crop[] = [];

    showAlert = false;
    alertMsg: string;
    alertMsgType: string;
    suggestedCustomer: mm_customer[];
    suggestedJointCustomer: mm_customer[];
    suggestedCustomerJointHolderIdx : number;


    masterModel = new LoanOpenDM();
    tm_loan_all = new tm_loan_all();
    tm_guaranter =  new tm_guaranter();
    td_accholder : td_accholder[] = [];
    tm_loan_sanction : tm_loan_sanction[] = [];
    tm_loan_sanction_dtls: tm_loan_sanction_dtls[] = [];

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

      repaymentFormulaList = [
        { id: 1, val: 'EMI' },
        { id: 2, val: 'REDUCING' },
      ]

  ngOnInit(): void {

    this.branchCode = this.sys.BranchCode;
    this.createUser = this.sys.UserId;
    this.createDate = this.sys.CurrentDate;
    this.updateUser = this.sys.UserId;
    this.updateDate = this.sys.CurrentDate;

    this.getCustomerList();
    this.getAccountTypeList();
    this.getInstalmentTypeList();

    this.getSectorList();
    this.getActivityList();
    this.getCorpList();

    this.initializeModels();

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



  initializeModels()
  {

    this.masterModel = new LoanOpenDM();

    const loan = new tm_loan_all();
    this.tm_loan_all = loan
    this.masterModel.tmloanall = this.tm_loan_all;

    const guar = new tm_guaranter();
    this.tm_guaranter = guar;
    this.masterModel.tmguaranter = this.tm_guaranter;

    const acc : td_accholder[] = [];
    this.td_accholder = acc;
    this.masterModel.tdaccholder = this.td_accholder;

    const loansanc : tm_loan_sanction[] = [];
    this.tm_loan_sanction = loansanc;
    this.masterModel.tmlaonsanction = this.tm_loan_sanction;

    const loansancdtl : tm_loan_sanction_dtls[] = [];
    this.tm_loan_sanction_dtls = loansancdtl;
    this.masterModel.tmlaonsanctiondtls = this.tm_loan_sanction_dtls

    this.selectedActivityList = [];
    this.selectedCorpList = [];

  }


  assignModelsFromMasterData()
  {
    debugger;
    const loan = new tm_loan_all();
    this.tm_loan_all = loan
    this.tm_loan_all = this.masterModel.tmloanall;
    this.setLoanAccountType(this.tm_loan_all.acc_cd);
    this.setInstalPeriod(this.tm_loan_all.piriodicity);
    this.setRepaymentFormula(this.tm_loan_all.emi_formula_no);


    const guar = new tm_guaranter();
    this.tm_guaranter = guar;
    this.tm_guaranter = this.masterModel.tmguaranter ;

    const acc : td_accholder[] = [];
    this.td_accholder = acc;
    this.td_accholder = this.masterModel.tdaccholder;
    for (let i in this.masterModel.tdaccholder)
    {
    this.setJointHolderRelation(this.td_accholder[i].relation, Number(i));
    }

    const loansanc : tm_loan_sanction[] = [];
    this.tm_loan_sanction = loansanc;
    this.tm_loan_sanction = this.masterModel.tmlaonsanction;

    const loansancdtl : tm_loan_sanction_dtls[] = [];
    this.tm_loan_sanction_dtls = loansancdtl;
    this.tm_loan_sanction_dtls = this.masterModel.tmlaonsanctiondtls;

    // this.selectedActivityList = [];
    // this.selectedCorpList = [];

  }

associateChildRecordsWithHeader()
{
  this.pushTdAccHolder();
  this.pushTmLoanSanction();
  this.pushTmLoanSanctionDtls();
}

pushTdAccHolder()
{
this.masterModel.tdaccholder.push(new td_accholder());
}

pushTmLoanSanction()
{
  debugger;
  this.masterModel.tmlaonsanction.push(new tm_loan_sanction());
  var cnt= this.masterModel.tmlaonsanction.length;
  this.masterModel.tmlaonsanction[cnt-1].sanc_no = cnt;
}

pushTmLoanSanctionDtls()
{
  this.masterModel.tmlaonsanctiondtls.push(new tm_loan_sanction_dtls());
  var cnt= this.masterModel.tmlaonsanctiondtls.length;
  this.masterModel.tmlaonsanctiondtls[cnt-1].sanc_no = cnt;
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


  getInstalmentTypeList() {
    debugger;
    if (this.instalmentTypeList.length > 0) {
      return;
    }
    this.instalmentTypeList = [];

    this.svc.addUpdDel<any>('Mst/GetInstalmentTypeMaster', null).subscribe(
      res => {
        debugger;
        this.instalmentTypeList = res;
      },
      err => {
        debugger;
      }
    );
  }


  getSectorList()
  {
    debugger;
    if (this.sectorList.length > 0) {
      return;
    }
    this.sectorList = [];

    this.svc.addUpdDel<any>('Mst/GetSectorMaster', null).subscribe(
      res => {
        debugger;
        this.sectorList = res;
      },
      err => {
        debugger;
      }
    );

  }

  getActivityList()
  {
    debugger;
    if (this.activityList.length > 0) {
      return;
    }
    this.activityList = [];

    this.svc.addUpdDel<any>('Mst/GetActivityMaster', null).subscribe(
      res => {
        debugger;
        this.activityList = res;
      },
      err => {
        debugger;
      }
    );

  }

  getCorpList()
  {
    debugger;
    if (this.corpList.length > 0) {
      return;
    }
    this.corpList = [];

    this.svc.addUpdDel<any>('Mst/GetCropMaster', null).subscribe(
      res => {
        debugger;
        this.corpList = res;
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

    public suggestJointCustomer(idx: number): void {
      debugger;
      this.suggestedCustomerJointHolderIdx =idx;
      this.suggestedJointCustomer = this.customerList
          .filter(c => c.cust_name.toLowerCase().startsWith(this.td_accholder[idx].acc_holder.toLowerCase())
            || c.cust_cd.toString().startsWith(this.td_accholder[idx].acc_holder)
            || ( c.phone !== null && c.phone.startsWith(this.td_accholder[idx].acc_holder)))
          .slice(0, 20);
      }

    public setJointCustDtls(cust_cd: number, idx: number): void {
      debugger;
      this.td_accholder[idx].cust_cd = cust_cd;
      this.populateJointCustDtls(cust_cd, idx);
      this.suggestedJointCustomer = null;
    }

    populateJointCustDtls(cust_cd: number, idx: number) {
      debugger;
      var temp_mm_cust = new mm_customer();
      temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === cust_cd.toString())[0];
      this.td_accholder[idx].acc_holder = temp_mm_cust.cust_name;
    }

    setJointHolderRelation(relation: string , idx: number) {
      debugger;
      this.td_accholder[idx].relation = relation;
      this.td_accholder[idx].relationId = this.relationship.filter(x => x.val.toString() === relation)[0].id;
    }



    addJointHolder() {
      if (this.masterModel.tdaccholder != undefined)
      {
      var temp_td_accholder = new td_accholder();
      this.masterModel.tdaccholder.push(temp_td_accholder);
      }
    }

    removeJointHolder() {
      if (this.masterModel.tdaccholder != undefined && this.masterModel.tdaccholder.length > 1)
        this.masterModel.tdaccholder.pop();
    }


  public setLoanAccountType(accType: number): void {
    this.tm_loan_all.acc_cd = Number(accType);
    this.tm_loan_all.loan_acc_type = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0].acc_type_desc;
  }

  public setLoanType(accType: number): void {
    this.tm_loan_all.acc_cd = Number(accType);
    this.tm_loan_all.loan_acc_type = this.accountTypeList.filter(x => x.acc_type_cd.toString() === accType.toString())[0].acc_type_desc;
  }


  public setInstalPeriod(instlType: string): void {
    debugger;
    this.tm_loan_all.piriodicity = instlType;
    this.tm_loan_all.instalmentTypeDesc = this.instalmentTypeList.filter( x => x.desc_type.toString() === instlType)[0].ins_desc;
  }


  public setRepaymentFormula(formula: number): void {
    debugger;
    this.tm_loan_all.emi_formula_no = Number(formula);
    this.tm_loan_all.emiFormulaDesc = this.repaymentFormulaList.filter( x=> x.id.toString() == formula.toString())[0].val
  }

  public setSectorType(sec: string , idx: number): void {
    debugger;
    this.tm_loan_sanction_dtls[idx].sector_cd = sec;
    this.tm_loan_sanction_dtls[idx].sector_desc = this.sectorList.filter(x => x.sector_cd.toString() === sec.toString())[0].sector_desc

    this.tm_loan_sanction_dtls[idx].activity_cd = null;
    this.tm_loan_sanction_dtls[idx].activity_desc = null;
    this.tm_loan_sanction_dtls[idx].crop_cd = null;
    this.tm_loan_sanction_dtls[idx].crop_desc = null;
    this.tm_loan_sanction_dtls[idx].due_dt = null;
    this.tm_loan_sanction_dtls[idx].sanc_amt = null;

    this.selectedActivityList = [];
    this.selectedCorpList = [];
    this.selectedActivityList = this.activityList.filter( x=> x.sector_cd.toString() === sec.toString());
  }

  public setActivityType(act: string , idx: number): void {
    debugger;
    this.tm_loan_sanction_dtls[idx].activity_cd = act;
    this.tm_loan_sanction_dtls[idx].activity_desc = this.activityList.filter(x => x.activity_cd.toString() === act.toString())[0].activity_desc;

    this.tm_loan_sanction_dtls[idx].crop_cd = null;
    this.tm_loan_sanction_dtls[idx].crop_desc = null;

    this.selectedCorpList = this.corpList.filter( x=> x.activity_cd.toString() === act.toString());
    if (this.selectedCorpList === undefined || this.selectedCorpList.length === 0)
    {
      var tmp_corp =new mm_crop();
      tmp_corp.crop_cd = '00';
      tmp_corp.crop_desc = 'Others';
      this.selectedCorpList.push(tmp_corp)
    }
  }

  public setCorpType(corp: string , idx: number): void {
    debugger;
    this.tm_loan_sanction_dtls[idx].crop_cd = corp;
    this.tm_loan_sanction_dtls[idx].crop_desc = this.corpList.filter(x => x.crop_cd.toString() === corp.toString())[0].crop_desc;

    if(this.tm_loan_sanction_dtls[idx].crop_cd !== '00')
    {
      var temp_p_loan_param = new p_loan_param();
      temp_p_loan_param.cust_cd = this.masterModel.tmloanall.party_cd;
      temp_p_loan_param.crop_cd = this.tm_loan_sanction_dtls[idx].crop_cd;
      temp_p_loan_param = this.setSanctionAmountAndValidity(temp_p_loan_param);
    }
  }

  setSanctionAmountAndValidity(loan_param: p_loan_param): any {
    debugger;
    var temp_p_loan_param = new p_loan_param();

    this.svc.addUpdDel<any>('Loan/PopulateCropAmtDueDt', temp_p_loan_param).subscribe(
      res => {
        debugger;
        temp_p_loan_param = res;
      },
      err => {
        debugger;
      }
    );
    return temp_p_loan_param;
  }

  newAccount() {    // document.getElementById('account_type').id = '';
    debugger;
    this.clearData();
    this.operationType = 'N';
    // this.disablePersonal = 'N';
    this.isLoading = true;
    debugger;
    this.getCustomerList();

  }


    clearData()
    {
      this.operationType = '';
      // this.disablePersonal = 'Y';
      this.initializeModels();
    }

    retrieveData()
    {
      debugger;
      this.clearData();
      this.operationType = 'Q';
      // this.disablePersonal = 'Y';

      this.isLoading = true;
      this.getCustomerList();

    }


    modifyData() {
      debugger;
      if ( this.operationType !== 'Q' )
      {
        this.showAlertMsg('WARNING' , 'Record not retrived to modify');
        return;
      }
      this.operationType = 'U';

    }


  saveData() {
    debugger;

    if (this.operationType !== 'N' && this.operationType !== 'U' )
    {
      this.showAlertMsg('WARNING', 'Loan Account not Created or Updated to Save');
      exit(0);
    }

    if (this.operationType === 'N') {

      this.tm_loan_all.brn_cd = this.branchCode;
      this.tm_loan_all.created_by = this.createUser;
      this.tm_loan_all.created_dt = this.createDate;

      this.GetLoanAccountNumberAndInsertData()
    }

    if (this.operationType === 'U') {
      this.tm_loan_all.modified_by = this.updateUser;
      this.tm_loan_all.created_dt = this.updateDate;
      this.UpdateLoanAccountOpeningData();
    }
  }

  GetLoanAccountNumberAndInsertData()
  {
    this.ValidatLoanOpenData();
    this.p_gen_param.brn_cd = this.branchCode;
    this.isLoading = true;
    debugger;
    this.svc.addUpdDel<any>('Loan/PopulateLoanAccountNumber', this.p_gen_param).subscribe(
      res => {
        debugger;
        let val = '0';
        this.isLoading = false;
        val = res;
        if (val == "" || val == null)
        {
          this.showAlertMsg('ERROR', 'Loan Account Number not created !!');
          return;
        }
        this.tm_loan_all.loan_id = val.toString();
        debugger;

        // this.masterModel.tmguaranter = null;
        // this.masterModel.tdaccholder = null;
        // this.masterModel.tmlaonsanction = null;
        // this.masterModel.tmlaonsanctiondtls = null;

        this.InsertLoanAccountOpeningData();
      },
      err => { this.isLoading = false;
        this.showAlertMsg('ERROR', 'Loan Account Number not created !!!');
        debugger;}

    );
  }

  InsertLoanAccountOpeningData() {
    debugger;
    this.isLoading = true;
    this.svc.addUpdDel<any>('Loan/InsertLoanAccountOpeningData', this.masterModel).subscribe(
      res => {
        debugger;
        this.isLoading = false;
       // this.disablePersonal = 'Y';
        this.operationType = 'U';
        this.associateChildRecordsWithHeader();
        this.showAlertMsg('INFORMATION', 'Record Saved Successfully. LoanId:' + this.tm_loan_all.loan_id );
      },
      err => {
        debugger;
        this.isLoading = false;
        console.error('Error on SaveClick' + JSON.stringify(err));
        this.showAlertMsg('ERROR', 'Record Not Saved !!!');
        debugger;
      }
    );
  }


  UpdateLoanAccountOpeningData() {
    this.ValidateLoanUpdateData()
    debugger;
    this.isLoading = true;
    this.svc.addUpdDel<any>('Loan/InsertLoanAccountOpeningData', this.masterModel).subscribe(
      res => {
        debugger;
        this.isLoading = false;
        this.operationType = '';
        this.showAlertMsg('INFORMATION', 'Record Saved Successfully. LoanId:' + this.tm_loan_all.loan_id );
      },
      err => {
        debugger;
        this.isLoading = false;
        console.error('Error on SaveClick' + JSON.stringify(err));
        this.showAlertMsg('ERROR', 'Record Not Saved !!!');
        debugger;
      }
    );
  }


  getLoanAccountData() {
    debugger;
    this.isLoading = true;
    this.tm_loan_all.brn_cd = this.branchCode;
    this.svc.addUpdDel<any>('Loan/GetLoanData', this.tm_loan_all).subscribe(
      res => {
        debugger;
        this.isLoading = false;
        this.masterModel = res;

        if (this.masterModel === undefined || this.masterModel === null) {
          this.showAlertMsg('WARNING', 'No record found!!');
        }
        else {
          if (this.masterModel.tmloanall.loan_id !== null) {
            debugger;
            this.assignModelsFromMasterData();
            this.operationType = 'Q';
          }
          else {
            this.showAlertMsg('WARNING', 'No record found!!!');
          }

        }

      },
      err => {
        this.isLoading = false;
        this.showAlertMsg('ERROR', 'Unable to find record!!');
        debugger;
      }

    );
  }

  ValidatLoanOpenData() {
    if (this.tm_loan_all.party_cd === null || this.tm_loan_all.party_cd === undefined ||
      this.tm_loan_all.cust_name === null || this.tm_loan_all.cust_name === undefined ||
      this.tm_loan_all.loan_acc_type === null || this.tm_loan_all.loan_acc_type === undefined ||
      // this.tm_loan_all.loan_acc_no === null || this.tm_loan_all.loan_acc_no === undefined ||
      this.tm_loan_all.instl_start_dt === null || this.tm_loan_all.instl_start_dt === undefined ||
      this.tm_loan_all.curr_intt === null || this.tm_loan_all.curr_intt === undefined ||
      this.tm_loan_all.ovd_intt === null || this.tm_loan_all.ovd_intt === undefined ||
      this.tm_loan_all.instl_no === null || this.tm_loan_all.instl_no === undefined ||
      this.tm_loan_all.piriodicity === null || this.tm_loan_all.piriodicity === undefined ||
      this.tm_loan_all.emi_formula_no === null || this.tm_loan_all.emi_formula_no === undefined)
      {
        this.showAlertMsg('WARNING' , 'Please provide all the required data in Personal Information');
        exit(0);
      }
  }

  ValidateLoanUpdateData() {

    debugger;
    // Guaranter Validation
    if (this.tm_guaranter.gua_name != undefined || this.tm_guaranter.gua_name != null) {
      if (this.tm_guaranter.gua_name == '' ||
          this.tm_guaranter.gua_add == undefined || this.tm_guaranter.gua_add == null || this.tm_guaranter.gua_add == '' ||
          this.tm_guaranter.salary  == undefined || this.tm_guaranter.salary  == null ||
          this.tm_guaranter.mobile  == undefined || this.tm_guaranter.mobile  == null)
          {
          this.showAlertMsg('WARNING', 'Please provide all the required data in Guaranter Details');
          exit(0);
          }

      this.tm_guaranter.loan_id = this.tm_loan_all.loan_id;
      this.tm_guaranter.acc_cd  = this.tm_loan_all.acc_cd;
      this.tm_guaranter.srl_no = 1;
    }

    // Joint Holder Validation
    for (let i in this.masterModel.tdaccholder) {
      if (this.masterModel.tdaccholder[i].cust_cd == undefined || this.masterModel.tdaccholder[i].cust_cd == null) {
        this.masterModel.tdaccholder.splice(0, 1);
      }
      else {
        if (this.masterModel.tdaccholder[i].relation == undefined || this.masterModel.tdaccholder[i].relation == null) {
          this.showAlertMsg('WARNING', 'Please provide all the required data for Joint Holder');
          exit(0);
        }
        else {
          this.masterModel.tdaccholder[i].acc_num = this.tm_loan_all.loan_id;
          this.masterModel.tdaccholder[i].brn_cd = this.branchCode;
          this.masterModel.tdaccholder[i].acc_type_cd = Number(this.tm_loan_all.acc_cd);
        }
      }
    }

    // All Sanction Validation
    if (this.masterModel.tmlaonsanction[0].sanc_dt == undefined) {
      this.showAlertMsg('WARNING', 'Please provide Sanction Date in All Sanction');
      exit(0);
    }
    else {
      if (this.masterModel.tmlaonsanction[0].loan_id === undefined) {
        this.masterModel.tmlaonsanction[0].loan_id = this.tm_loan_all.loan_id;
        this.masterModel.tmlaonsanction[0].created_by = this.createUser;
      }
      else {
        this.masterModel.tmlaonsanction[0].modified_by = this.updateUser;
      }
    }


    // Sanction Details Validation
    if (this.masterModel.tmlaonsanctiondtls[0].sector_cd == undefined || this.masterModel.tmlaonsanctiondtls[0].sector_cd == null
      || this.masterModel.tmlaonsanctiondtls[0].activity_cd == undefined || this.masterModel.tmlaonsanctiondtls[0].activity_cd == null
      || this.masterModel.tmlaonsanctiondtls[0].crop_cd == undefined || this.masterModel.tmlaonsanctiondtls[0].crop_cd == null
      || this.masterModel.tmlaonsanctiondtls[0].sanc_amt == undefined || this.masterModel.tmlaonsanctiondtls[0].sanc_amt == null
      || this.masterModel.tmlaonsanctiondtls[0].due_dt == undefined
    ) {
      this.showAlertMsg('WARNING', 'Please provide all the required data for Sanction Details');
      exit(0);
    }
    else {
      this.masterModel.tmlaonsanctiondtls[0].loan_id = this.tm_loan_all.loan_id;
      this.masterModel.tmlaonsanctiondtls[0].srl_no = this.masterModel.tmlaonsanctiondtls[0].sanc_no;
    }


  }




  public showAlertMsg(msgTyp: string, msg: string) {
    this.alertMsgType = msgTyp;
    this.alertMsg = msg;
    this.showAlert = true;

    // this.disablePersonal = 'Y';
  }

  public closeAlertMsg() {
    this.showAlert = false;
    // if(this.operationType == 'N')
    // {
    //   this.disablePersonal = 'N';
    // }
  }

  backScreen() {
    this.router.navigate([this.sys.BranchName + '/la']);
  }


}

