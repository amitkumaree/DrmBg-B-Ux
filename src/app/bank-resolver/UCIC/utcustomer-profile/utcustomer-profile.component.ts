import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-utcustomer-profile',
  templateUrl: './utcustomer-profile.component.html',
  styleUrls: ['./utcustomer-profile.component.css']
})
export class UTCustomerProfileComponent implements OnInit {

  custMstrFrm: FormGroup;
  constructor(private frmBldr: FormBuilder) { }

  ngOnInit(): void {
    // form defination
    this.custMstrFrm = this.frmBldr.group({
        brn_cd: [''],
        cust_cd: [''],
        cust_type: ['', Validators.required],
        title: [''],
        first_name: ['', Validators.required],
        middle_name: [''],
        last_name: [''],
        cust_name: ['', {disabled: true}],
        guardian_name: ['', Validators.required],
        cust_dt: [''],
        old_cust_cd: [''],
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
        block_cd: ['', {disabled: true}],
        service_area_cd: [''],
        occupation: [''],
        phone: [''],
        present_address: [''],
        farmer_type: [''],
        email: [''],
        monthly_income: [''],
        date_of_death: [''],
        sms_flag: [''],
        status: [''],
        pan: [''],
        nominee: [''],
        nom_relation: [''],
        kyc_photo_type: [''],
        kyc_photo_no: [''],
        kyc_address_type: [''],
        kyc_address_no: [''],
        org_status: [''],
        org_reg_no: ['']
      });
  }

}
