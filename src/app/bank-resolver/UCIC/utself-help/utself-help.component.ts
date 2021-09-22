import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { RestService } from 'src/app/_service';
import { MessageType, mm_vill, ShowMessage, SystemValues } from '../../Models';
import { mm_shg } from '../../Models/mm_shg';
import { mm_shg_member } from '../../Models/mm_shg_member';
import { ShgDM } from '../../Models/ShgDM';

@Component({
  selector: 'app-utself-help',
  templateUrl: './utself-help.component.html',
  styleUrls: ['./utself-help.component.css']
})
export class UTSelfHelpComponent implements OnInit {

  constructor(private svc: RestService, private frmBldr: FormBuilder, private modalService: BsModalService,
              private router: Router) { }
  get f() { return this.shgFrm.controls; }
  shgFrm: FormGroup;
  branchCode = '0';
  userName = '';
  sys = new SystemValues();
  isLoading = false;
  showMsg: ShowMessage;
  mmshg = new mm_shg();
  mmshgmember: mm_shg_member[] = [];
  villageList: mm_vill[] = [];
  shgRet = new ShgDM();
  isRetrieve = true;
  ngOnInit(): void {
    this.branchCode = this.sys.BranchCode;
    this.userName = this.sys.UserId;
    this.getVillageMaster();
    this.shgFrm = this.frmBldr.group({
     shg_id : [],
     brn_cd : [],
     chairman_name : [],
     secretary_name : [],
     village : [],
     gruop_sex : [],
      monthly_subcription : [],
      min_member_limit : [],
      male_member : [],
      female_member : [],
      caste_sc : [],
      caste_st : [],
      caste_gen : [],
      caste_muslim : [],
     form_dt : [],
     sb_accno : []
    });
    this.shgFrm.controls.shg_id.disable();
    // this.onShgMemberCreation = this.formBuilder.group({
    //   'ShgMemberF': this.formBuilder.array([
    //     this.addshgMemberFromGroup()
    //   ])
    // });
  }

  // addshgMemberFromGroup(): FormGroup
  // return this.formBuilder.group({
  //  shg_id : [null, null],
  //  shg_member_id : [null, null],
  //  shg_member_name : [null, null],
  //  guardian_name : [null, null],
  //  shg_member_sex : [null, null],
  //  shg_member_caste : [null, null],
  //  religion : [null, null],
  //  date_of_join : [null, null],
  //  education : [null, null],
  //  brn_cd : [null, null],
  //  status : [null, null],
  //  date_of_birth : [null, null],
  //  age : [null, null],
  //  widow : [null, null],
  //  toilet_flag : [null, null],
  //  mobile : [null, null],
  //  adhar_no : [null, null],
  //  pan : [null, null],
  //  disability_remarks : [null, null],
  //  training_remarks : [null, null]
  //   });
 
  setShgMemberGroupSex(gender: string)
  {
    // this.neftPayRet.payment_type = accType;
  }
  setShgMemberSex(gender: string)
  {
    // this.neftPayRet.payment_type = accType;
  }
  setShgMemberCaste(caste: string)
  {
    // this.neftPayRet.payment_type = accType;
  }
  setShgMemberReligion(religion: string)
  {
    // this.neftPayRet.payment_type = accType;
  }
  setShgMemberEducation(education: string)
  {
    // this.neftPayRet.payment_type = accType;
  }
  setShgMemberWidow(widow: string)
  {
    // this.neftPayRet.payment_type = accType;
  }
  setShgMemberToilet(toilet: string)
  {
    // this.neftPayRet.payment_type = accType;
  }
  setVillage(vilcd: any)
  {}
  addShgMember()
  {
    const alreadyHasEmptyDenominationItem = false;
    // if (this.mmshgmember.length >= 1) {
      // check if tm_denominationList has any blank items
    //   this.tm_denominationList.forEach(element => {
    //     if (!alreadyHasEmptyDenominationItem) {
    //       if (undefined === element.rupees
    //         || undefined === element.count
    //         || undefined === element.total) { alreadyHasEmptyDenominationItem = true; }
    //     }
    //   });
    // }
    if (alreadyHasEmptyDenominationItem) { return; }

    const temp_mmshgmember = new mm_shg_member();
    temp_mmshgmember.brn_cd = localStorage.getItem('__brnCd');
    temp_mmshgmember.shg_id = 0;
    this.mmshgmember.push(temp_mmshgmember);
  }
  removeShgMember()
  {
    if (this.mmshgmember.length >= 1) {
      if(this.mmshgmember[this.mmshgmember.length-1].shg_member_id>0)
      {
      if (!(confirm('Are you sure you want to Delete The Transaction '))) {
        return;
      }
      }
      this.mmshgmember.pop();
    }
  }
  retrieveData(){
   // this.isRetrieve = false;
    this.shgFrm.reset();
    // this.shgFrm.controls.shg_id.disable();
    this.shgFrm.disable();
    this.mmshgmember= null;
    this.shgFrm.controls.shg_id.enable();
    debugger;
  }
  clearData(){
    this.shgFrm.reset();
    this.shgFrm.enable();
    this.shgFrm.controls.shg_id.disable();
    this.mmshgmember= null;
    //this.isRetrieve = true;
  }
  saveData(){
    debugger;
    if (this.f.chairman_name.value == null || this.f.chairman_name.value === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Chairman Name not be Blank');
      return;
    }
    else if (this.f.secretary_name.value == null || this.f.secretary_name.value === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Secretary Name Can not be Blank');
      return;
    }
    else if (this.f.village.value == null || this.f.village.value === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Village Name Can not be Blank');
      return;
    }
    else if (this.f.gruop_sex.value == null || this.f.gruop_sex.value === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Gender Group Can not be Blank');
      return;
    }
    else if (this.f.monthly_subcription.value == 0 || this.f.monthly_subcription.value === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Monthly Subcription Can not be 0');
      return;
    }
    else if (this.f.min_member_limit.value == 0 || this.f.min_member_limit.value === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Minimum Member limit Can not be 0');
      return;
    }
    else if (this.f.min_member_limit.value < (this.f.male_member.value+ this.f.female_member.value)) {
      this.HandleMessage(true, MessageType.Error, 'Minimum member limiy can not be less');
      return;
    }
    else if (this.f.sb_accno.value == null || this.f.sb_accno.value === 'undefined') {
      this.HandleMessage(true, MessageType.Error, 'Savings A/C Can not be Blank');
      return;
    }
    else if (this.mmshgmember.length<1)
    {
      this.HandleMessage(true, MessageType.Error, 'SHG Member can not be Blank');
      return;
    }
    else
    {
    //this.isRetrieve = false;
    this.insertSaveData();
    }
  }
  deleteData(){
    if (this.mmshgmember.length >= 1) {
      if(this.mmshgmember[this.mmshgmember.length-1].shg_member_id>0)
      {
      if (!(confirm('Are you sure you want to Delete Entire Group !!! '))) {
        return;
      }
      }
      }
    const _shgDM = new ShgDM();
    var _mmshg = new mm_shg();
    _mmshg.shg_id              =this.f.shg_id.value;              
    _mmshg.brn_cd              =this.sys.BranchCode; 
    _shgDM.mmshg=_mmshg;
    this.isLoading=true;
    this.svc.addUpdDel<any>('UCIC/DeleteShgData', _shgDM).subscribe(
      res => {
        debugger;
        this.clearData();
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess, 'Transaction Deleted Successfully!!!');
      },
      err => { debugger; this.isLoading=false;
        this.HandleMessage(true, MessageType.Error, 'Delete Failed!!!');}
    );
  }
  backScreen(){this.router.navigate([this.sys.BankName + '/la']); }
  private getVillageMaster(): void { 
    debugger;
    this.svc.addUpdDel<any>('Mst/GetVillageMaster', null).subscribe(
      res => {
        debugger;
        this.villageList = res;
      },
      err => { debugger; }
    );
  }
  public getShgData(): void { 
    debugger;
    const _shgDM = new ShgDM();
    const _mmshg = new mm_shg();
    _mmshg.shg_id=+this.f.shg_id.value;
    _shgDM.mmshg=_mmshg;
    this.isLoading=true;
    this.svc.addUpdDel<any>('UCIC/GetShgData', _shgDM).subscribe(
      res => {
        debugger;
        if (res.mmshg.shg_id===0)
        {
          this.isLoading=false;
          this.shgFrm.disable();
          this.shgFrm.controls.shg_id.enable();
          this.HandleMessage(true, MessageType.Warning, 'No Data Found!!!');
          return;
        }
        this.shgRet = res;
        this.shgFrm.patchValue({
          shg_id : this.shgRet.mmshg.shg_id,
          brn_cd : this.shgRet.mmshg.brn_cd,
          chairman_name : this.shgRet.mmshg.chairman_name,
          secretary_name : this.shgRet.mmshg.secretary_name,
          village : this.shgRet.mmshg.village,
          gruop_sex : this.shgRet.mmshg.gruop_sex,
           monthly_subcription : this.shgRet.mmshg.monthly_subcription,
           min_member_limit : this.shgRet.mmshg.min_member_limit,
           male_member : this.shgRet.mmshg.male_member,
           female_member :this.shgRet.mmshg.female_member,
           caste_sc :this.shgRet.mmshg.caste_sc,
           caste_st : this.shgRet.mmshg.caste_st,
           caste_gen : this.shgRet.mmshg.caste_gen,
           caste_muslim : this.shgRet.mmshg.caste_muslim,
          form_dt :this.shgRet.mmshg.form_dt,
          sb_accno : this.shgRet.mmshg.sb_accno
        });
        this.mmshgmember=this.shgRet.mmshgmember;
        this.shgFrm.enable();
        this.shgFrm.controls.shg_id.disable();
        this.isLoading=false;
      },
      err => { debugger; this.isLoading=false;
        this.shgFrm.disable();
        this.shgFrm.controls.shg_id.enable();
      }
    );
  }
  public getShgDataAfterSave(shgid:any): void { 
    debugger;
    const _shgDM = new ShgDM();
    const _mmshg = new mm_shg();
    _mmshg.shg_id=+shgid;
    _shgDM.mmshg=_mmshg;
    this.isLoading=true;
    this.svc.addUpdDel<any>('UCIC/GetShgData', _shgDM).subscribe(
      res => {
        debugger;
        this.shgRet = res;
        this.shgFrm.patchValue({
          shg_id : this.shgRet.mmshg.shg_id,
          brn_cd : this.shgRet.mmshg.brn_cd,
          chairman_name : this.shgRet.mmshg.chairman_name,
          secretary_name : this.shgRet.mmshg.secretary_name,
          village : this.shgRet.mmshg.village,
          gruop_sex : this.shgRet.mmshg.gruop_sex,
           monthly_subcription : this.shgRet.mmshg.monthly_subcription,
           min_member_limit : this.shgRet.mmshg.min_member_limit,
           male_member : this.shgRet.mmshg.male_member,
           female_member :this.shgRet.mmshg.female_member,
           caste_sc :this.shgRet.mmshg.caste_sc,
           caste_st : this.shgRet.mmshg.caste_st,
           caste_gen : this.shgRet.mmshg.caste_gen,
           caste_muslim : this.shgRet.mmshg.caste_muslim,
          form_dt :this.shgRet.mmshg.form_dt,
          sb_accno : this.shgRet.mmshg.sb_accno
        });
        this.mmshgmember=this.shgRet.mmshgmember;
        this.isRetrieve = false;
        this.isLoading=false;
      },
      err => { debugger; this.isLoading=false;}
    );
  }
  public insertSaveData()
  {
    debugger;
    const _shgDM = new ShgDM();
    var _mmshgmember = [];
    var _mmshg = new mm_shg();
    _mmshg.shg_id              =this.f.shg_id.value;              
    _mmshg.brn_cd              =this.sys.BranchCode;              
    _mmshg.chairman_name       =this.f.chairman_name.value;       
    _mmshg.secretary_name      =this.f.secretary_name.value;      
    _mmshg.village             =this.f.village.value;             
    _mmshg.gruop_sex           =this.f.gruop_sex.value;           
    _mmshg.monthly_subcription =this.f.monthly_subcription.value; 
    _mmshg.min_member_limit    =this.f.min_member_limit.value;    
    _mmshg.male_member         =this.f.male_member.value;         
    _mmshg.female_member       =this.f.female_member.value;       
    _mmshg.caste_sc            =this.f.caste_sc.value;            
    _mmshg.caste_st            =this.f.caste_st.value;            
    _mmshg.caste_gen           =this.f.caste_gen.value;           
    _mmshg.caste_muslim        =this.f.caste_muslim.value;        
    _mmshg.form_dt             =this.f.form_dt.value;             
    _mmshg.sb_accno            =this.f.sb_accno.value;
    this.mmshgmember.forEach(x=>x.brn_cd=this.sys.BranchCode );
    _mmshgmember =this.mmshgmember;            
    _shgDM.mmshg=_mmshg;
    _shgDM.mmshgmember=_mmshgmember;
    this.isLoading=true;
    if (this.f.shg_id.value>0)
    {
    this.svc.addUpdDel<any>('UCIC/UpdateShgData', _shgDM).subscribe(
      res => {
        debugger;
        this.shgFrm.patchValue({
          shg_id : this.f.shg_id.value         
        });
        const shgidtmp=this.f.shg_id.value;
        this.clearData();
        this.getShgDataAfterSave(shgidtmp);
        this.isLoading=false;
        this.HandleMessage(true, MessageType.Sucess, 'Transaction Updated Successfully!!!');
      },
      err => { debugger; this.isLoading=false;
        this.HandleMessage(true, MessageType.Error, 'Updated Failed!!!');}
    );
    }
    else
    {
      _shgDM.mmshg.shg_id=0;
      this.svc.addUpdDel<any>('UCIC/InsertShgData', _shgDM).subscribe(
        res => {
          debugger;
          this.shgFrm.patchValue({
            shg_id : res         
          });
          this.clearData();
          this.getShgDataAfterSave(res);
          this.isLoading=false;
          this.HandleMessage(true, MessageType.Sucess,
            'Transaction Saved Successfully. Shg Code : '
            + res.toString());
        },
        err => { debugger; this.isLoading=false;
          this.HandleMessage(true, MessageType.Error, 'Insert Failed!!!');}
      );
    }
  }
  private HandleMessage(show: boolean, type: MessageType = null, message: string = null) {
    this.showMsg = new ShowMessage();
    this.showMsg.Show = show;
    this.showMsg.Type = type;
    this.showMsg.Message = message;
  }
  

}
