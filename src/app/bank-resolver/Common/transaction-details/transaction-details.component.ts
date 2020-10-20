import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InAppMessageService, RestService } from 'src/app/_service';
import { td_def_trans_trf } from '../../Models';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit, OnDestroy {

  constructor(private frmBldr: FormBuilder, private svc: RestService,
    private msg: InAppMessageService) {
    this.subscription = this.msg.getCommonTransactionInfo().subscribe(
      res => {
        debugger;
        this.transactionDtl = res;
        this.setTransactionDtl();
      },
      err => { }
    );
  }

  subscription: Subscription;
  isLoading = false;
  show = false;
  transactionDtl: td_def_trans_trf;
  transactionDtlsFrm: FormGroup;

  ngOnInit(): void {
    this.show = true;
    this.transactionDtlsFrm = this.frmBldr.group({
      trans_dt: [''],
      trans_cd: [''],
      acc_type_cd: [''],
      acc_num: [''],
      trans_type: [''],
      trans_mode: [''],
      amount: [''],
      instrument_dt: [''],
      instrument_num: [''],
      paid_to: [''],
      token_num: [''],
      created_by: [''],
      created_dt: [''],
      modified_by: [''],
      modified_dt: [''],
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
      numbert_till_dt: [''],
      acc_name: [''],
      brn_cd: [''],
    });
  }

  setTransactionDtl(): void {
    if (undefined !== this.transactionDtl && null !== this.transactionDtl) {
      this.transactionDtlsFrm.patchValue({
        trans_dt: this.transactionDtl.trans_dt,
        trans_cd: this.transactionDtl.trans_cd,
        acc_type_cd: this.transactionDtl.acc_type_cd,
        acc_num: this.transactionDtl.acc_num,
        trans_type: this.transactionDtl.trans_type,
        trans_mode: this.transactionDtl.trans_mode,
        amount: this.transactionDtl.amount,
        instrument_dt: this.transactionDtl.instrument_dt,
        instrument_num: this.transactionDtl.instrument_num,
        paid_to: this.transactionDtl.paid_to,
        token_num: this.transactionDtl.token_num,
        approval_status: this.transactionDtl.approval_status,
        approved_by: this.transactionDtl.approved_by,
        approved_dt: this.transactionDtl.approved_dt,
        particulars: this.transactionDtl.particulars,
        tr_acc_type_cd: this.transactionDtl.tr_acc_type_cd,
        tr_acc_num: this.transactionDtl.tr_acc_num,
        voucher_dt: this.transactionDtl.voucher_dt,
        voucher_id: this.transactionDtl.voucher_id,
        trf_type: this.transactionDtl.trf_type,
        tr_acc_cd: this.transactionDtl.tr_acc_cd,
        acc_cd: this.transactionDtl.acc_cd,
        share_amt: this.transactionDtl.share_amt,
        sum_assured: this.transactionDtl.sum_assured,
        paid_amt: this.transactionDtl.paid_amt,
        curr_prn_recov: this.transactionDtl.curr_prn_recov,
        ovd_prn_recov: this.transactionDtl.ovd_prn_recov,
        curr_numbert_recov: this.transactionDtl.curr_intt_recov,
        ovd_numbert_recov: this.transactionDtl.ovd_intt_recov,
        remarks: this.transactionDtl.remarks,
        crop_cd: this.transactionDtl.crop_cd,
        activity_cd: this.transactionDtl.activity_cd,
        curr_numbert_rate: this.transactionDtl.curr_intt_rate,
        ovd_numbert_rate: this.transactionDtl.ovd_intt_rate,
        instl_no: this.transactionDtl.instl_no,
        instl_start_dt: this.transactionDtl.instl_start_dt,
        periodicity: this.transactionDtl.periodicity,
        disb_id: this.transactionDtl.disb_id,
        comp_unit_no: this.transactionDtl.comp_unit_no,
        ongoing_unit_no: this.transactionDtl.ongoing_unit_no,
        mis_advance_recov: this.transactionDtl.mis_advance_recov,
        audit_fees_recov: this.transactionDtl.audit_fees_recov,
        sector_cd: this.transactionDtl.sector_cd,
        spl_prog_cd: this.transactionDtl.spl_prog_cd,
        borrower_cr_cd: this.transactionDtl.borrower_cr_cd,
        numbert_till_dt: this.transactionDtl.intt_till_dt,
        acc_name: this.transactionDtl.acc_name,
        brn_cd: this.transactionDtl.brn_cd,
      });
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
