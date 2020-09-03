import { mm_title, mm_category, mm_state, mm_dist, mm_vill,
  mm_kyc, mm_service_area, mm_block } from './../../Models';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from 'src/app/_service';

@Component({
  selector: 'app-utcustomer-profile',
  templateUrl: './utcustomer-profile.component.html',
  styleUrls: ['./utcustomer-profile.component.css']
})
export class UTCustomerProfileComponent implements OnInit {

  titles: mm_title[] = [];
  KYCTypes: mm_kyc[] = [];
  blocks: mm_block[] = [];
  serviceAreas: mm_service_area[] = [];
  villages: mm_vill[] = [];
  states: mm_state[] = [];
  districts: mm_dist[] = [];
  categories: mm_category[] = [];
  custMstrFrm: FormGroup;
  /* possible values of operation
    New, Retrieve, Modify, delete
    We will use to globally set operation of the page
  */
  operation: string;
  selectedBlock: mm_block;
  selectedServiceArea: mm_service_area;
  constructor(private frmBldr: FormBuilder,
    // tslint:disable-next-line:align
    private svc: RestService) { }

  ngOnInit(): void {
    this.operation = 'New';
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
    this.getTitleMaster();
    this.getCategoryMaster();
    this.getStateMaster();
    this.getDistMaster();
    this.getVillageMaster();
    this.getKYCTypMaster();
    this.getBlockMster();
    this.getServiceAreaMaster();
  }
  get f() { return this.custMstrFrm.controls; }
  private getTitleMaster(): void {
    this.svc.addUpdDel<mm_title[]>('Mst/GetTitleMaster', null).subscribe(
      res => {
        this.titles = res;
      },
      err => {}
    );
  }
  private getCategoryMaster(): void {
    this.svc.addUpdDel<mm_category[]>('Mst/GetCategoryMaster', null).subscribe(
      res => {
        this.categories = res;
      },
      err => {}
    );
  }
  private getStateMaster(): void {
    this.svc.addUpdDel<mm_state[]>('Mst/GetStateMaster', null).subscribe(
      res => {
        this.states = res;
      },
      err => {}
    );
  }
  private getDistMaster(): void {
    this.svc.addUpdDel<mm_dist[]>('Mst/GetDistMaster', null).subscribe(
      res => {
        this.districts = res;
      },
      err => {}
    );
  }
  private getVillageMaster(): void {
    this.svc.addUpdDel<mm_vill[]>('Mst/GetVillageMaster', null).subscribe(
      res => {
        this.villages = res;
      },
      err => {}
    );
  }

  onVillageChnage(vill_cd: string): void {
    // add logic to select block and area.
    const selectedVillage = this.villages.filter(e => e.vill_cd === vill_cd)[0];
    this.selectedBlock = this.blocks.filter(e => e.block_cd ===
      selectedVillage.block_cd)[0];
    this.selectedServiceArea = this.serviceAreas.filter(e => e.service_area_cd ===
        selectedVillage.service_area_cd)[0];
    this.custMstrFrm.patchValue({
      service_area_cd: this.selectedServiceArea.service_area_name,
      block_cd: this.selectedBlock.block_name
    });
  }
  private getBlockMster(): void {
    this.svc.addUpdDel<mm_block[]>('Mst/GetBlockMaster', null).subscribe(
      res => {
        this.blocks = res;
      },
      err => {}
    );
  }
  private getServiceAreaMaster(): void {
    this.svc.addUpdDel<mm_service_area[]>('Mst/GetServiceAreaMaster', null).subscribe(
      res => {
        this.serviceAreas = res;
      },
      err => {}
    );
  }
  private getKYCTypMaster(): void {
    this.svc.addUpdDel<mm_kyc[]>('Mst/GetKycMaster', null).subscribe(
      res => {
        this.KYCTypes = res;
      },
      err => {}
    );
  }
}
