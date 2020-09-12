import {
  mm_title, mm_category, mm_state, mm_dist, mm_vill,
  mm_kyc, mm_service_area, mm_block, mm_customer, ShowMessage, MessageType
} from './../../Models';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestService } from 'src/app/_service';

@Component({
  selector: 'app-utcustomer-profile',
  templateUrl: './utcustomer-profile.component.html',
  styleUrls: ['./utcustomer-profile.component.css']
})
export class UTCustomerProfileComponent implements OnInit {
  constructor(private frmBldr: FormBuilder,
    // tslint:disable-next-line:align
    private svc: RestService) { }
  get f() { return this.custMstrFrm.controls; }
  static existingCustomers: mm_customer[] = [];

  retrieveClicked = false;
  selectedCustomer: mm_customer;
  enableModifyAndDel = false;
  showMsg: ShowMessage;
  isLoading = false;
  suggestedCustomer: mm_customer[];
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
      cust_name: ['', { disabled: true }],
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
      block_cd: ['', { disabled: true }],
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

  private getTitleMaster(): void {
    this.svc.addUpdDel<mm_title[]>('Mst/GetTitleMaster', null).subscribe(
      res => {
        this.titles = res;
      },
      err => { }
    );
  }

  private getCategoryMaster(): void {
    this.svc.addUpdDel<mm_category[]>('Mst/GetCategoryMaster', null).subscribe(
      res => {
        this.categories = res;
      },
      err => { }
    );
  }

  private getStateMaster(): void {
    this.svc.addUpdDel<mm_state[]>('Mst/GetStateMaster', null).subscribe(
      res => {
        this.states = res;
      },
      err => { }
    );
  }

  private getDistMaster(): void {
    this.svc.addUpdDel<mm_dist[]>('Mst/GetDistMaster', null).subscribe(
      res => {
        this.districts = res;
      },
      err => { }
    );
  }

  private getVillageMaster(): void {
    this.svc.addUpdDel<mm_vill[]>('Mst/GetVillageMaster', null).subscribe(
      res => {
        this.villages = res;
      },
      err => { }
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
      err => { }
    );
  }

  private getServiceAreaMaster(): void {
    this.svc.addUpdDel<mm_service_area[]>('Mst/GetServiceAreaMaster', null).subscribe(
      res => {
        this.serviceAreas = res;
      },
      err => { }
    );
  }

  private getKYCTypMaster(): void {
    this.svc.addUpdDel<mm_kyc[]>('Mst/GetKycMaster', null).subscribe(
      res => {
        this.KYCTypes = res;
      },
      err => { }
    );
  }

  public onNameChange(): void {
    debugger;
    let cust_name = this.f.first_name.value + ' ' + this.f.middle_name.value + ' ' + this.f.last_name.value;
    this.custMstrFrm.patchValue({
      cust_name: cust_name
    });
  }

  public onRetrieveClick(): void {
    this.retrieveClicked = true;
    this.onClearClick();
    this.custMstrFrm.disable();
    this.f.cust_name.enable();
    if (undefined !== UTCustomerProfileComponent.existingCustomers &&
      null !== UTCustomerProfileComponent.existingCustomers &&
      UTCustomerProfileComponent.existingCustomers.length > 0) {
    } else {
      // this.cust_name.nativeElement.focus();
      this.isLoading = true;
      const cust = new mm_customer(); cust.cust_cd = 0;
      this.svc.addUpdDel<any>('UCIC/GetCustomerDtls', cust).subscribe(
        res => {
          UTCustomerProfileComponent.existingCustomers = res;
          this.isLoading = false;
        },
        err => { this.isLoading = false; }
      );
    }
  }

  public suggestCustomer(): void {
    debugger;
    this.suggestedCustomer = UTCustomerProfileComponent.existingCustomers
      .filter(c => c.cust_name.toLowerCase().startsWith(this.f.cust_name.value.toLowerCase()))
      .slice(0, 20);
  }

  public SelectCustomer(cust: mm_customer): void {
    this.selectedCustomer = cust;
    this.onClearClick();
    this.enableModifyAndDel = true;
    this.suggestedCustomer = null;
    this.custMstrFrm.patchValue({
      brn_cd: cust.brn_cd,
      cust_cd: cust.cust_cd,
      cust_type: cust.cust_type,
      title: cust.title,
      first_name: cust.first_name,
      middle_name: cust.middle_name,
      last_name: cust.last_name,
      cust_name: cust.cust_name,
      guardian_name: cust.guardian_name,
      cust_dt: cust.cust_dt,
      old_cust_cd: cust.old_cust_cd,
      dt_of_birth: new Date(cust.dt_of_birth),
      age: cust.age,
      sex: cust.sex,
      marital_status: cust.marital_status,
      catg_cd: cust.catg_cd,
      community: cust.community,
      caste: cust.caste,
      permanent_address: cust.permanent_address,
      ward_no: cust.ward_no,
      state: cust.state,
      dist: cust.dist,
      pin: cust.pin,
      vill_cd: cust.vill_cd,
      block_cd: cust.block_cd,
      service_area_cd: cust.service_area_cd,
      occupation: cust.occupation,
      phone: cust.phone,
      present_address: cust.present_address,
      farmer_type: cust.farmer_type,
      email: cust.email,
      monthly_income: cust.monthly_income,
      date_of_death: cust.date_of_death,
      sms_flag: cust.sms_flag,
      status: cust.status,
      pan: cust.pan,
      nominee: cust.nominee,
      nom_relation: cust.nom_relation,
      kyc_photo_type: cust.kyc_photo_type,
      kyc_photo_no: cust.kyc_photo_no,
      kyc_address_type: cust.kyc_address_type,
      kyc_address_no: cust.kyc_address_no,
      org_status: cust.org_status,
      org_reg_no: cust.org_reg_no
    });
  }

  public onNewClick(): void {
    this.onClearClick();
  }

  public onSaveClick(): void {
    debugger;
    this.isLoading = true;
    const cust = this.mapFormGrpToCustMaster();
    this.svc.addUpdDel<any>('UCIC/InsertCustomerDtls', cust).subscribe(
      res => {
        this.custMstrFrm.patchValue({
          cust_cd: res
        });
        cust.cust_cd = res;
        if (this.retrieveClicked){
        // add this cust details in the list of existing cutomer
        // this will ensure, retrieve wont be needed every time
        UTCustomerProfileComponent.existingCustomers.push(cust);
        }
        this.HandleMessage(true, MessageType.Sucess,
          cust.cust_cd + ', Customer created sucessfully');
        this.isLoading = false;
      },
      err => { this.isLoading = false; }
    );
  }

  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
  public onDelClick(): void {
    // delete the selected customer
    this.isLoading = true;
    // const cust = this.mapFormGrpToCustMaster();
    this.svc.addUpdDel<any>('UCIC/DeleteCustomerDtls', this.selectedCustomer).subscribe(
      res => {
        this.isLoading = false;
        if (this.retrieveClicked){
          // delete this cust details from the list of existing cutomer
          // this will ensure, retrieve wont be needed every time
          UTCustomerProfileComponent.existingCustomers =
            UTCustomerProfileComponent.existingCustomers.filter(o => o.cust_cd !== this.selectedCustomer.cust_cd);
          }
        this.HandleMessage(true, MessageType.Sucess,
          this.selectedCustomer.cust_cd + ', Customer Deleted sucessfully')
      },
      err => { this.isLoading = false; }
    );
  }

  public onClearClick(): void {
    this.custMstrFrm.reset();
    this.showMsg = null;
    this.enableModifyAndDel = false;
    this.custMstrFrm.enable();
    this.f.cust_name.disable();
    this.f.service_area_cd.disable();
    this.f.block_cd.disable();
  }

  mapFormGrpToCustMaster(): mm_customer {
    const cust = new mm_customer();
    try {
      cust.brn_cd = '101'; // TODO need to get this from session
      cust.cust_cd = (null === this.f.cust_cd.value || '' === this.f.cust_cd.value)
        ? 0 : +this.f.cust_cd.value;
      cust.cust_type = this.f.cust_type.value;
      cust.title = this.f.title.value;
      cust.first_name = this.f.first_name.value;
      cust.middle_name = this.f.middle_name.value;
      cust.last_name = this.f.last_name.value;
      cust.cust_name = this.f.cust_name.value;
      cust.guardian_name = this.f.guardian_name.value;
      cust.cust_dt = '' === this.f.cust_dt.value ? null : this.f.cust_dt.value;
      cust.old_cust_cd = this.f.old_cust_cd.value;
      cust.dt_of_birth = this.f.dt_of_birth.value;
      cust.age = +this.f.age.value;
      cust.sex = this.f.sex.value;
      cust.marital_status = this.f.marital_status.value;
      cust.catg_cd = +this.f.catg_cd.value;
      cust.community = +this.f.community.value;
      cust.caste = +this.f.caste.value;
      cust.permanent_address = this.f.permanent_address.value;
      cust.ward_no = +this.f.ward_no.value;
      cust.state = this.f.state.value;
      cust.dist = this.f.dist.value;
      cust.pin = +this.f.pin.value;
      cust.vill_cd = this.f.vill_cd.value;
      // during modification if village is not changed then block code & service area code
      // needs to be taken from selected customer
      cust.block_cd = (undefined === this.selectedBlock) ?
        this.selectedCustomer.block_cd : this.selectedBlock.block_cd;
      cust.service_area_cd = (undefined === this.selectedServiceArea) ?
        this.selectedCustomer.service_area_cd : this.selectedServiceArea.service_area_cd;
      cust.occupation = this.f.occupation.value;
      cust.phone = this.f.phone.value;
      cust.present_address = this.f.present_address.value;
      cust.farmer_type = this.f.farmer_type.value;
      cust.email = this.f.email.value;
      cust.monthly_income = +this.f.monthly_income.value;
      cust.date_of_death = ('' === this.f.date_of_death.value) ?
        null : this.f.date_of_death.value;
      cust.sms_flag = this.f.sms_flag.value;
      cust.status = this.f.status.value;
      cust.pan = this.f.pan.value;
      cust.nominee = this.f.nominee.value;
      cust.nom_relation = this.f.nom_relation.value;
      cust.kyc_photo_type = this.f.kyc_photo_type.value;
      cust.kyc_photo_no = this.f.kyc_photo_no.value;
      cust.kyc_address_type = this.f.kyc_address_type.value;
      cust.kyc_address_no = this.f.kyc_address_no.value;
      cust.org_status = this.f.org_status.value;
      cust.org_reg_no = +this.f.org_reg_no.value;
    }catch (error) {
      console.error(error);
      this.HandleMessage(true, MessageType.Warning, error);
      // expected output: ReferenceError: nonExistentFunction is not defined
      // Note - error messages will vary depending on browser
    }

    return cust;
  }

  public onModifyClick(): void {
    this.showMsg = null;
    this.isLoading = true;
    const cust = this.mapFormGrpToCustMaster();
    this.svc.addUpdDel<any>('UCIC/UpdateCustomerDtls', cust).subscribe(
      res => {
        this.HandleMessage(true, MessageType.Sucess,
          cust.cust_cd + ', Customer updated sucessfully');
        this.isLoading = false;
      },
      err => { this.isLoading = false; }
    );
  }
}
