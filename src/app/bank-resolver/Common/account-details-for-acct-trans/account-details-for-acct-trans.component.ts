import { tm_depositall } from './../../Models';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InAppMessageService, RestService } from 'src/app/_service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-account-details-for-acct-trans',
  templateUrl: './account-details-for-acct-trans.component.html',
  styleUrls: ['./account-details-for-acct-trans.component.css']
})
export class AccountDetailsForAcctTransComponent implements OnInit, OnDestroy {

  constructor(private frmBldr: FormBuilder, private svc: RestService,
    private msg: InAppMessageService) {
    this.subscription = this.msg.getCommonTmDepositAll().subscribe(
      res => {
        if (null !== res) {
          this.acctDtls = res;
          this.setAcctDetails();
        }
      },
      err => { }
    );
  }
  subscription: Subscription;
  acctDtls: tm_depositall;
  isLoading = false;
  show = false;
  accDtlsFrm: FormGroup;
  ngOnInit(): void {
    this.show = true;
    this.accDtlsFrm = this.frmBldr.group({
      brn_cd: [''],
      acc_type_cd: [''],
      acc_num: [''],
      renew_id: [''],
      cust_cd: [''],
      intt_trf_type: [''],
      constitution_cd: [''],
      oprn_instr_cd: [''],
      opening_dt: [''],
      prn_amt: [''],
      intt_amt: [''],
      dep_period: [''],
      instl_amt: [''],
      instl_no: [''],
      mat_dt: [''],
      intt_rt: [''],
      tds_applicable: [''],
      last_intt_calc_dt: [''],
      acc_close_dt: [''],
      closing_prn_amt: [''],
      closing_intt_amt: [''],
      penal_amt: [''],
      ext_instl_tot: [''],
      mat_status: [''],
      acc_status: [''],
      curr_bal: [''],
      clr_bal: [''],
      standing_instr_flag: [''],
      cheque_facility_flag: [''],
      created_by: [''],
      created_dt: [''],
      modified_by: [''],
      modified_dt: [''],
      approval_status: [''],
      approved_by: [''],
      approved_dt: [''],
      user_acc_num: [''],
      lock_mode: [''],
      loan_id: [''],
      cert_no: [''],
      bonus_amt: [''],
      penal_intt_rt: [''],
      bonus_intt_rt: [''],
      transfer_flag: [''],
      transfer_dt: [''],
      agent_cd: [''],
      cust_type: [''],
      title: [''],
      first_name: [''],
      middle_name: [''],
      last_name: [''],
      cust_name: [''],
      guardian_name: [''],
      cust_dt: [''],
      dt_of_birth: [''],
      age: [''],
      sex: [''],
      marital_status: [''],
      catg_cd: [''],
      community: [''],
      caste: [''],
      permanent_address: [''],
      ward_no: [''],
      state: [''],
      dist: [''],
      pin: [''],
      vill_cd: [''],
      block_cd: [''],
      service_area_cd: [''],
      occupation: [''],
      phone: [''],
      present_address: [''],
      constitution_desc: ['']
    });
  }

  setAcctDetails(): void {
    if (undefined !== this.acctDtls && Object.keys(this.acctDtls).length !== 0) {
      this.accDtlsFrm.patchValue({
        brn_cd: this.acctDtls.brn_cd,
        acc_type_cd: this.acctDtls.acc_type_cd,
        acc_num: this.acctDtls.acc_num,
        renew_id: this.acctDtls.renew_id,
        cust_cd: this.acctDtls.cust_cd,
        cust_name: this.acctDtls.cust_name,
        intt_trf_type: this.acctDtls.intt_trf_type,
        constitution_cd: this.acctDtls.constitution_cd,
        oprn_instr_cd: this.acctDtls.oprn_instr_cd,
        opening_dt: formatDate(this.acctDtls.opening_dt, 'dd/MMM/yyyy', 'en-US'),
        prn_amt: this.acctDtls.prn_amt,
        intt_amt: this.acctDtls.intt_amt,
        dep_period: this.acctDtls.dep_period,
        instl_amt: this.acctDtls.instl_amt,
        instl_no: this.acctDtls.instl_no,
        mat_dt: this.acctDtls.mat_dt,
        intt_rt: this.acctDtls.intt_rt,
        tds_applicable: this.acctDtls.tds_applicable,
        last_intt_calc_dt: this.acctDtls.last_intt_calc_dt,
        acc_close_dt: this.acctDtls.acc_close_dt,
        closing_prn_amt: this.acctDtls.closing_prn_amt,
        closing_intt_amt: this.acctDtls.closing_intt_amt,
        penal_amt: this.acctDtls.penal_amt,
        ext_instl_tot: this.acctDtls.ext_instl_tot,
        mat_status: this.acctDtls.mat_status,
        acc_status: this.acctDtls.acc_status,
        curr_bal: this.acctDtls.curr_bal,
        clr_bal: this.acctDtls.clr_bal,
        standing_instr_flag: this.acctDtls.standing_instr_flag,
        cheque_facility_flag: this.acctDtls.cheque_facility_flag,
        approval_status: this.acctDtls.approval_status,
        approved_by: this.acctDtls.approved_by,
        approved_dt: this.acctDtls.approved_dt,
        user_acc_num: this.acctDtls.user_acc_num,
        lock_mode: this.acctDtls.lock_mode,
        loan_id: this.acctDtls.loan_id,
        cert_no: this.acctDtls.cert_no,
        bonus_amt: this.acctDtls.bonus_amt,
        penal_intt_rt: this.acctDtls.penal_intt_rt,
        bonus_intt_rt: this.acctDtls.bonus_intt_rt,
        transfer_flag: this.acctDtls.transfer_flag,
        transfer_dt: this.acctDtls.transfer_dt,
        agent_cd: this.acctDtls.agent_cd,
      });
    } else { this.accDtlsFrm.reset(); }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
