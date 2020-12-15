import { AccOpenDM } from './../../Models/deposit/AccOpenDM';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RestService, InAppMessageService } from 'src/app/_service';
import { MessageType, mm_acc_type, mm_operation, ShowMessage, td_def_trans_trf, tm_depositall } from '../../Models';
import { tm_denomination_trans } from '../../Models/deposit/tm_denomination_trans';

@Component({
  selector: 'app-accoun-transactions',
  templateUrl: './accoun-transactions.component.html',
  styleUrls: ['./accoun-transactions.component.css']
})
export class AccounTransactionsComponent implements OnInit {

  constructor(private svc: RestService, private msg: InAppMessageService, private frmBldr: FormBuilder) { }
  private static operations: mm_operation[] = [];
  operations: mm_operation[];
  AcctTypes: mm_operation[];
  transType: DynamicSelect;
  isLoading: boolean;
  accTransFrm: FormGroup;
  tdDefTransFrm: FormGroup;
  get f() { return this.accTransFrm.controls; }
  get td() { return this.tdDefTransFrm.controls; }
  showMsg: ShowMessage;
  showInstrumentDtl = false;
  tm_denominationList : tm_denomination_trans[] = [];
  denominations = [
    { rupees: '2000', desc: 'Two Thousand (Rs.2000)' },
    { rupees: '500' , desc: 'Five Hundred (Rs.500)' },
    { rupees: '100' , desc: 'Hundred (Rs.100)' },
    { rupees: '50'  , desc: 'Fifty (Rs.50)' }];
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
      trf_type_desc: ['']
    });

    /**
     * TODO Create form for getting account type and Account number
     * TODO Show Account info (tm_deposit)
     * TODO bind td_dep_trans to a form which will be active
     **/
  }

  private getOperationMaster(): void {
    this.isLoading = true;
    if (undefined !== AccounTransactionsComponent.operations &&
      null !== AccounTransactionsComponent.operations &&
      AccounTransactionsComponent.operations.length > 0) {
      this.isLoading = false;
      this.AcctTypes = AccounTransactionsComponent.operations.filter(e => e.module_type === 'DEPOSIT')
        .filter((thing, i, arr) => {
          return arr.indexOf(arr.find(t => t.acc_type_cd === thing.acc_type_cd)) === i;
        });
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
        },
        err => { this.isLoading = false; }
      );
    }
  }

  /** method fires on account type change */
  public onAcctChange(): void {
    const acctTypCdTofilter = +this.f.acc_type_cd.value;
    const acctTypeDesription = AccounTransactionsComponent.operations
    .filter(e => e.acc_type_cd === acctTypCdTofilter)[0].acc_type_desc;
    this.tdDefTransFrm.patchValue({
      acc_type_desc: acctTypeDesription,
      acc_type_cd: acctTypCdTofilter
      });
    this.operations = AccounTransactionsComponent.operations
      .filter(e => e.acc_type_cd === acctTypCdTofilter);
  }

  /* method fires on operation type change */
  public onOperationTypeChange(): void {
    debugger;
    const selectedOperation = this.operations.filter(e => e.oprn_cd === +this.f.oprn_cd.value)[0];
    this.transType = new DynamicSelect();
    if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'withdraw') {
      this.transType.key = 'W';
      this.transType.Description = 'Withdrawl';
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description
      });
    } else if (selectedOperation.oprn_desc.toLocaleLowerCase() === 'deposit') {
      this.transType.key = 'D';
      this.transType.Description = 'Deposit';
      this.tdDefTransFrm.patchValue({
        trans_type: this.transType.Description
      });
    }
  }

  onTransModeChange(): void {
    const selectedTransMode = this.td.trans_mode.value;
    if ('Q' === selectedTransMode) {
      this.showInstrumentDtl = true;
    } else {
      this.showInstrumentDtl = false;
    }
  }

  public onAccountNumTabOff(): void {
    debugger;
    console.log('onAccountNumTabOff -' + this.f.acct_num.value);
    this.isLoading = false;
    this.showMsg = null;
    let acc = new tm_depositall();

    acc.acc_num = '' + this.f.acct_num.value;
    acc.acc_type_cd = +this.f.acc_type_cd.value;
    acc.brn_cd = localStorage.getItem('__brnCd');
    this.svc.addUpdDel<tm_depositall>('Deposit/GetDepositWithChild', acc).subscribe(
      res => {
        debugger;
        acc = res[0];
        if (undefined === acc) {
          this.HandleMessage(true, MessageType.Error,
            'Account number ' + this.f.acct_num.value + ' is not Valid/Present.');
          this.msg.sendCommonTmDepositAll(null);
        } else {
          // TODO check if the acctype given matcches or else throw error, or send acct type while calling
          this.msg.sendCommonTmDepositAll(acc);
          this.tdDefTransFrm.patchValue({
            acc_num: acc.acc_num,
            });
          this.isLoading = false;
        }
      },
      err => { this.isLoading = false; console.log(err); }
    );
  }

  onSaveClick(): void {
    debugger;
    this.isLoading = true;
    const saveTransaction = new AccOpenDM();
    saveTransaction.tddeftrans = this.mappTddefTransFromFrm();
    this.svc.addUpdDel<AccOpenDM>('Deposit/InsertAccountOpeningData', saveTransaction).subscribe(
      res => {
        debugger;
        this.isLoading = false;
      },
      err => { this.isLoading = false; console.log('Error on onSaveClick' + err);  }
    );
  }

  mappTddefTransFromFrm(): td_def_trans_trf {
    const toReturn = new td_def_trans_trf();
    toReturn.trans_dt = new Date(this.convertDate(localStorage.getItem('__currentDate')) + ' UTC');
    toReturn.acc_type_cd = this.td.acc_type_cd.value;
    toReturn.acc_num = this.td.acc_num.value;
    toReturn.trans_type = this.td.trans_type.value;
    toReturn.trans_mode = this.td.trans_mode.value;
    toReturn.trans_type = this.td.trans_type.value;
    toReturn.paid_to = this.td.paid_to.value;
    toReturn.token_num = this.td.token_num.value;
    toReturn.amount = +this.td.amount.value;
    toReturn.instrument_num = this.td.instrument_num.value === '' ? 0 : +this.td.instrument_num.value;
    toReturn.instrument_dt = this.td.instrument_dt.value === '' ? null : this.td.instrument_dt.value;
    toReturn.particulars = this.td.particulars.value;
    toReturn.approval_status = 'U';
    toReturn.brn_cd = localStorage.getItem('__brnCd');

    return toReturn;
  }
  onResetClick(): void {
    this.accTransFrm.reset();
    this.tdDefTransFrm.reset();
    // this.getOperationMaster();
    this.msg.sendCommonTmDepositAll(new tm_depositall());
  }
  private  convertDate(datestring: string): Date {
    const parts = datestring.match(/(\d+)/g);
    return new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0]));
  }​​​​​
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
    setTimeout(() => {
      this.showMsg = new ShowMessage();
    }, 3000);
  }
}
export class DynamicSelect {
  key: any;
  Description: any;
}
