import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgAutoCompleteModule } from "ng-auto-complete";
import { RestService } from 'src/app/_service';
import { T_VOUCHER_DTLS, m_acc_master } from '../../Models';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent implements OnInit {

  tvd = new T_VOUCHER_DTLS();
  tvdRet: T_VOUCHER_DTLS[] = [];
  tvn = new T_VOUCHER_DTLS();
  tvnRet: T_VOUCHER_DTLS[] = [];
  tvnRetFilter: T_VOUCHER_DTLS[] = [];
  maccmaster: m_acc_master[] = [];
  maccmasterRet: m_acc_master[] = [];
  keyword = 'acc_name';
  tvdGroupRes: any;
  reportcriteria: FormGroup;
  closeResult = '';
  alertMsg = '';
  showAlert = false;
  onVoucherCreation: FormGroup;
  VoucherF: FormArray;
  _voucherId: any;
  _voucherDt: any;
  _voucherTyp: any;
  _approvalSts: any;
  _totalCr: number = 0;
  _totalDr: number = 0;
  _voucherNarration: string = '';
  insertMode = false;
  app_flg: any;
  isDel = true;
  isAddNew = true;
  isRetrieve = true;
  isRetrieveBatch = true;
  isNew = true;
  isRemove = true;
  isSave = true;
  isApprove = true;
  isClear = false;
  isLoading = true;
  constructor(private svc: RestService, private formBuilder: FormBuilder, private modalService: NgbModal) { }
  @ViewChild('content', { static: true }) content: TemplateRef<any>;
  @ViewChild('contentbatch', { static: true }) contentbatch: TemplateRef<any>;

  ngOnInit(): void {
    this.reportcriteria = this.formBuilder.group({
      fromDate: [null, Validators.required],
      voucherNo: [null, Validators.compose([Validators.required, Validators.pattern('^[0-9]+$')])]
    });

    this.onVoucherCreation = this.formBuilder.group({
      'VoucherF': this.formBuilder.array([
        this.addVoucherFromGroup()
      ])
    });
    debugger;
    this.isRetrieve = false;
    this.isRetrieveBatch = false;
    this.isNew = false;
    this.getmAccMaster();
  }
  Initialize() {
    debugger;
    this.insertMode = false;
    this._voucherId = null;
    this._voucherDt = null;
    this._voucherTyp = null;
    this._approvalSts = null;
    this._totalCr = 0;
    this._totalDr = 0;
    this._voucherNarration = '';
    try {
      let VoucherFCnt = this.VoucherF.value.length;
      for (var i = 0; i < VoucherFCnt; i++) {
        this.RemoveItem(0);
      }
    }
    catch (exception) { let x = 0; }

    //this.Add();

    // this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
    // this.VoucherF.push(this.editVoucherFromGroup(this.tvdRet[x].acc_cd,this.tvdRet[x].debit_credit_flag,this.tvdRet[x].cr_amount,this.tvdRet[x].dr_amount));
  }
  InitializeListOnly() {
    try {
      let VoucherFCnt = this.VoucherF.value.length;
      for (var i = 0; i < VoucherFCnt; i++) {
        this.RemoveItem(0);
      }
    }
    catch (exception) { let x = 0; }
  }

  Retrieve() {
    this.Initialize();
    this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    },
      (reason) => {
        this.closeResult = 'Dismissed ${this.getDismissReason(reason)}';
      });
  }
  RetrieveBatch() {
    this.app_flg = 'U';
    this.Initialize();
    this.isLoading=true;
    this.getVoucherNarration();
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  AddNew() {
    this.Add();
  }
  New() {
    this.isDel = false;
    this.isAddNew = false;
    this.isRetrieve = true;
    this.isRetrieveBatch = true;
    this.isNew = true;
    this.isRemove = true;
    this.isSave = false;
    this.isApprove = true;
    this.isClear = false;
    this.Initialize();
    this._voucherDt = new Date(localStorage.getItem('__currentDate'));//TBD
    this._voucherTyp = "C";
    this.insertMode = true;
  }
  Remove() {

  }
  Approve() {
    this.UpdateVoucher();

  }
  Submit() {
    debugger;
    if (this.reportcriteria.invalid) {
      this.showAlert = true;
      this.alertMsg = "Invalid Input.";
      return false;
    }
    else
    {
      this.isLoading = true;
      this.getVoucher(this.reportcriteria.value['fromDate'], this.reportcriteria.value['voucherNo']);
    }
  }

  Clear() {
    this.Initialize();
    this.isDel = true;
    this.isAddNew = true;
    this.isRetrieve = false;
    this.isRetrieveBatch = false;
    this.isNew = false;
    this.isRemove = true;
    this.isSave = true;
    this.isApprove = true;
    this.isClear = false;
  }
  Save() {
    debugger;
    this.showAlert = false;
    let isAccCDBlank = false;
    if (this._voucherNarration == null || this._voucherNarration == '') {
      this.showAlert = true;
      this.alertMsg = "Narration can not be blank !"
    }
    else if (this.getTotalDr() == 0) {
      this.showAlert = true;
      this.alertMsg = "Debit Amount Can not be Zero !"
    }
    else if (this.getTotalCr() == 0) {
      this.showAlert = true;
      this.alertMsg = "Credit Amount Can not be Zero !"
    }
    else if (this.getTotalCr() != this.getTotalDr()) {
      this.showAlert = true;
      this.alertMsg = "Debit and Credit Amount must be equal !"
    }

    else {
      for (let x = 0; x < this.VoucherF.length; x++) {
        if (this.voucherData.value[x].acc_cd == null || this.voucherData.value[x].acc_cd == '') {
          isAccCDBlank = true;
          break;
        }
      }
      if (isAccCDBlank) {
        this.showAlert = true;
        this.alertMsg = "Account Code Can not be Blank !"
      }
      else {
        this.InsertVoucher();
      }
    }
  }
  OpenVoucher(item) {
    debugger;
    this.Initialize();
    this.getVoucherDtl(localStorage.getItem('__brnCd'), item.voucher_dt, item.voucher_id, item.narrationdtl)
  }
  closeAlert() {
    this.showAlert = false;
  }
  get voucherData() { return <FormArray>this.onVoucherCreation.get('VoucherF'); }

  addVoucherFromGroup(): FormGroup {
    return this.formBuilder.group({
      'dr_cr': [null, Validators.compose([Validators.required])],
      'acc_cd': [null, Validators.compose([Validators.required])],
      'desc': [null, null],
      'cr_amt': [null, null],
      'dr_amt': [null, null]
    });
  }

  editVoucherFromGroup(acc_cd: number, dr_cr: string, cr_amount: number, dr_amount: number): FormGroup {
    let accNames = this.maccmaster.filter(function (el) { return (el.acc_cd === acc_cd); }).map(function (el) { return el.acc_name; }).sort();
    return this.formBuilder.group({
      'dr_cr': [dr_cr, Validators.compose([Validators.required])],
      'acc_cd': [acc_cd, Validators.compose([Validators.required])],
      'desc': [accNames, null],
      'cr_amt': [cr_amount, null],
      'dr_amt': [dr_amount, null]
    });
  }

  Add() {
    this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
    this.VoucherF.push(this.addVoucherFromGroup());
  }
  RemoveItem(deleteindex: number): void {
    (<FormArray>this.onVoucherCreation.get('VoucherF')).removeAt(deleteindex);
  }

  selectEvent(item, i) {
    // do something with selected item
    debugger;
    try {
      this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
      this.VoucherF.controls[i].get('acc_cd').setValue(item.acc_cd);
    }
    catch (exception) { let x = 0; }
  }

  onChangeSearch(search, i) {
    // do something with selected item
  }
  onChange(event) {
    debugger;
   
    this._voucherTyp = event;
    if (this._voucherTyp=='T'){
    this.InitializeListOnly();
    this.maccmaster=this.maccmasterRet.filter(x=>x.acc_cd!=28101);}
    else if (this._voucherTyp=='C'){
    this.InitializeListOnly();
    this.Add()
    this.maccmaster=this.maccmasterRet.filter(x=>x.acc_cd!=28101);
    this.VoucherF.controls[0].get('acc_cd').setValue(28101);
    this.VoucherF.controls[0].get('desc').setValue(this.maccmasterRet.find(x=>x.acc_cd===28101).acc_name);
    }
    else{
      this.InitializeListOnly();
      this.maccmaster=this.maccmasterRet;}
  }
  changeAppFlg() {
    debugger;
    this.tvnRetFilter = [];
    this.tvnRetFilter = this.tvnRet.filter(x => x.approval_status == this.app_flg);
  }

  onFocused(e) {
    // do something
  }

  private getVoucher(vDt: any, vID: any): void {
    this.tvd = new T_VOUCHER_DTLS();
    this.tvd.brn_cd = localStorage.getItem('__brnCd');
    this.tvd.voucher_dt = vDt;
    this.tvd.voucher_id = Number(vID);
    this.tvdRet = [];
    debugger;
    this.svc.addUpdDel<any>('Voucher/GetTVoucherDtls', this.tvd).subscribe(
      res => {
        debugger;
        this.tvdRet = res;
        this.tvdGroupRes = this.groupBy(this.tvdRet, function (item) {
          return [item.transaction_type, item.voucher_id, item.voucher_dt, item.approval_status];
        });

        for (let x = 0; x < this.tvdRet.length; x++) {
          this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
          this.VoucherF.push(this.editVoucherFromGroup(this.tvdRet[x].acc_cd, this.tvdRet[x].debit_credit_flag=='D'?'Debit':'Credit', this.tvdRet[x].cr_amount, this.tvdRet[x].dr_amount));
        }
        if (this.VoucherF.value.length > 0)
          if (this.VoucherF.value[0].acc_cd == null)
            this.RemoveItem(0);
        this._voucherId = this.tvdRet[0].voucher_id;
        this._voucherDt = this.tvdRet[0].voucher_dt;
        this._voucherTyp = this.tvdRet[0].transaction_type == "C" ? "Cash" : this.tvdRet[0].transaction_type == "L" ? "Clearing" : "Transfer";
        this._approvalSts = this.tvdRet[0].approval_status == "A" ? "Approved" : "Unapproved";
        this._totalCr = 0;
        this._totalDr = 0;
        if (this.tvdRet[0].approval_status == 'U')
          this.isApprove = false;
        this._voucherNarration = this.tvdRet[0].narrationdtl;//this.tvdRet[0].narration+
        this.isLoading = false;
        this.modalService.dismissAll(this.content);
      },
      err => { }
    );
  }
  private getVoucherDtl(brncd: any, voudt: any, vouid: any, narr: any): void {
    this.tvd = new T_VOUCHER_DTLS();
    this.tvd.brn_cd = brncd;
    this.tvd.voucher_dt = voudt;
    this.tvd.voucher_id = vouid;
    this.tvdRet = [];
    debugger;
    this.svc.addUpdDel<any>('Voucher/GetTVoucherDtls', this.tvd).subscribe(
      res => {
        debugger;
        this.tvdRet = res;
        for (let x = 0; x < this.tvdRet.length; x++) {
          this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
          this.VoucherF.push(this.editVoucherFromGroup(this.tvdRet[x].acc_cd, this.tvdRet[x].debit_credit_flag, this.tvdRet[x].cr_amount, this.tvdRet[x].dr_amount));
        }
        if (this.VoucherF.value.length > 0)
          if (this.VoucherF.value[0].acc_cd == null)
            this.RemoveItem(0);
        this._voucherId = this.tvdRet[0].voucher_id;
        this._voucherDt = this.tvdRet[0].voucher_dt;
        this._voucherTyp = this.tvdRet[0].transaction_type == "C" ? "Cash" : this.tvdRet[0].transaction_type == "L" ? "Clearing" : "Transfer";
        this._approvalSts = this.tvdRet[0].approval_status == "A" ? "Approved" : "Unapproved";
        this._totalCr = 0;
        this._totalDr = 0;
        this._voucherNarration = narr;
        if (this.tvdRet[0].approval_status == 'U')
          this.isApprove = false;
        this.modalService.dismissAll(this.content);
      },
      err => { }
    );
  }
  private getVoucherNarration(): void {
    this.tvn.brn_cd =  localStorage.getItem('__brnCd');
    this.tvn.voucher_dt = new Date(localStorage.getItem('__currentDate'));
    debugger;
    this.svc.addUpdDel<any>('Voucher/GetTVoucherNarration', this.tvn).subscribe(
      res => {
        debugger;
        this.tvnRet = res;
        this.tvnRetFilter = this.tvnRet.filter(x => x.approval_status == this.app_flg);
        this.isLoading=false;
        this.modalService.open(this.contentbatch, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: 'static' }).result.then((result) => {
        },
          (reason) => {
            this.closeResult = 'Dismissed ${this.getDismissReason(reason)}';
          });
      },
      err => { }
    );
  }

  private InsertVoucher(): void {
    try {
      let tvdSaveAll: T_VOUCHER_DTLS[] = [];
      for (let x = 0; x < this.VoucherF.length; x++) {
        let tvdSave = new T_VOUCHER_DTLS();
        tvdSave.approval_status = 'U';
        tvdSave.brn_cd =  localStorage.getItem('__brnCd');
        tvdSave.cr_amount = Number(this.voucherData.value[x].cr_amt == null ? 0 : this.voucherData.value[x].cr_amt);
        tvdSave.dr_amount = Number(this.voucherData.value[x].dr_amt == null ? 0 : this.voucherData.value[x].dr_amt);
        tvdSave.debit_credit_flag = this.voucherData.value[x].dr_cr=='Debit'? 'D' : 'C';
        tvdSave.narrationdtl = this._voucherNarration;
        tvdSave.transaction_type = this._voucherTyp;
        tvdSave.voucher_dt = this._voucherDt;
        tvdSave.acc_cd = this.voucherData.value[x].acc_cd;
        tvdSave.amount = Number(tvdSave.cr_amount == 0 ? tvdSave.dr_amount : tvdSave.cr_amount);
        tvdSaveAll.push(tvdSave);
      }
      debugger;
      this.svc.addUpdDel<any>('Voucher/InsertTVoucherDtls', tvdSaveAll).subscribe(
        res => {
          debugger;
          this._voucherId = res;
          this._approvalSts = "Unapproved";
          this.insertMode = false;
          this.isDel = true;
          this.isAddNew = true;
          this.isRetrieve = false;
          this.isRetrieveBatch = false;
          this.isNew = false;
          this.isRemove = true;
          this.isSave = true;
          this.isApprove = true;
          this.isClear = false;
        },
        err => { }
      );
    }
    catch (exception) { let x = 0; }
  }

  private UpdateVoucher(): void {
    try {
      let tvdSaveAll: T_VOUCHER_DTLS[] = [];
      for (let x = 0; x < this.VoucherF.length; x++) {
        let tvdSave = new T_VOUCHER_DTLS();
        tvdSave.approval_status = 'A';
        tvdSave.brn_cd =  localStorage.getItem('__brnCd');
        tvdSave.approved_by = 'ADMIN'
        tvdSave.approved_dt = new Date();
        tvdSave.voucher_dt = this._voucherDt;
        tvdSave.voucher_id = this._voucherId;//Merge
        tvdSave.acc_cd = this.voucherData.value[x].acc_cd;
        tvdSave.narrationdtl = this._voucherNarration;
        tvdSaveAll.push(tvdSave);
      }
      debugger;
      this.svc.addUpdDel<any>('Voucher/UpdateTVoucherDtls', tvdSaveAll).subscribe(
        res => {
          debugger;
          let x = res;
          this._voucherDt = this._voucherDt
          this._voucherTyp = "C";
          this._approvalSts = "Approved";
          this.insertMode = true;
          this.isDel = true;
          this.isAddNew = true;
          this.isRetrieve = false;
          this.isRetrieveBatch = false;
          this.isNew = false;
          this.isRemove = true;
          this.isSave = true;
          this.isApprove = true;
          this.isClear = false;
        },
        err => { }
      );
    }
    catch (exception) { let x = 0; }
  }
  public getTotalCr() {
    let total = 0;
    try {
      for (var i = 0; i < this.VoucherF.value.length; i++) {
        if (this.VoucherF.value[i].cr_amt > 0) {
          total = total + Number(this.VoucherF.value[i].cr_amt);
          this._totalCr = total;
        }
      }
    }
    catch (exception) { return 0; }
    return Math.round((total + Number.EPSILON) * 100) / 100;
  }
  public getTotalDr() {
    let total = 0;
    try {
      for (var i = 0; i < this.VoucherF.value.length; i++) {
        if (this.VoucherF.value[i].dr_amt > 0) {
          total = total + Number(this.VoucherF.value[i].dr_amt);
          //this._totalDr = total;
        }
      }
    }
    catch (exception) {
      return 0;
    }
    return Math.round((total + Number.EPSILON) * 100) / 100;
  }

  public drAmountInput(row, event) {
    this.showAlert = false;
    if (this.voucherData.value[row].acc_cd == null || this.voucherData.value[row].acc_cd == '') {
      this.showAlert = true;
      this.VoucherF.controls[row].get('dr_amt').setValue(null);
      this.VoucherF.controls[row].get('cr_amt').setValue(null);
      this.alertMsg = "Account Code Can not be Blank !"
      return;
    }
   try {
      debugger;
      if (this.VoucherF.controls[row].get('dr_amt').value > 0) {
        this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
        this.VoucherF.controls[row].get('dr_cr').setValue("Debit");
        this.VoucherF.controls[row].get('cr_amt').setValue(null);
        if(this._voucherTyp=='C')
        {
          this.VoucherF.controls[0].get('dr_amt').setValue(null);
          this.VoucherF.controls[0].get('dr_cr').setValue("Credit");
          debugger;
          this.VoucherF.controls[0].get('cr_amt').setValue(this.getTotalDr());

        }
      }
    }
    catch (exception) { let x = 0; }
  }
  public crAmountInput(row, event) {
    this.showAlert = false;
    if (this.voucherData.value[row].acc_cd == null || this.voucherData.value[row].acc_cd == '') {
      this.showAlert = true;
      this.VoucherF.controls[row].get('dr_amt').setValue(null);
      this.VoucherF.controls[row].get('cr_amt').setValue(null);
      this.alertMsg = "Account Code Can not be Blank !"
      return;
    }
    try {
      debugger;
      if (this.VoucherF.controls[row].get('cr_amt').value > 0) {
        this.VoucherF = this.onVoucherCreation.get('VoucherF') as FormArray;
        this.VoucherF.controls[row].get('dr_cr').setValue("Credit");
        this.VoucherF.controls[row].get('dr_amt').setValue(null);
        if(this._voucherTyp=='C')
        {
          this.VoucherF.controls[0].get('cr_amt').setValue(null);
          this.VoucherF.controls[0].get('dr_cr').setValue("Debit");
          debugger;
          this.VoucherF.controls[0].get('dr_amt').setValue(this.getTotalCr());

        }
      }
    }
    catch (exception) { let x = 0; }
  }
  public groupBy(array, f) {
    let groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      f.transaction_type, f.voucher_dt, f.voucher_id, f.approval_status
      return groups[group];
    })
  }

  private getmAccMaster(): void {
    debugger;
    this.svc.addUpdDel<any>('Mst/GetAccountMaster', null).subscribe(
      res => {
        debugger;
        this.maccmasterRet = res;
        this.maccmaster=this.maccmasterRet;
      },
      err => { }
    );
  }

}
