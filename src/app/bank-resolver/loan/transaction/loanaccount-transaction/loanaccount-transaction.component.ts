import { Router } from '@angular/router';
import { AccOpenDM } from './../../../Models/deposit/AccOpenDM';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { RestService, InAppMessageService } from 'src/app/_service';
import {
  MessageType, mm_acc_type, mm_customer,
  mm_operation, m_acc_master, ShowMessage, SystemValues,
  td_def_trans_trf, tm_deposit, tm_depositall
} from '../../../Models';
import { tm_denomination_trans } from '../../../Models/deposit/tm_denomination_trans';
import { DatePipe } from '@angular/common';
import { tm_transfer } from '../../../Models/deposit/tm_transfer';
import { tt_denomination } from '../../../Models/deposit/tt_denomination';
import { mm_constitution } from '../../../Models/deposit/mm_constitution';
import Utils from 'src/app/_utility/utils';
import { p_gen_param } from '../../../Models/p_gen_param';
import { AccounTransactionsComponent } from 'src/app/bank-resolver/deposit/accoun-transactions/accoun-transactions.component';
import { tm_loan_all } from 'src/app/bank-resolver/Models/loan/tm_loan_all';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LoanOpenDM } from 'src/app/bank-resolver/Models/loan/LoanOpenDM';
import { tm_loan_sanction_dtls } from 'src/app/bank-resolver/Models/loan/tm_loan_sanction_dtls';
import { mm_installment_type } from 'src/app/bank-resolver/Models/mm_installment_type';
import { p_loan_param } from 'src/app/bank-resolver/Models/loan/p_loan_param';

@Component({
  selector: 'app-loanaccount-transaction',
  templateUrl: './loanaccount-transaction.component.html',
  styleUrls: ['./loanaccount-transaction.component.css'],
  providers: [DatePipe]
})
export class LoanaccountTransactionComponent implements OnInit {
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  static constitutionList: mm_constitution[] = [];
  constructor(private svc: RestService, private msg: InAppMessageService,private modalService: BsModalService,
    private frmBldr: FormBuilder, public datepipe: DatePipe, private router: Router) { }
  private static operations: mm_operation[] = [];
  operations: mm_operation[];
  unApprovedTransactionLst: td_def_trans_trf[] = [];
  disableOperation = true;
  modalRef: BsModalRef;
  AcctTypes: mm_operation[];
  transType: DynamicSelect;
  isLoading: boolean;
  sys = new SystemValues();
  accTransFrm: FormGroup;
  tdDefTransFrm: FormGroup;
  accDtlsFrm: FormGroup; 
  sancDetails:FormGroup;
  //sancdtls: FormArray;
  showTransMode = false;
  showTransactionDtl = false;
  hideOnClose = false;
  isRecovery = false;
  isDisburs=false;
  isOpenToDp = false;
  get f() { return this.accTransFrm.controls; }
  get fd() { return this.accDtlsFrm.controls; }
  get td() { return this.tdDefTransFrm.controls; }

  customerList: mm_customer[] = [];
  td_deftrans = new td_def_trans_trf();
  td_deftranstrfList: td_def_trans_trf[] = [];
  tm_transferList: tm_transfer[] = [];
  accountTypeList: mm_acc_type[] = [];
  acc_master: m_acc_master[] = [];
  tm_deposit = new tm_deposit();

  accNoEnteredForTransaction: tm_loan_all;
  hideOnRenewal = false;
  showTranferType = true;
  showMsg: ShowMessage;
  showInstrumentDtl = false;
  tm_denominationList: tm_denomination_trans[] = [];
  denominationList: tt_denomination[] = [];
  sancdtls : tm_loan_sanction_dtls[] =[];
  installmenttypeList : mm_installment_type[]=[];
  denominationGrandTotal = 0;

  ngOnInit(): void {
    this.isLoading = false;
    this.getOperationMaster();
    this.accTransFrm = this.frmBldr.group({
      acc_type_cd: [''],
      oprn_cd: [''],
      acct_num: ['']
    });
    this.accDtlsFrm = this.frmBldr.group({
      cust_name: [''],
      intt_recev: [''],
      curr_principal: [''],
      curr_intt: [''],
      ovd_principal: [''],
      ovd_intt: [''],
      principal: [''],
      total_due: [''],
      disb_amt:['']
    });
    this.tdDefTransFrm = this.frmBldr.group({
      trans_dt: [''],
      trans_cd: [''],
      acc_type_cd: [''],
      acc_type_desc: [''],
      acc_num: [''],
      trans_type_key: [''],
      trans_type: [''],
      trans_mode: [''],
      amount: [''],
      instrument_dt: [''],
      instrument_num: [''],
      paid_to: [''],
      token_num: [''],
      approval_status: [''],
      approved_by: [''],
      approved_dt: [''],
      particulars: [''],
      tr_acc_type_cd: [''],
      tr_acc_num: [''],
      voucher_dt: [''],
      voucher_id: [''],
      trf_type: [''],
      tr_acc_cd: [''],
      acc_cd: [''],
      share_amt: [''],
      sum_assured: [''],
      paid_amt: [''],
      curr_prn_recov: [''],
      ovd_prn_recov: [''],
      curr_intt_recov: [''],
      ovd_intt_recov: [''],
      remarks: [''],
      crop_cd: [''],
      activity_cd: [''],
      curr_intt_rate: [''],
      ovd_intt_rate: [''],
      instl_no: [''],
      instl_start_dt: [''],
      periodicity: [''],
      disb_id: [''],
      comp_unit_no: [''],
      ongoing_unit_no: [''],
      mis_advance_recov: [''],
      audit_fees_recov: [''],
      sector_cd: [''],
      spl_prog_cd: [''],
      borrower_cr_cd: [''],
      intt_till_dt: [''],
      acc_name: [''],
      brn_cd: [''],
      trf_type_desc: [''],
      constitution_cd: [''],
      constitution_cd_desc: [''],
      cert_no: [''],
      opening_dt: [''],
      mat_dt: [''],
      dep_period_y: [''],
      dep_period_m: [''],
      dep_period_d: [''],
      intt_trf_type: [''],
      intt_rate: [''],
      interest: [''],
      recov_type:[''],
      intt_recov_dt:[''],
      paid_amount:[''],
      no_of_day:[''],
      share:[''],
      comm:[''],
      svcchrg:[''],
      saleform:[''],
      insurence:['']
    });
   
    const td_deftranstrf: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftranstrf;
    let temp_deftranstrf = new td_def_trans_trf()
    this.td_deftranstrfList.push(temp_deftranstrf);
    this.getAccountTypeList();
    //this.getCustomerList();
    this.GetUnapprovedDepTrans();
    this.getDenominationList();
    this.getInstallmentType();
  }
  // addVoucherFromGroup(): FormGroup {
  //   return this.frmBldr.group({
  //     'sector': '',
  //     'activity': '',
  //     'sanc_amt':'',
  //     'draw_amt':''
  //   });
  // }
  processInterest(): void {
    debugger;
    let temp_gen_param = new p_gen_param();

    temp_gen_param.ad_acc_type_cd = this.tm_deposit.acc_type_cd;

    if (this.td.acc_type_cd.value === 6) {
      // if (this.td.instl_amt.value === undefined || this.td.instl_amt.value === null ||
      //   this.td.instl_no.value === undefined || this.td.instl_no.value === null ||
      //   this.td.intt_rt.value === undefined || this.td.intt_rt.value === null)
      // // temp_gen_param.an_intt_rate === undefined || temp_gen_param.an_intt_rate === null )
      // {
      //   return;
      // }

      temp_gen_param.ad_instl_amt = +this.td.instl_amt.value;
      temp_gen_param.an_instl_no = +this.td.instl_no.value;
      temp_gen_param.an_intt_rate = +this.td.intt_rt.value;
      this.calCrdIntReg(temp_gen_param);
    }
    else {

      // if (((this.tm_deposit.year === undefined || this.tm_deposit.year === null) &&
      //   (this.tm_deposit.month === undefined || this.tm_deposit.month === null) &&
      //   (this.tm_deposit.day === undefined || this.tm_deposit.day === null)) ||
      //   this.tm_deposit.prn_amt === undefined || this.tm_deposit.prn_amt === null || this.tm_deposit.prn_amt === 0 ||
      //   this.tm_deposit.intt_trf_type === undefined || this.tm_deposit.intt_trf_type === null) {
      //   return;
      // }
      if (this.td.intt_trf_type.value === '' ||
        this.td.intt_rate.value === '') {
        return;
      }

      debugger;
      // this.tm_deposit.mat_dt = this.DateFormatting(this.openDate); // this.tm_deposit.opening_dt;
      // this.tm_deposit.mat_dt.setFullYear(this.tm_deposit.mat_dt.getFullYear() + this.tm_deposit.year);
      // this.tm_deposit.mat_dt.setMonth(this.tm_deposit.mat_dt.getMonth() + this.tm_deposit.month);
      // this.tm_deposit.mat_dt.setDate(this.tm_deposit.mat_dt.getDate() + this.tm_deposit.day);


      // var temp_gen_param = new p_gen_param();
      temp_gen_param.ad_acc_type_cd = +this.td.acc_type_cd.value;
      temp_gen_param.ad_prn_amt = +this.td.amount.value;
      temp_gen_param.adt_temp_dt = Utils.convertStringToDt(this.td.opening_dt.value);
      temp_gen_param.as_intt_type = this.td.intt_trf_type.value;
      // tslint:disable-next-line: max-line-length
      // if (typeof (this.td.opening_dt) === 'string') {
      //   this.tm_deposit.opening_dt = Utils.convertStringToDt(this.td.opening_dt.value);
      // }

      // if (typeof (this.tm_deposit.mat_dt) === 'string') {
      //   this.tm_deposit.mat_dt = Utils.convertStringToDt(this.tm_deposit.mat_dt);
      // }

      const o = Utils.convertStringToDt(this.td.opening_dt.value);
      const m = Utils.convertStringToDt(this.td.mat_dt.value);
      var diffDays = Math.ceil((Math.abs(m.getTime() - o.getTime())) / (1000 * 3600 * 24));

      temp_gen_param.ai_period = diffDays;
      temp_gen_param.ad_intt_rt = +this.td.intt_rate.value;

      this.f_calctdintt_reg(temp_gen_param);
    }
  }

  calCrdIntReg(tempGenParam: p_gen_param): void {
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

  f_calctdintt_reg(temp_gen_param: p_gen_param): void {
    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/F_CALCTDINTT_REG', temp_gen_param).subscribe(
      res => {
        this.tdDefTransFrm.patchValue({
          interest: +res
        });
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        debugger;
      }
    );
  }

  // getConstitutionList() {
  //   if (AccounTransactionsComponent.constitutionList.length > 0) {
  //     return;
  //   }

  //   AccounTransactionsComponent.constitutionList = [];
  //   this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
  //     res => {
  //       // debugger;
  //       AccounTransactionsComponent.constitutionList = res;
  //     },
  //     err => { // debugger;
  //     }
  //   );
  // }

  private getDenominationList(): void {
    debugger;
    let denoList: tt_denomination[] = [];
    this.svc.addUpdDel<any>('Common/GetDenomination', null).subscribe(
      res => {
        debugger;
        denoList = res;
        this.denominationList = denoList.sort((a, b) => (a.value < b.value) ? 1 : -1);
      },
      err => { // debugger;
      }
    );
  }
  private getInstallmentType(): void {
    debugger;
   this.svc.addUpdDel<any>('Mst/GetInstalmentTypeMaster', null).subscribe(
      res => {
        debugger;
        this.installmenttypeList = res;
      },
      err => { // debugger;
      }
    );
  }
  
  /** silently bring all the unapproved transaction
   * silently because it will be needed during save
   */
  private GetUnapprovedDepTrans(): void {
    const tdDepTrans = new td_def_trans_trf();
    tdDepTrans.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    tdDepTrans.trans_type="L";
    this.svc.addUpdDel<any>('Common/GetUnapprovedDepTrans', tdDepTrans).subscribe(
      res => {
        this.unApprovedTransactionLst = res;
      },
      err => { this.isLoading = false; }
    );
  }

  // getCustomerList() {
  //   debugger;
  //   const cust = new mm_customer();
  //   cust.cust_cd = 0;
  //   cust.brn_cd = this.sys.BranchCode;

  //   if (this.customerList === undefined || this.customerList === null || this.customerList.length === 0) {
  //     this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
  //       res => {
  //         debugger;
  //         this.isLoading = false;
  //         this.customerList = res;
  //       },
  //       err => {
  //         this.isLoading = false;
  //         debugger;
  //       }
  //     );
  //   }
  //   else { this.isLoading = false; }
  // }

  private getOperationMaster(): void {
    debugger;
    this.isLoading = true;
    if (undefined !== AccounTransactionsComponent.operations &&
      null !== AccounTransactionsComponent.operations &&
      AccounTransactionsComponent.operations.length > 0) {
      this.isLoading = false;
      this.AcctTypes = AccounTransactionsComponent.operations.filter(e => e.module_type === 'LOAN')
        .filter((thing, i, arr) => {
          return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
        });
      this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
    } else {
      this.svc.addUpdDel<mm_operation[]>('Mst/GetOperationDtls', null).subscribe(
        res => {
          debugger;
          AccounTransactionsComponent.operations = res;
          this.isLoading = false;
          this.AcctTypes = AccounTransactionsComponent.operations.filter(e => e.module_type === 'LOAN')
            .filter((thing, i, arr) => {
              return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
            });
          this.AcctTypes = this.AcctTypes.sort((a, b) => (a.acc_type_cd > b.acc_type_cd ? 1 : -1));
        },
        err => { this.isLoading = false; }
      );
    }
  }

  /** method fires on account type change */
  public onAcctTypeChange(): void {
    this.f.acct_num.reset();
    const acctTypCdTofilter = +this.f.acc_type_cd.value;
    const acctTypeDesription = AccounTransactionsComponent.operations
      .filter(e => e.acc_type_cd === acctTypCdTofilter)[0].acc_type_desc;
    this.tdDefTransFrm.patchValue({
      acc_type_desc: acctTypeDesription,
      acc_type_cd: acctTypCdTofilter
    });
    this.operations = AccounTransactionsComponent.operations
      .filter(e => e.acc_type_cd === acctTypCdTofilter);
    // this.f.oprn_cd.enable();
    this.f.acct_num.enable();
    this.f.oprn_cd.disable();
    this.msg.sendCommonTmLoanAll(null);
  }

  public onAccountNumTabOff(): void {
    debugger;
    this.f.oprn_cd.disable();
    this.disableOperation = true;
    this.showTranferType = true;
    // console.log('onAccountNumTabOff -' + this.f.acct_num.value);
    this.isLoading = true;
    this.showMsg = null;
    let acc1 = new tm_loan_all();
    let acc = new LoanOpenDM();

    acc1.loan_id = '' + this.f.acct_num.value;
    acc1.brn_cd = this.sys.BranchCode;
    acc1.acc_cd=this.f.acc_type_cd.value;
    this.svc.addUpdDel<any>('Loan/GetLoanData', acc1).subscribe(
      res => {
        debugger;
        acc = res;
        if (undefined === acc || acc.tmloanall.loan_id==null) {
          this.accTransFrm.patchValue({
            acct_num:''   
                });
          this.HandleMessage(true, MessageType.Error,
            'Account number ' + this.f.acct_num.value + ' is not Valid/Present/Account Type doesnt match.');
          this.msg.sendCommonTmLoanAll(null);
        } else {
          this.accTransFrm.patchValue({
            oprn_cd:''   
                });
          const td_deftranstrf: td_def_trans_trf[] = [];
          this.td_deftranstrfList = td_deftranstrf;
          let temp_deftranstrf = new td_def_trans_trf()
          this.td_deftranstrfList.push(temp_deftranstrf);
          this.tm_denominationList =[];
          this.denominationGrandTotal=0
          // const temp_denomination = new tm_denomination_trans();
          // temp_denomination.brn_cd = localStorage.getItem('__brnCd');
          // temp_denomination.trans_dt = this.sys.CurrentDate;
          // this.tm_denominationList.push(temp_denomination);
          this.tdDefTransFrm.reset();
          this.accDtlsFrm.reset();
          this.showTransactionDtl=false;
          this.disableOperation = false;
          this.accNoEnteredForTransaction = acc.tmloanall;
          this.accDtlsFrm.patchValue({
            cust_name: acc.tmloanall.cust_name,
            intt_recev: acc.tmloanall.curr_intt+acc.tmloanall.ovd_intt,
            curr_principal:acc.tmloanall.curr_prn,
            curr_intt:acc.tmloanall.curr_intt,
            ovd_principal:acc.tmloanall.ovd_prn,
            ovd_intt:acc.tmloanall.ovd_intt,
            principal:acc.tmloanall.curr_prn+acc.tmloanall.ovd_prn,
            total_due: acc.tmloanall.curr_intt+acc.tmloanall.ovd_intt+acc.tmloanall.curr_prn+acc.tmloanall.ovd_prn,
            disb_amt: acc.tmloanall.disb_amt
          })
          this.msg.sendCommonTmLoanAll(acc.tmloanall);
          this.tdDefTransFrm.patchValue({
            acc_num: acc.tmloanall.loan_id        ,
            acc_type_cd : acc.tmloanall.acc_cd ,
            curr_intt_rate: acc.tmloanall.curr_intt_rate        ,
            ovd_intt_rate: acc.tmloanall.ovd_intt_rate        ,
            instl_start_dt: acc.tmloanall.instl_start_dt.toString().substr(0, 10)        ,
            periodicity: this.installmenttypeList.filter(x=>x.desc_type=== acc.tmloanall.piriodicity)[0].ins_desc,
            instl_no:acc.tmloanall.instl_no,
            recov_type:"A" ,
            intt_recov_dt:Utils.convertStringToDt(acc.tmloanall.last_intt_calc_dt.toString().substr(0, 10)),
            //paid_amount:acc.tmloanall.disb_amt,
            intt_till_dt:Utils.convertStringToDt(acc.tmloanall.last_intt_calc_dt.toString().substr(0, 10)),
          });
          this.sancdtls = acc.tmlaonsanctiondtls;
          this.sancdtls.forEach(x=>x.draw_limit=x.sanc_amt-acc.tmloanall.curr_prn)
          // for (let x = 0; x < acc.tmlaonsanctiondtls.length; x++) {
          //   this.sancdtls = this.sancDetails.get('sancdtls') as FormArray;
          //   this.sancdtls.push(this.frmBldr.group({
          //     'sector':  acc.tmlaonsanctiondtls[x].sector_desc,
          //     'activity': acc.tmlaonsanctiondtls[x].activity_desc,
          //     'sanc_amt':acc.tmlaonsanctiondtls[x].sanc_amt,
          //     'draw_amt':acc.tmlaonsanctiondtls[x].sanc_amt}));
          // }
          this.f.oprn_cd.enable();
        }
        this.isLoading = false;
      },
      err => {
        debugger;
        this.f.oprn_cd.disable(); this.isLoading = false;
        console.log(err);
        this.msg.sendCommonTmLoanAll(null);
      }
    );
  }

  /* method fires on operation type change */
   public onOperationTypeChange(): void {
     this.HandleMessage(false);
     this.showTranferType = true;
     this.hideOnClose = false;
     this.showTransactionDtl = true;
    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
     this.transType = new DynamicSelect();
     if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'disbursement') {
       this.transType.key = 'B';
       this.transType.Description = 'Disbursement';
       this.tdDefTransFrm.patchValue({
         trans_type: this.transType.Description,
         trans_type_key: this.transType.key
       });
       this.showTransMode = true;
       this.isDisburs=true;
       this.isRecovery=false;
       this.td.trf_type.value !== ''
     } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'recovery') {
       debugger;
       this.dayDiff(this.td.intt_recov_dt.value,this.td.intt_till_dt.value) 
       this.transType.key = 'R';
       this.transType.Description = 'Recovery';
       this.tdDefTransFrm.patchValue({
         trans_type: this.transType.Description,
         trans_type_key: this.transType.key,
         no_of_day: this.dayDiff(this.td.intt_recov_dt.value,this.td.intt_till_dt.value) 
       });
       this.geteffectiveinttrt()
       this.isDisburs=false;
       this.isRecovery=true; 
       this.td.trf_type.value !== ''
     }      
   } 


  onRecovTypeChange(): void {
    debugger;
    const selectedRecovType = this.td.recov_type.value;
    if ('M'===selectedRecovType)
    {
      this.td.curr_prn_recov.enable();
      this.td.curr_intt_recov.enable();
      this.td.ovd_prn_recov.enable();
      this.td.ovd_intt_recov.enable();
      this.td.amount.setValue('');
      this.td.curr_prn_recov.setValue('');
      this.td.curr_intt_recov.setValue('');
      this.td.ovd_prn_recov.setValue('');
      this.td.ovd_intt_recov.setValue('');
    }
    else
    {
      this.td.curr_prn_recov.disable();
      this.td.curr_intt_recov.disable();
      this.td.ovd_prn_recov.disable();
      this.td.ovd_intt_recov.disable();
      this.td.amount.setValue('');
      this.td.curr_prn_recov.setValue('');
      this.td.curr_intt_recov.setValue('');
      this.td.ovd_prn_recov.setValue('');
      this.td.ovd_intt_recov.setValue('');
    }
  }

   onTransModeChange(): void {
     debugger;
     const selectedTransMode = this.td.trans_mode.value;
     if ('Q' === selectedTransMode) {
       // check if cheque facility is available or not
       if (this.accNoEnteredForTransaction.cheque_facility === 'N') {
         this.td.trans_mode.reset();
         alert('Account does not have cheque facility.');
         return;
       }
       this.showInstrumentDtl = true;
     } else {
       this.showInstrumentDtl = false;
     }
   }



  onTransTypeChange(): void {
    debugger;
    const accTypeCd = +this.f.acc_type_cd.value;
    if (accTypeCd !== 2
      && accTypeCd !== 3
      && accTypeCd !== 4
      && accTypeCd !== 5) {
      if (this.td.trf_type.value === 'C') {
        this.tdDefTransFrm.patchValue({
          paid_to: null,
          particulars: 'TO CASH '
        });
      } else {
        this.tdDefTransFrm.patchValue({
          paid_to: null,
          particulars: 'TO TRANSFER '
        });
      }
    }

    if (this.td.trf_type.value === 'C') {
      this.addDenomination();
    }
  }

  private checkUnaprovedTransactionExixts(): boolean {
    this.GetUnapprovedDepTrans();
    const unapprovedTrans = this.unApprovedTransactionLst.filter(e => e.acc_num
      === this.td.acc_num.value)[0];

    if (undefined === unapprovedTrans || Object.keys(unapprovedTrans).length === 0) {
      return false;
    }
    return true;
  }
  
  onMiscChng() : void{
    if ((+this.td.amount.value) < 0) {
      this.HandleMessage(true, MessageType.Error, 'Amount can not be negative.');
      this.td.amount.setValue('');
      return;
    }
    var totmiscAmt = (+this.td.share.value) + (+this.td.comm.value) +(+this.td.svcchrg.value) + (+this.td.saleform.value) + (+this.td.insurence.value)
    if ((+this.td.amount.value) < totmiscAmt) {
      this.HandleMessage(true, MessageType.Error, 'Disbursement Amount can not be less than total  Misc. Charges.');
      this.td.amount.setValue('');
      return;
    } 
    this.tdDefTransFrm.patchValue({      
      paid_amount:((+this.td.amount.value)-totmiscAmt)     
    });
  }

   onAmtChng(): void {
     debugger;
     this.HandleMessage(false);
    if ((+this.td.amount.value) < 0) {
       this.HandleMessage(true, MessageType.Error, 'Amount can not be negative.');
       this.td.amount.setValue('');
       return;
     }
     if (this.td.trans_type_key.value === 'R' && (+this.td.amount.value) >
      (Number(this.fd.curr_principal.value)+Number(this.fd.curr_intt.value)+Number(this.fd.ovd_principal.value)+Number(this.fd.ovd_intt.value))) {
      this.HandleMessage(true, MessageType.Error, 'Recovery Amount Can Not be greater Than Total Outstanding.');
      this.td.amount.setValue('');
      return;
    }
    
    if (this.td.trans_type_key.value === 'B' &&  (+this.td.amount.value) > this.sancdtls.map(a => a.draw_limit).reduce(function(a, b){return a + b;})
      ) {
      this.HandleMessage(true, MessageType.Error, 'Amount Exceeds Drawal Limit.');
      this.td.amount.setValue('');
      return;
    }
     if (this.td.trans_type_key.value === 'R')
     {
       this.PopulateRecoveryDetails()
    }
    else
    {
      this.onMiscChng();
    }
    
  }
  onRecoveryTillDateChng(ev:any):void{
    debugger;
    if (this.td.trans_type_key.value === 'R')
      {
        if (+this.td.amount.value > 0)
         {
           if (this.dayDiff(this.td.intt_recov_dt.value,this.td.intt_till_dt.value)  <=0)
           {
            this.HandleMessage(true, MessageType.Error, 'Interest Already calculated upto '+this.td.intt_till_dt.value);
            this.tdDefTransFrm.patchValue({
                  no_of_day:0  ,
                  curr_prn_recov: ''     ,
                  curr_intt_recov: ''     ,
                  ovd_prn_recov: ''     ,
                  ovd_intt_recov: ''       
             });
           }
           else{
          this.PopulateRecoveryDetails();
          this.geteffectiveinttrt();
          this.tdDefTransFrm.patchValue({
                no_of_day: this.dayDiff(this.td.intt_recov_dt.value,this.td.intt_till_dt.value)    
               });
              }
          }
          else
          {
              this.HandleMessage(true, MessageType.Error, 'Recovery amount can not be blank or negative');
              this.td.amount.setValue('');
          }
       }
  }

  dayDiff(d1:Date, d2:Date)
  {
    debugger;
    var diffDays =Math.floor((Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate()) - Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate()) ) /(1000 * 60 * 60 * 24)); 
    return diffDays;
  }
  PopulateRecoveryDetails()
  {
    const tmDep = new p_loan_param();
       var inttRet = new p_loan_param();
       tmDep.loan_id = this.f.acct_num.value;
       tmDep.brn_cd = this.sys.BranchCode;
       tmDep.gs_user_id = this.sys.UserId;
       tmDep.curr_intt_rate=this.td.curr_intt_rate.value;
       tmDep.recov_amt=this.td.amount.value;
       tmDep.commit_roll_flag=0;
       tmDep.intt_dt=this.td.intt_recov_dt.value;
       this.svc.addUpdDel<any>('Loan/CalculateLoanInterest', tmDep).subscribe(
         res => {
           debugger;
           if (undefined !== res ) {
            inttRet = res;
            this.tdDefTransFrm.patchValue({
              curr_prn_recov: inttRet.curr_prn_recov      ,
              curr_intt_recov: inttRet.curr_intt_recov     ,
              ovd_prn_recov: inttRet.ovd_prn_recov      ,
              ovd_intt_recov: inttRet.ovd_prn_recov      
                  });
             
          }
        },
        err => {
          this.isLoading = false; console.log(err);
          this.HandleMessage(true, MessageType.Error, 'Interest Can not be calculated, Try again later.');
        }
      );
  }
  geteffectiveinttrt():void{
    const tmDep = new p_loan_param();
       var inttRet : number = 0;
       tmDep.loan_id = this.f.acct_num.value;
       tmDep.acc_type_cd = this.f.acc_type_cd.value;
       tmDep.intt_dt=this.td.intt_recov_dt.value;
       this.svc.addUpdDel<any>('Loan/F_GET_EFF_INTT_RT', tmDep).subscribe(
         res => {
           debugger;
           if (undefined !== res ) {
            inttRet = res;
            this.tdDefTransFrm.patchValue({
              intt_rate: inttRet      
                  });
             
          }
        },
        err => {
          this.isLoading = false; console.log(err);
          this.HandleMessage(true, MessageType.Error, 'Effective Interest Rate calculation failed, Try again later.');
        }
      );
  }

  onSaveClick(): void {
      debugger;

      if ((+this.td.amount.value) <= 0) {
        this.HandleMessage(true, MessageType.Error, 'Amount can not be blank');
       return;
     }

     if (this.checkUnaprovedTransactionExixts()) {
        this.HandleMessage(true, MessageType.Error,
          'Un-approved Transaction already exists for the Account ' + this.td.acc_num.value);
        return;
     }

     this.isLoading = true;
     const saveTransaction = new LoanOpenDM();
     const tdDefTrans = this.mappTddefTransFromFrm();
     saveTransaction.tddeftrans = tdDefTrans;
     if (this.td.trf_type.value === 'C') {
       saveTransaction.tmdenominationtrans = this.tm_denominationList;
     } else if (this.td.trf_type.value === 'T') {
       const tdDefTransAndTranfer = this.mappTddefTransFromFrm();
       tdDefTransAndTranfer.acc_num = this.td_deftranstrfList[0].cust_acc_number;
       tdDefTransAndTranfer.acc_name = this.td_deftranstrfList[0].cust_name;
       tdDefTransAndTranfer.amount = this.td_deftranstrfList[0].amount;
       saveTransaction.tddeftranstrf.push(tdDefTransAndTranfer);

       const tmTrnsfr = new tm_transfer();
       tmTrnsfr.brn_cd = this.sys.BranchCode;
       tmTrnsfr.trf_dt = this.sys.CurrentDate;
       tmTrnsfr.created_by = this.sys.UserId;
       tmTrnsfr.approval_status = 'U';

       saveTransaction.tmtransfer.push(tmTrnsfr);
     }
     this.svc.addUpdDel<LoanOpenDM>('Loan/InsertLoanTransactionData', saveTransaction).subscribe(
       res => {
         debugger;
         this.unApprovedTransactionLst.push(tdDefTrans);
         this.HandleMessage(true, MessageType.Sucess, 'Saved sucessfully, your transaction code is -' + res);
         // this.tdDefTransFrm.reset();
         // this.accTransFrm.reset();
         this.isLoading = false;
       },
       err => { this.isLoading = false; 
        this.HandleMessage(true, MessageType.Error, 'Save Failed !!!!');
        console.error('Error on onSaveClick' + JSON.stringify(err)); debugger; }
     );
   }

   mappTddefTransFromFrm(): td_def_trans_trf {
     debugger;
     const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
     const toReturn = new td_def_trans_trf();
     const accTypeCd = +this.f.acc_type_cd.value;
     // toReturn.trans_dt = new Date(this.convertDate(localStorage.getItem('__currentDate')) + ' UTC');
     toReturn.brn_cd = this.sys.BranchCode;
     toReturn.trans_dt = this.sys.CurrentDate;
     toReturn.acc_type_cd = this.td.acc_type_cd.value;
     toReturn.acc_num = this.td.acc_num.value;
     toReturn.trans_type = this.td.trans_type_key.value;
     toReturn.trans_mode = this.td.trans_mode.value;
     toReturn.amount = +this.td.amount.value;
     toReturn.instrument_dt = this.td.instrument_dt.value === '' ? null : this.td.instrument_dt.value;
     toReturn.instrument_num = this.td.instrument_num.value === '' ? 0 : +this.td.instrument_num.value;
     toReturn.paid_to = this.td.paid_to.value;
     toReturn.token_num = this.td.token_num.value;
     toReturn.created_by = this.sys.UserId;
     toReturn.modified_by = this.sys.UserId;
     toReturn.approval_status = 'U';     
     toReturn.particulars = 'S'
     if (this.td.trf_type.value === 'T') {
       toReturn.tr_acc_cd = 10000;
     } else if (this.td.trf_type.value === 'C') {
       toReturn.tr_acc_cd = 28101;
     }
     toReturn.trf_type = this.td.trf_type.value;
     toReturn.acc_cd = this.td.acc_type_cd.value;
     if (this.td.trans_type_key.value === 'R')
     {
     toReturn.curr_prn_recov=this.td.curr_prn_recov.value;
     toReturn.curr_intt_recov=this.td.curr_intt_recov.value;
     toReturn.ovd_prn_recov=this.td.ovd_prn_recov.value;
     toReturn.ovd_intt_recov=this.td.ovd_intt_recov.value;
     toReturn.intt_till_dt=this.td.intt_recov_dt.value;
     toReturn.paid_amt=+this.td.amount.value; 
     toReturn.share_amt=0,
     toReturn.sum_assured=0,
     toReturn.voucher_id=0,
     toReturn.mis_advance_recov=0,
     toReturn.audit_fees_recov=0
     }
     else
     {
      toReturn.curr_prn_recov=0;
      toReturn.curr_intt_recov=0;
      toReturn.ovd_prn_recov=0;
      toReturn.ovd_intt_recov=0;
      toReturn.intt_till_dt=Utils.convertStringToDt(this.td.instl_start_dt.value); 
     toReturn.paid_amt=+this.td.paid_amount.value;
     toReturn.share_amt=this.td.share.value,
     toReturn.sum_assured=this.td.comm.value,
     toReturn.voucher_id=this.td.svcchrg.value,
     toReturn.mis_advance_recov=this.td.saleform.value,
     toReturn.audit_fees_recov=this.td.insurence.value
     }
     toReturn.remarks=null;
     toReturn.crop_cd= this.sancdtls[0].crop_cd;
     toReturn.activity_cd=this.sancdtls[0].activity_cd;
     toReturn.curr_intt_rate=this.td.curr_intt_rate.value;
     toReturn.ovd_intt_rate=this.td.ovd_intt_rate.value;
     toReturn.instl_no=1;
     toReturn.instl_start_dt=Utils.convertStringToDt(this.td.instl_start_dt.value);
     toReturn.periodicity=Number(this.installmenttypeList.filter(x=>x.ins_desc=== this.td.periodicity.value)[0].ins_type);
     toReturn.disb_id = 0;
     toReturn.comp_unit_no = 0;
     toReturn.ongoing_unit_no = 0;
     toReturn.mis_advance_recov = 0;
     toReturn.audit_fees_recov = 0;
     toReturn.sector_cd = this.sancdtls[0].sector_cd;
     toReturn.spl_prog_cd = '18';
     toReturn.borrower_cr_cd = '0000';
     return toReturn;
   }

   mapDenominationToTmdenominationtrans(): void {

   }

  onResetClick(): void {
    this.accTransFrm.reset();
    this.tdDefTransFrm.reset();
    this.accDtlsFrm.reset();

    // this.getOperationMaster();
    this.f.oprn_cd.disable();
    this.f.acct_num.disable();
    this.msg.sendCommonTmLoanAll(null);
    this.tm_denominationList = [];
    this.td_deftranstrfList = [];
    this.sancdtls=[];
    this.showTransactionDtl=false;

  }

  addDenomination() {
    debugger;
    let alreadyHasEmptyDenominationItem = false;
    if (this.tm_denominationList.length >= 1) {
      // check if tm_denominationList has any blank items
      this.tm_denominationList.forEach(element => {
        if (!alreadyHasEmptyDenominationItem) {
          if (undefined === element.rupees
            || undefined === element.count
            || undefined === element.total) { alreadyHasEmptyDenominationItem = true; }
        }
      });
    }
    if (alreadyHasEmptyDenominationItem) { return; }

    const temp_denomination = new tm_denomination_trans();
    temp_denomination.brn_cd = localStorage.getItem('__brnCd');
    temp_denomination.trans_dt = this.sys.CurrentDate;
    this.tm_denominationList.push(temp_denomination);
  }

  removeDenomination() {
    if (this.tm_denominationList.length >= 1) {
      this.tm_denominationList.pop();
      this.denominationGrandTotal = 0;
      for (let l of this.tm_denominationList) {
        this.denominationGrandTotal = this.denominationGrandTotal + l.total;
      }
    }
  }

  setDenomination(val: number, idx: number) {
    debugger;
    this.tm_denominationList[idx].rupees = Number(val);
    this.tm_denominationList[idx].rupees_desc = this.denominationList.filter(x => x.rupees === val.toString())[0].rupees;
    this.calculateTotalDenomination(idx);
  }

  calculateTotalDenomination(idx: number) {
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

  setDebitAccDtls(acc_num: string) {
    debugger;
    if (this.td_deftranstrfList[0].cust_acc_type === undefined
      || this.td_deftranstrfList[0].cust_acc_type === null
      || this.td_deftranstrfList[0].cust_acc_type === '') {
      this.HandleMessage(true, MessageType.Warning, 'Account Type in Transfer Details can not be blank');
      this.td_deftranstrfList[0].cust_acc_number = null;
      return;
    }

    if (this.td_deftranstrfList[0].cust_acc_number === undefined || this.td_deftranstrfList[0].cust_acc_number === null || this.td_deftranstrfList[0].cust_acc_number === '') {
      this.td_deftranstrfList[0].cust_name = null;
      this.td_deftranstrfList[0].clr_bal = null;
      return;
    }

    debugger;
    let temp_deposit_list: tm_deposit[] = [];
    let temp_deposit = new tm_deposit();

    temp_deposit.brn_cd = this.sys.BranchCode;
    temp_deposit.acc_num = this.td_deftranstrfList[0].cust_acc_number;
    temp_deposit.acc_type_cd = parseInt(this.td_deftranstrfList[0].cust_acc_type);

    this.isLoading = true;
    this.svc.addUpdDel<any>('Deposit/GetDeposit', temp_deposit).subscribe(
      res => {
        debugger;
        temp_deposit_list = res;
        this.isLoading = false;

        if (temp_deposit_list.length === 0) {
          this.HandleMessage(true, MessageType.Warning, 'Invalid Account Number in Transfer Details');
          this.td_deftranstrfList[0].cust_acc_number = null;
          return;
        }

        let temp_mm_cust = new mm_customer();
        temp_mm_cust = this.customerList.filter(c => c.cust_cd.toString() === temp_deposit_list[0].cust_cd.toString())[0];
        this.td_deftranstrfList[0].cust_name = temp_mm_cust.cust_name;
        this.td_deftranstrfList[0].clr_bal = temp_deposit_list[0].clr_bal;
      },
      err => {
        debugger;
        this.isLoading = false;
      }
    );
  }

  checkAndSetDebitAccType(tfrType: string, accType: string) {
    debugger;
    if (tfrType === 'cust_acc') {
      if (this.td_deftranstrfList[0].cust_acc_type === undefined
        || this.td_deftranstrfList[0].cust_acc_type === null
        || this.td_deftranstrfList[0].cust_acc_type === '') {
        this.td_deftranstrfList[0].cust_name = null;
        this.td_deftranstrfList[0].clr_bal = null;
        this.td_deftranstrfList[0].cust_acc_desc = null;
        this.td_deftranstrfList[0].cust_acc_number = null;
        return;
      }

      if (this.td_deftranstrfList[0].gl_acc_code === undefined
        || this.td_deftranstrfList[0].gl_acc_code === null
        || this.td_deftranstrfList[0].gl_acc_code === '') {
        let temp_acc_type = new mm_acc_type();
        temp_acc_type = this.accountTypeList.filter(x => x.acc_type_cd.toString()
          === accType.toString())[0];

        if (temp_acc_type === undefined || temp_acc_type === null) {
          this.td_deftranstrfList[0].cust_acc_type = null;
          this.HandleMessage(true, MessageType.Warning, 'Invalid Account Type');
          return;
        }
        else {
          this.td_deftranstrfList[0].cust_acc_desc = temp_acc_type.acc_type_desc;
        }
      }
      else {
        this.HandleMessage(true, MessageType.Warning, 'GL Code in Transfer Details is not Blank');
        this.td_deftranstrfList[0].cust_acc_type = null;
        return;
      }
    }

    if (tfrType === 'gl_acc') {
      if (this.td_deftranstrfList[0].gl_acc_code === undefined
        || this.td_deftranstrfList[0].gl_acc_code === null
        || this.td_deftranstrfList[0].gl_acc_code === '') {
        this.td_deftranstrfList[0].gl_acc_desc = null;
        return;
      }

      if (this.td_deftranstrfList[0].cust_acc_type === undefined
        || this.td_deftranstrfList[0].cust_acc_type === null
        || this.td_deftranstrfList[0].cust_acc_type === '') {
        if (this.acc_master === undefined || this.acc_master === null || this.acc_master.length === 0) {
          this.isLoading = true;
          let temp_acc_master = new m_acc_master();
          this.svc.addUpdDel<any>('Mst/GetAccountMaster', null).subscribe(
            res => {
              debugger;
              this.acc_master = res;
              this.isLoading = false;
              temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === this.td_deftranstrfList[0].gl_acc_code)[0];
              if (temp_acc_master === undefined || temp_acc_master === null) {
                this.td_deftranstrfList[0].gl_acc_desc = null;
                this.HandleMessage(true, MessageType.Warning, 'Invalid GL Code');
                return;
              }
              else {
                this.td_deftranstrfList[0].gl_acc_desc = temp_acc_master.acc_name;
              }
            },
            err => {
              debugger;
              this.isLoading = false;
            }
          )
        }
        else {
          let temp_acc_master = new m_acc_master();
          temp_acc_master = this.acc_master.filter(x => x.acc_cd.toString() === this.td_deftranstrfList[0].gl_acc_code)[0];
          if (temp_acc_master === undefined || temp_acc_master === null) {
            this.td_deftranstrfList[0].gl_acc_desc = null;
            this.HandleMessage(true, MessageType.Warning, 'Invalid GL Code');
            return;
          }
          else {
            this.td_deftranstrfList[0].gl_acc_desc = temp_acc_master.acc_name;
          }
        }
      }
      else {
        this.HandleMessage(true, MessageType.Warning, 'Account Type in Transfer Details is not blank');
        this.td_deftranstrfList[0].gl_acc_code = null;
        return;
      }
    }
  }

  checkDebitBalance(amount: number) {
    debugger;

    if (this.td_deftranstrfList[0].amount === undefined || this.td_deftranstrfList[0].amount === null) {
      return;
    }

    if ((this.td_deftranstrfList[0].cust_acc_number === undefined
      || this.td_deftranstrfList[0].cust_acc_number === null
      || this.td_deftranstrfList[0].cust_acc_number === '')
      && (this.td_deftranstrfList[0].gl_acc_code === undefined
        || this.td_deftranstrfList[0].gl_acc_code === null
        || this.td_deftranstrfList[0].gl_acc_code === '')) {
      this.HandleMessage(true, MessageType.Warning, 'Please enter Account Number or GL Code');
      this.td_deftranstrfList[0].amount = null;
      return;
    }

    // if (this.tm_deposit.prn_amt === undefined || this.tm_deposit.prn_amt === null) {
    //   this.HandleMessage(true, MessageType.Warning, 'Principal Amount is blank');
    //   this.td_deftranstrfList[0].amount = null;
    //   return;
    // }

    // if (this.tm_deposit.prn_amt.toString() !== amount.toString()) {
    //   this.HandleMessage(true, MessageType.Warning, 'Debit Amount is not matching with Principal Amount');
    //   this.td_deftranstrfList[0].amount = null;
    //   return;
    // }

    if (this.td_deftranstrfList[0].clr_bal === undefined
      || this.td_deftranstrfList[0].clr_bal === null) {
      this.td_deftranstrfList[0].clr_bal = 0;
    }

    if (this.td.trans_type_key.value === 'R' && parseInt(this.td_deftranstrfList[0].clr_bal.toString()) < parseInt(amount.toString())) {
      this.HandleMessage(true, MessageType.Warning, 'Insufficient Balance');
      this.td_deftranstrfList[0].amount = null;
      return;
    }

  }

  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
    // setTimeout(() => {
    //   this.showMsg = new ShowMessage();
    // }, 3000);
  }

  onBackClick() {
    this.router.navigate([this.sys.BankName + '/la']);
  }
  openModal(template: TemplateRef<any>) {
    this.msg.sendCommonAccountNum('9');
    this.modalRef = this.modalService.show(template);
  }  
}
export class DynamicSelect {
  key: any;
  Description: any;
}
