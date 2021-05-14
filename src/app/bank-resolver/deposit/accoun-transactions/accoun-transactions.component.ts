import { Router } from '@angular/router';
import { AccOpenDM } from './../../Models/deposit/AccOpenDM';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RestService, InAppMessageService } from 'src/app/_service';
import {
  MessageType, mm_acc_type, mm_customer,
  mm_operation, m_acc_master, ShowMessage, SystemValues,
  td_def_trans_trf, tm_deposit, tm_depositall
} from '../../Models';
import { tm_denomination_trans } from '../../Models/deposit/tm_denomination_trans';
import { DatePipe } from '@angular/common';
import { tm_transfer } from '../../Models/deposit/tm_transfer';
import { tt_denomination } from '../../Models/deposit/tt_denomination';
import { mm_constitution } from '../../Models/deposit/mm_constitution';
import Utils from 'src/app/_utility/utils';
import { p_gen_param } from '../../Models/p_gen_param';

@Component({
  selector: 'app-accoun-transactions',
  templateUrl: './accoun-transactions.component.html',
  styleUrls: ['./accoun-transactions.component.css'],
  providers: [DatePipe]
})
export class AccounTransactionsComponent implements OnInit {
  static constitutionList: mm_constitution[] = [];
  constructor(private svc: RestService, private msg: InAppMessageService,
    private frmBldr: FormBuilder, public datepipe: DatePipe, private router: Router) { }
  public static operations: mm_operation[] = [];
  operations: mm_operation[];
  unApprovedTransactionLst: td_def_trans_trf[] = [];
  disableOperation = true;
  AcctTypes: mm_operation[];
  transType: DynamicSelect;
  isLoading: boolean;
  sys = new SystemValues();
  accTransFrm: FormGroup;
  tdDefTransFrm: FormGroup;
  showTransMode = false;
  showTransactionDtl = false;
  hideOnClose = false;
  disableSave = true;
  get f() { return this.accTransFrm.controls; }
  get td() { return this.tdDefTransFrm.controls; }

  customerList: mm_customer[] = [];
  td_deftrans = new td_def_trans_trf();
  td_deftranstrfList: td_def_trans_trf[] = [];
  tm_transferList: tm_transfer[] = [];
  accountTypeList: mm_acc_type[] = [];
  acc_master: m_acc_master[] = [];
  tm_deposit = new tm_deposit();

  accNoEnteredForTransaction: tm_depositall;
  hideOnRenewal = false;
  showTranferType = true;
  showMsg: ShowMessage;
  showInstrumentDtl = false;
  tm_denominationList: tm_denomination_trans[] = [];
  denominationList: tt_denomination[] = [];
  // denominations = [
  //   { rupees: '2000', desc: 'Two Thousand (Rs.2000)' },
  //   { rupees: '500', desc: 'Five Hundred (Rs.500)' },
  //   { rupees: '100', desc: 'Hundred (Rs.100)' },
  //   { rupees: '50', desc: 'Fifty (Rs.50)' }];
  denominationGrandTotal = 0;

  ngOnInit(): void {
    this.isLoading = false;
    this.getOperationMaster();
    this.accTransFrm = this.frmBldr.group({
      acc_type_cd: [''],
      oprn_cd: [''],
      acct_num: ['']
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
      interest: ['']
    });


    /**
     * TODO Create form for getting account type and Account number
     * TODO Show Account info (tm_deposit)
     * TODO bind td_dep_trans to a form which will be active
     **/
    const td_deftranstrf: td_def_trans_trf[] = [];
    this.td_deftranstrfList = td_deftranstrf;
    let temp_deftranstrf = new td_def_trans_trf()
    this.td_deftranstrfList.push(temp_deftranstrf);
    this.getAccountTypeList();
    this.getCustomerList();
    this.GetUnapprovedDepTrans();
    this.getDenominationList();
    this.getConstitutionList();
  }

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

  getConstitutionList() {
    if (AccounTransactionsComponent.constitutionList.length > 0) {
      return;
    }

    AccounTransactionsComponent.constitutionList = [];
    this.svc.addUpdDel<any>('Mst/GetConstitution', null).subscribe(
      res => {
        // debugger;
        AccounTransactionsComponent.constitutionList = res;
      },
      err => { // debugger;
      }
    );
  }

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
  /** silently bring all the unapproved transaction
   * silently because it will be needed during save
   */
  private GetUnapprovedDepTrans(): void {
    const tdDepTrans = new td_def_trans_trf();
    tdDepTrans.brn_cd = this.sys.BranchCode; // localStorage.getItem('__brnCd');
    this.svc.addUpdDel<any>('Common/GetUnapprovedDepTrans', tdDepTrans).subscribe(
      res => {
        this.unApprovedTransactionLst = res;
      },
      err => { this.isLoading = false; }
    );
  }

  getCustomerList() {
    debugger;
    const cust = new mm_customer();
    cust.cust_cd = 0;
    cust.brn_cd = this.sys.BranchCode;

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
    else { this.isLoading = false; }
  }

  private getOperationMaster(): void {
    debugger;
    this.isLoading = true;
    if (undefined !== AccounTransactionsComponent.operations &&
      null !== AccounTransactionsComponent.operations &&
      AccounTransactionsComponent.operations.length > 0) {
      this.isLoading = false;
      this.AcctTypes = AccounTransactionsComponent.operations.filter(e => e.module_type === 'DEPOSIT')
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
          this.AcctTypes = AccounTransactionsComponent.operations.filter(e => e.module_type === 'DEPOSIT')
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
    this.msg.sendCommonTmDepositAll(null);
  }

  public onAccountNumTabOff(): void {
    debugger;
    this.f.oprn_cd.disable();
    this.disableOperation = true;
    this.showTranferType = true;
    // console.log('onAccountNumTabOff -' + this.f.acct_num.value);
    this.isLoading = true;
    this.showMsg = null;
    let acc = new tm_depositall();

    acc.acc_num = '' + this.f.acct_num.value;
    acc.acc_type_cd = +this.f.acc_type_cd.value;
    acc.brn_cd = this.sys.BranchCode;
    this.svc.addUpdDel<tm_depositall>('Deposit/GetDepositWithChild', acc).subscribe(
      res => {
        acc = res[0];
        if (undefined === acc) {
          this.HandleMessage(true, MessageType.Error,
            'Account number ' + this.f.acct_num.value + ' is not Valid/Present/Account Type doesnt match.');
          this.msg.sendCommonTmDepositAll(null);
        } else {
          this.disableOperation = false;
          this.accNoEnteredForTransaction = acc;
          this.msg.sendCommonTmDepositAll(acc);
          this.tdDefTransFrm.patchValue({
            acc_num: acc.acc_num,
          });
          this.f.oprn_cd.enable();
        }
        this.isLoading = false;
      },
      err => {
        this.f.oprn_cd.disable(); this.isLoading = false;
        console.log(err);
        this.msg.sendCommonTmDepositAll(null);
      }
    );
  }

  /* method fires on operation type change */
  public onOperationTypeChange(): void {
    this.HandleMessage(false);
    this.showTranferType = true;
    this.hideOnClose = false;
    this.hideOnRenewal = false;
    this.showTransactionDtl = true;
    this.showTransMode = false;
    this.accNoEnteredForTransaction.ShowClose = false;
    this.msg.sendCommonTmDepositAll(this.accNoEnteredForTransaction);
    // this.msg.sendShdowBalance(0);
    this.td.amount.setValue(null);

    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    this.transType = new DynamicSelect();
    if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
      this.transType.key = 'W';
      this.transType.Description = 'Withdrawl';
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key
      });
      this.showTransMode = true;
    } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
      this.transType.key = 'D';
      this.transType.Description = 'Deposit';
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key
      });

    } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close') {
      this.transType.key = 'W';
      this.transType.Description = 'Close';
      this.accNoEnteredForTransaction.ShowClose = true;
      // this.accNoEnteredForTransaction.acc_close_dt = new Date();
      this.msg.sendCommonTmDepositAll(this.accNoEnteredForTransaction);
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key,
        trans_mode: 'C',
      });
      this.hideOnClose = true;
    } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
      this.transType.key = 'D';
      const constitution = AccounTransactionsComponent.constitutionList.filter(e => e.constitution_cd
        === this.accNoEnteredForTransaction.constitution_cd)[0];
      this.transType.Description = 'Renewal';
      this.accNoEnteredForTransaction.ShowClose = true;
      this.hideOnRenewal = true;
      this.showTranferType = false;
      this.hideOnClose = true;
      // this.accNoEnteredForTransaction.acc_close_dt = new Date();
      console.log(this.accNoEnteredForTransaction);
      this.msg.sendCommonTmDepositAll(this.accNoEnteredForTransaction);
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key,
        trans_mode: 'R',
        constitution_cd: this.accNoEnteredForTransaction.constitution_cd,
        constitution_cd_desc: constitution.constitution_desc,
        cert_no: this.accNoEnteredForTransaction.cert_no,
        opening_dt: this.accNoEnteredForTransaction.mat_dt.toString().substr(0, 10),
        dep_period_y: this.accNoEnteredForTransaction.dep_period.split(';')[0].split('=')[1],
        dep_period_m: this.accNoEnteredForTransaction.dep_period.split(';')[1].split('=')[1],
        dep_period_d: this.accNoEnteredForTransaction.dep_period.split(';')[2].split('=')[1],
        amount: this.accNoEnteredForTransaction.prn_amt
          + this.accNoEnteredForTransaction.intt_amt
      });
      this.onDepositePeriodChange();
    } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'interest payment') {
      this.transType.key = 'D';
      this.transType.Description = 'Interest Payment';
      // this.accNoEnteredForTransaction.ShowClose = true;
      // this.hideOnRenewal = true;
      // this.hideOnClose = true;
      // this.accNoEnteredForTransaction.acc_close_dt = new Date();
      // this.msg.sendCommonTmDepositAll(this.accNoEnteredForTransaction);
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key,
        trans_mode: 'V',
        paid_to: 'SELF',
        particulars: 'BY INTEREST ' + this.td.acc_type_desc.value + ' A/C :' + this.f.acct_num.value
      });
    } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'rd installment') {
      this.transType.key = 'D';
      this.transType.Description = 'Deposit';
      // this.accNoEnteredForTransaction.ShowClose = true;
      // this.hideOnRenewal = true;
      this.hideOnClose = true;
      // this.accNoEnteredForTransaction.acc_close_dt = new Date();
      // this.msg.sendCommonTmDepositAll(this.accNoEnteredForTransaction);
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description,
        trans_type_key: this.transType.key
      });
    }
  }

  private enableSave(): void {
    // check all the rules to enable save
    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
      if (((+this.td.amount.value) <= 0)) {
        this.disableSave = true;
      } else {
        this.disableSave = false;
      }
    }
  }

  onDepositePeriodChange(): void {
    debugger;
    let matDt = 0;
    this.tdDefTransFrm.patchValue({
      mat_dt: ''
    });
    let d = Utils.convertStringToDt(this.td.opening_dt.value);
    if ((+this.td.dep_period_y.value) > 0) {
      matDt = d.setFullYear(d.getFullYear() + (+this.td.dep_period_y.value));
    }
    if ((+this.td.dep_period_m.value) > 0) {
      matDt = d.setMonth(d.getMonth() + (+this.td.dep_period_m.value));
    }
    if ((+this.td.dep_period_d.value) > 0) {
      matDt = d.setDate(d.getDate() + (+this.td.dep_period_d.value));
    }
    if (matDt > 0) {
      this.processInterest();
      this.tdDefTransFrm.patchValue({
        mat_dt: Utils.convertDtToString(new Date(matDt))
      });
    }
  }

  onTransModeChange(): void {
    const selectedTransMode = this.td.trans_mode.value;
    if ('Q' === selectedTransMode) {
      // check if cheque facility is available or not
      if (this.accNoEnteredForTransaction.cheque_facility_flag === 'N') {
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
          paid_to: 'SELF',
          particulars: 'TO CASH '
        });
      } else {
        this.tdDefTransFrm.patchValue({
          paid_to: 'SELF',
          particulars: 'TO TRANSFER '
        });
      }
    }

    if (this.td.trf_type.value === 'C') {
      this.addDenomination();
    }
  }

  private checkUnaprovedTransactionExixts(): boolean {
    const unapprovedTrans = this.unApprovedTransactionLst.filter(e => e.acc_num
      === this.td.acc_num.value)[0];

    if (undefined === unapprovedTrans || Object.keys(unapprovedTrans).length === 0) {
      return false;
    }
    return true;
  }

  onAmtChng(): void {
    this.HandleMessage(false);
    if ((+this.td.amount.value) < 0) {
      this.HandleMessage(true, MessageType.Error, 'Amount can not be negative.');
      this.td.amount.setValue('');
      return;
    }
    if (this.td.trans_type_key.value === 'W') {
      const tmDep = new tm_deposit();
      let shadowBalance = 0;
      const accTypeCd = +this.f.acc_type_cd.value;
      tmDep.acc_type_cd = accTypeCd;
      tmDep.brn_cd = this.sys.BranchCode;
      tmDep.acc_num = this.f.acct_num.value;
      this.svc.addUpdDel<any>('Deposit/GetShadowBalance', tmDep).subscribe(
        res => {
          debugger;
          if (undefined !== res && null !== res && !isNaN(+res)) {
            shadowBalance = res;
            if (shadowBalance - (+this.td.amount.value) < 0) {
              this.HandleMessage(true, MessageType.Error, 'Amount can not be withdrawn more than balanace amount in Account.');
              this.td.amount.setValue('');
              return;
            } else {
              let minBal = 0;
              if (this.accNoEnteredForTransaction.cheque_facility_flag === 'Y') { minBal = +this.sys.MinBalanceWithCheque; }
              else { minBal = +this.sys.MinBalanceWithOutCheque; }
              if (shadowBalance - (+this.td.amount.value) < minBal) {
                let c = confirm('Amount is less than minimum balance ' + minBal + '. Press Ok to continue, else Cancel');
                if (c) {
                  if (this.td.trans_type_key.value === 'W') {
                    this.msg.sendShdowBalance(-(+this.td.amount.value));
                  } else if (this.td.trans_type_key.value === 'D') {
                    this.msg.sendShdowBalance((+this.td.amount.value));
                  }
                } else {
                  this.td.amount.setValue('');
                }
                return;
              } else {
                // check this.td.trans_type_key === 'W' / 'D'
                this.msg.sendShdowBalance(-(+this.td.amount.value));
                // if (this.td.trans_type_key.value === 'W') {

                // } else if (this.td.trans_type_key.value === 'D') {

                // }
              }
            }
          }
        },
        err => {
          this.isLoading = false; console.log(err);
          this.HandleMessage(true, MessageType.Error, 'Balance in account can not be determined, Try again later.');
        }
      );
    } else {
      this.msg.sendShdowBalance((+this.td.amount.value));
    }

  }

  onAmtChngDuringRenewal(): void {
    debugger;
    this.showTranferType = false;
    this.HandleMessage(false);
    if ((+this.td.amount.value) <= 0) {
      this.HandleMessage(true, MessageType.Error, 'Amount can not be negative Or 0.');
      this.td.amount.setValue('');
      return;
    }
    if (this.td.trans_type_key.value === 'D') {
      const mat_amt = this.accNoEnteredForTransaction.prn_amt
        + this.accNoEnteredForTransaction.intt_amt;

      if ((mat_amt - (+this.td.amount.value)) > 0) {
        // open transfer area
        this.showTranferType = true;
      } else if (((+this.td.amount.value) - mat_amt) > 0) {
        // close transfer area
        this.HandleMessage(true, MessageType.Error, 'Amount can not be greater than maturity amount.');
        this.td.amount.setValue('');
        return;
      }
    }
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
    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    const saveTransaction = new AccOpenDM();
    const tdDefTrans = this.mappTddefTransFromFrm();
    if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
      saveTransaction.tmdepositrenew = this.mapRenewData();
    }
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
    this.svc.addUpdDel<AccOpenDM>('Deposit/InsertAccountOpeningData', saveTransaction).subscribe(
      res => {
        debugger;
        this.HandleMessage(true, MessageType.Sucess, 'Saved sucessfully, your transaction code is -' + res);
        // this.tdDefTransFrm.reset();
        // this.accTransFrm.reset();
        this.isLoading = false;
      },
      err => { this.isLoading = false; console.error('Error on onSaveClick' + JSON.stringify(err)); debugger; }
    );
  }

  mappTddefTransFromFrm(): td_def_trans_trf {
    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    const toReturn = new td_def_trans_trf();
    const accTypeCd = +this.f.acc_type_cd.value;
    // toReturn.trans_dt = new Date(this.convertDate(localStorage.getItem('__currentDate')) + ' UTC');
    toReturn.trans_dt = this.sys.CurrentDate;
    toReturn.acc_type_cd = this.td.acc_type_cd.value;
    toReturn.acc_num = this.td.acc_num.value;
    toReturn.trans_type = this.td.trans_type_key.value;
    toReturn.trans_mode = this.td.trans_mode.value;
    toReturn.paid_to = this.td.paid_to.value;
    toReturn.token_num = this.td.token_num.value;
    toReturn.trf_type = this.td.trf_type.value;

    if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'close') {
      toReturn.amount = this.accNoEnteredForTransaction.prn_amt;
      toReturn.curr_intt_recov = this.accNoEnteredForTransaction.intt_amt;
    } else {
      if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal') {
        toReturn.amount = +this.td.interest.value;
      } else {
        toReturn.amount = +this.td.amount.value;
      }
    }
    toReturn.instrument_num = this.td.instrument_num.value === '' ? 0 : +this.td.instrument_num.value;
    toReturn.instrument_dt = this.td.instrument_dt.value === '' ? null : this.td.instrument_dt.value;
    if (selectedOperation.oprn_desc.toLocaleLowerCase() !== 'close') {
      if (accTypeCd === 2
        || accTypeCd === 3
        || accTypeCd === 4
        || accTypeCd === 5) {
        toReturn.particulars = this.td.particulars.value;
      } else {
        if (this.td.trf_type.value === 'T') {
          toReturn.particulars = 'BY TRANSFER TO ' + this.td.particulars.value + ':' + this.td.acc_num.value;
        } else if (this.td.trf_type.value === 'C') {
          toReturn.particulars = 'BY CASH';
        }
      }
    } else {
      if (this.td.trf_type.value === 'T') {
        toReturn.particulars = 'BY TRANSFER TO ' + this.td.particulars.value + ':' + this.td.acc_num.value;
      } else if (this.td.trf_type.value === 'C') {
        toReturn.particulars = 'BY CASH';
      }
    }
    if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal'
      && this.td.trf_type.value === '') {
      toReturn.trans_type = 'T';
    }
    toReturn.approval_status = 'U';
    toReturn.brn_cd = this.sys.BranchCode;

    if (this.td.trf_type.value === 'T') {
      toReturn.tr_acc_cd = 10000;
    } else if (this.td.trf_type.value === 'C') {
      toReturn.tr_acc_cd = 28101;
    }
    // if ((+this.f.acc_type_cd.value) === 2) {
    //   toReturn.acc_cd = 14301;
    // }
    // if ((+this.f.acc_type_cd.value) === 6) {
    //   toReturn.acc_cd = 14302;
    // }
    if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'renewal'){
      toReturn.curr_prn_recov = ((+this.td.amount.value) + (+this.td.interest.value));
      toReturn.ovd_prn_recov = this.accNoEnteredForTransaction.prn_amt;
      toReturn.curr_intt_recov = this.accNoEnteredForTransaction.intt_amt;
      toReturn.ovd_intt_recov = 0;
    }

    toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd;
    toReturn.disb_id = 1;
    toReturn.created_by = this.sys.UserId;

    return toReturn;
  }

  mapRenewData(): tm_deposit {

    const toReturn = new tm_deposit();
    // Year=0;Month=0;Day=313
    const depPrd = 'Year=' + (this.td.dep_period_y.value === '' ? '0' : this.td.dep_period_y.value) +
      ';Month=' + (this.td.dep_period_m.value === '' ? '0' : this.td.dep_period_m.value) +
      ';Day=' + (this.td.dep_period_d.value === '' ? '0' : this.td.dep_period_d.value);

    toReturn.brn_cd = this.accNoEnteredForTransaction.brn_cd;
    toReturn.acc_type_cd = this.accNoEnteredForTransaction.acc_type_cd;
    toReturn.acc_num = this.accNoEnteredForTransaction.acc_num;
    toReturn.renew_id = this.accNoEnteredForTransaction.renew_id;
    toReturn.cust_cd = this.accNoEnteredForTransaction.cust_cd;
    toReturn.intt_trf_type = this.td.intt_trf_type.value;
    toReturn.constitution_cd = (+this.td.constitution_cd.value);
    toReturn.oprn_instr_cd = this.accNoEnteredForTransaction.oprn_instr_cd;
    toReturn.opening_dt = Utils.convertStringToDt(this.td.opening_dt.value);
    toReturn.prn_amt = (+this.td.amount.value);
    toReturn.intt_amt = (+this.td.interest.value);
    toReturn.dep_period = depPrd;
    toReturn.instl_amt = this.accNoEnteredForTransaction.instl_amt;
    toReturn.instl_no = this.accNoEnteredForTransaction.instl_no;
    toReturn.mat_dt = Utils.convertStringToDt(this.td.mat_dt.value);
    toReturn.intt_rt = (+this.td.intt_rate.value);
    toReturn.tds_applicable = this.accNoEnteredForTransaction.tds_applicable;
    toReturn.last_intt_calc_dt = this.accNoEnteredForTransaction.last_intt_calc_dt;
    // toReturn.acc_close_dt = this.accNoEnteredForTransaction.acc_close_dt;
    // toReturn.closing_prn_amt = this.accNoEnteredForTransaction.closing_prn_amt;
    // toReturn.closing_intt_amt = this.accNoEnteredForTransaction.closing_intt_amt;
    // toReturn.penal_amt = this.accNoEnteredForTransaction.penal_amt;
    // toReturn.ext_instl_tot = this.accNoEnteredForTransaction.ext_instl_tot;
    // toReturn.mat_status = this.accNoEnteredForTransaction.mat_status;
    // toReturn.acc_status = this.accNoEnteredForTransaction.acc_status;
    // toReturn.curr_bal = this.accNoEnteredForTransaction.curr_bal;
    // toReturn.clr_bal = this.accNoEnteredForTransaction.clr_bal;
    toReturn.standing_instr_flag = this.accNoEnteredForTransaction.standing_instr_flag;
    toReturn.cheque_facility_flag = this.accNoEnteredForTransaction.cheque_facility_flag;
    toReturn.approval_status = this.accNoEnteredForTransaction.approval_status;
    toReturn.approved_by = this.accNoEnteredForTransaction.approved_by;
    toReturn.approved_dt = this.accNoEnteredForTransaction.approved_dt;
    toReturn.user_acc_num = this.accNoEnteredForTransaction.user_acc_num;
    // toReturn.lock_mode = this.accNoEnteredForTransaction.lock_mode;
    // toReturn.loan_id = this.accNoEnteredForTransaction.loan_id;
    // toReturn.cert_no = this.td.cert_no.value;
    // toReturn.bonus_amt = this.accNoEnteredForTransaction.bonus_amt;
    // toReturn.penal_intt_rt = this.accNoEnteredForTransaction.penal_intt_rt;
    // toReturn.bonus_intt_rt = this.accNoEnteredForTransaction.bonus_intt_rt;
    // toReturn.transfer_flag = this.accNoEnteredForTransaction.transfer_flag;
    // toReturn.transfer_dt = this.accNoEnteredForTransaction.transfer_dt;
    toReturn.agent_cd = this.accNoEnteredForTransaction.agent_cd;
    toReturn.cust_name = this.accNoEnteredForTransaction.cust_name;
    toReturn.cust_type = this.accNoEnteredForTransaction.cust_type;
    toReturn.sex = this.accNoEnteredForTransaction.sex;
    toReturn.phone = this.accNoEnteredForTransaction.phone;
    toReturn.occupation = this.accNoEnteredForTransaction.occupation;
    toReturn.created_by = this.sys.UserId;
    toReturn.modified_by = this.sys.UserId;
    toReturn.constitution_desc = this.accNoEnteredForTransaction.constitution_desc;
    toReturn.acc_cd = this.accNoEnteredForTransaction.acc_cd;

    return toReturn;
  }

  // mapDenominationToTmdenominationtrans(): void {

  // }

  onResetClick(): void {
    this.accTransFrm.reset();
    this.tdDefTransFrm.reset();
    // this.getOperationMaster();
    this.f.oprn_cd.disable();
    this.f.acct_num.disable();
    this.msg.sendCommonTmDepositAll(null);
    this.tm_denominationList = [];
    this.td_deftranstrfList = [];

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

    if (parseInt(this.td_deftranstrfList[0].clr_bal.toString()) < parseInt(amount.toString())) {
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
}
export class DynamicSelect {
  key: any;
  Description: any;
}
